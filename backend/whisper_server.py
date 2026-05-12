"""
==============================================
Whisper Speech Recognition Server
Powered by faster-whisper (OpenAI Whisper)
==============================================
"""

import os
import sys
import tempfile
import traceback
import logging

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
    os.environ["HF_HUB_DISABLE_SYMLINKS"] = "1"

# Suppress noisy logs
logging.getLogger("faster_whisper").setLevel(logging.WARNING)
logging.getLogger("ctranslate2").setLevel(logging.WARNING)
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from flask import Flask, request, jsonify
from flask_cors import CORS
from faster_whisper import WhisperModel
import time

# ==========================================
# Configuration - optimized for SPEED
# ==========================================
MODEL_SIZE = os.environ.get("WHISPER_MODEL", "tiny")   # tiny = 2-3x faster than base
DEVICE = os.environ.get("WHISPER_DEVICE", "cpu")
COMPUTE_TYPE = os.environ.get("WHISPER_COMPUTE", "int8")
PORT = int(os.environ.get("WHISPER_PORT", 5001))


# ==========================================
# Initialize Model (pre-load for fast first request)
# ==========================================
print(f"[Whisper] Loading model '{MODEL_SIZE}' on {DEVICE} ({COMPUTE_TYPE})...")
t0 = time.time()
try:
    model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type=COMPUTE_TYPE, cpu_threads=4)
    print(f"[Whisper] Model loaded in {time.time()-t0:.1f}s")
except Exception as e:
    print(f"[ERROR] Failed to load model: {e}")
    sys.exit(1)

# ==========================================
# Flask App
# ==========================================
app = Flask(__name__)
CORS(app)

# Suppress Flask request logs
log = logging.getLogger('werkzeug')
log.setLevel(logging.WARNING)

ALLOWED_EXTENSIONS = {'.wav', '.webm', '.ogg', '.mp3', '.m4a', '.flac', '.mp4'}


def do_transcribe(tmp_path):
    """Core transcription logic — returns text string"""
    segments, info = model.transcribe(
        tmp_path,
        language="en",
        beam_size=1,              # Fastest: greedy search
        best_of=1,                # No sampling alternatives
        temperature=0.0,
        vad_filter=True,
        vad_parameters=dict(
            min_silence_duration_ms=200,   # Reduced from 300 for faster VAD
        ),
        condition_on_previous_text=False,
        no_speech_threshold=0.6,
        word_timestamps=False,     # Skip word-level timestamps for speed
    )

    full_text = ""
    for segment in segments:
        full_text += segment.text
    return full_text.strip(), info


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": MODEL_SIZE, "device": DEVICE})


@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "file" not in request.files:
        return jsonify({"error": "No audio file provided."}), 400

    audio_file = request.files["file"]
    if not audio_file.filename:
        return jsonify({"error": "Empty filename"}), 400

    _, ext = os.path.splitext(audio_file.filename)
    if ext.lower() not in ALLOWED_EXTENSIONS:
        return jsonify({"error": f"Unsupported format: {ext}"}), 400

    tmp_fd, tmp_path = tempfile.mkstemp(suffix=ext)
    try:
        t_start = time.time()
        audio_file.save(tmp_path)

        full_text, info = do_transcribe(tmp_path)
        elapsed = time.time() - t_start
        print(f"[Whisper] Transcribed in {elapsed:.2f}s: '{full_text[:60]}'")

        return jsonify({
            "text": full_text,
            "language": info.language,
            "language_probability": round(info.language_probability, 2),
            "duration": round(info.duration, 2)
        })

    except Exception as e:
        return jsonify({"error": f"Transcription failed: {str(e)}"}), 500

    finally:
        try:
            os.close(tmp_fd)
            os.unlink(tmp_path)
        except:
            pass


@app.route("/transcribe-and-analyze", methods=["POST"])
def transcribe_and_analyze():
    """
    Combined endpoint: transcribe audio + analyze against target texts in one request.
    Saves one network round-trip vs separate transcribe + analyze calls.
    """
    if "file" not in request.files:
        return jsonify({"error": "No audio file provided."}), 400

    audio_file = request.files["file"]
    target_texts = request.form.get("targetTexts", "")

    if not audio_file.filename:
        return jsonify({"error": "Empty filename"}), 400

    _, ext = os.path.splitext(audio_file.filename)
    if ext.lower() not in ALLOWED_EXTENSIONS:
        return jsonify({"error": f"Unsupported format: {ext}"}), 400

    tmp_fd, tmp_path = tempfile.mkstemp(suffix=ext)
    try:
        t_start = time.time()
        audio_file.save(tmp_path)

        full_text, info = do_transcribe(tmp_path)
        elapsed = time.time() - t_start
        print(f"[Whisper] Transcribed in {elapsed:.2f}s: '{full_text[:60]}'")

        # Parse target texts (comma-separated or JSON array)
        import json
        try:
            targets = json.loads(target_texts) if target_texts.startswith('[') else [t.strip() for t in target_texts.split('|||')]
        except:
            targets = [t.strip() for t in target_texts.split('|||')]

        # Analyze: find best matching target
        result = analyze_transcript(full_text, targets)

        return jsonify({
            "text": full_text,
            "transcript": full_text,
            "score": result["score"],
            "feedback": result["feedback"],
            "matchedText": result["matchedText"],
            "duration": round(info.duration, 2),
            "processingTime": round(elapsed, 2)
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500

    finally:
        try:
            os.close(tmp_fd)
            os.unlink(tmp_path)
        except:
            pass


def analyze_transcript(transcript, target_texts):
    """Analyze transcript against target texts using word-level similarity"""
    def levenshtein(a, b):
        if len(a) == 0: return len(b)
        if len(b) == 0: return len(a)
        matrix = [[0]*(len(a)+1) for _ in range(len(b)+1)]
        for i in range(len(b)+1): matrix[i][0] = i
        for j in range(len(a)+1): matrix[0][j] = j
        for i in range(1, len(b)+1):
            for j in range(1, len(a)+1):
                if b[i-1] == a[j-1]:
                    matrix[i][j] = matrix[i-1][j-1]
                else:
                    matrix[i][j] = min(matrix[i-1][j-1]+1, matrix[i][j-1]+1, matrix[i-1][j]+1)
        return matrix[len(b)][len(a)]

    def is_similar(target, user):
        if target == user: return True
        if target in user or user in target: return True
        dist = levenshtein(target, user)
        if len(target) <= 3 and dist <= 1: return True
        if len(target) > 3 and dist <= 2: return True
        return False

    import re
    user_words = re.sub(r'[.,?!]', '', transcript.lower()).split()

    max_score = 0
    best_match = None

    for target_text in target_texts:
        if not target_text: continue
        target_words = re.sub(r'[.,?!]', '', target_text.lower()).split()
        match_count = sum(1 for tw in target_words if any(is_similar(tw, uw) for uw in user_words))
        score = round((match_count / max(len(target_words), 1)) * 100)
        if score > max_score:
            max_score = score
            best_match = target_text

    feedback = "Thật tuyệt vời, bạn nói rất tốt!" if max_score >= 60 else "Chưa được chính xác lắm, hãy thử lại nhé!"

    return {
        "score": max_score,
        "feedback": feedback,
        "matchedText": best_match
    }


if __name__ == "__main__":
    print(f"[Whisper] Server running on port {PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=False)
