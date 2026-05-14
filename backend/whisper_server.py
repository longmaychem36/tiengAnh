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
# Configuration - balanced accuracy/speed
# ==========================================
MODEL_SIZE = os.environ.get("WHISPER_MODEL", "base")
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
    """Analyze transcript against targets with ordered fuzzy word alignment."""
    import re

    contractions = {
        "i'm": "i am", "you're": "you are", "he's": "he is", "she's": "she is",
        "it's": "it is", "we're": "we are", "they're": "they are",
        "i've": "i have", "you've": "you have", "we've": "we have", "they've": "they have",
        "i'll": "i will", "you'll": "you will", "we'll": "we will", "they'll": "they will",
        "don't": "do not", "doesn't": "does not", "didn't": "did not",
        "can't": "can not", "cannot": "can not", "won't": "will not",
        "isn't": "is not", "aren't": "are not", "wasn't": "was not", "weren't": "were not",
        "there's": "there is", "that's": "that is", "what's": "what is"
    }
    filler_words = {"um", "uh", "erm", "ah", "hmm"}
    light_words = {"a", "an", "the", "to", "of", "in", "on", "at", "for", "and", "or"}

    def normalize(text):
        text = (text or "").lower().strip()
        for short, expanded in contractions.items():
            text = re.sub(rf"\b{re.escape(short)}\b", expanded, text)
        text = re.sub(r"[^a-z0-9\s']", " ", text)
        words = [w for w in text.split() if w and w not in filler_words]
        return words

    def light_stem(word):
        if len(word) > 4 and word.endswith("ies"):
            return word[:-3] + "y"
        if len(word) > 4 and word.endswith("es"):
            return word[:-2]
        if len(word) > 3 and word.endswith("s"):
            return word[:-1]
        return word

    def levenshtein(a, b):
        if not a: return len(b)
        if not b: return len(a)
        prev = list(range(len(a) + 1))
        for i, bc in enumerate(b, 1):
            curr = [i]
            for j, ac in enumerate(a, 1):
                cost = 0 if ac == bc else 1
                curr.append(min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost))
            prev = curr
        return prev[-1]

    def word_similarity(a, b):
        if a == b:
            return 1.0
        if light_stem(a) == light_stem(b):
            return 0.96
        max_len = max(len(a), len(b), 1)
        ratio = 1 - (levenshtein(a, b) / max_len)
        if max_len <= 3:
            return ratio if ratio >= 0.67 else 0.0
        return ratio if ratio >= 0.72 else 0.0

    def word_weight(word):
        return 0.45 if word in light_words else 1.0

    def align_score(target_words, user_words):
        target_len = len(target_words)
        user_len = len(user_words)
        if target_len == 0:
            return {"score": 0, "matched": [], "missing": [], "extra": user_words}

        dp = [[0.0] * (user_len + 1) for _ in range(target_len + 1)]
        back = [[None] * (user_len + 1) for _ in range(target_len + 1)]

        for i in range(1, target_len + 1):
            for j in range(1, user_len + 1):
                best = dp[i - 1][j]
                move = "skip_target"
                if dp[i][j - 1] > best:
                    best = dp[i][j - 1]
                    move = "skip_user"

                sim = word_similarity(target_words[i - 1], user_words[j - 1])
                if sim > 0:
                    candidate = dp[i - 1][j - 1] + (sim * word_weight(target_words[i - 1]))
                    if candidate > best:
                        best = candidate
                        move = "match"

                dp[i][j] = best
                back[i][j] = move

        matched_target = set()
        matched_user = set()
        i, j = target_len, user_len
        while i > 0 and j > 0:
            move = back[i][j]
            if move == "match":
                matched_target.add(i - 1)
                matched_user.add(j - 1)
                i -= 1
                j -= 1
            elif move == "skip_user":
                j -= 1
            else:
                i -= 1

        target_weight = sum(word_weight(w) for w in target_words) or 1
        user_weight = sum(word_weight(w) for w in user_words) or 1
        matched_weight = dp[target_len][user_len]
        recall = matched_weight / target_weight
        precision = matched_weight / user_weight
        f1 = 0 if precision + recall == 0 else (2 * precision * recall) / (precision + recall)
        length_ratio = min(len(user_words), target_len) / max(len(user_words), target_len, 1)
        score = round(max(0, min(1, (0.72 * recall) + (0.20 * f1) + (0.08 * length_ratio))) * 100)

        missing = [w for idx, w in enumerate(target_words) if idx not in matched_target and word_weight(w) >= 1]
        extra = [w for idx, w in enumerate(user_words) if idx not in matched_user and word_weight(w) >= 1]
        return {"score": score, "missing": missing[:5], "extra": extra[:5]}

    user_words = normalize(transcript)
    best = {"score": 0, "matchedText": None, "missing": [], "extra": []}

    for target_text in target_texts:
        if not target_text:
            continue
        target_words = normalize(target_text)
        result = align_score(target_words, user_words)
        if result["score"] > best["score"]:
            best = {**result, "matchedText": target_text}

    if best["score"] >= 85:
        feedback = "Rất tốt! Bạn nói khá sát câu mẫu."
    elif best["score"] >= 65:
        feedback = "Khá ổn, nhưng còn vài từ chưa rõ hoặc chưa đúng thứ tự."
    else:
        feedback = "Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm."

    if best["missing"] and best["score"] < 90:
        feedback += " Cần chú ý: " + ", ".join(best["missing"]) + "."

    return {
        "score": best["score"],
        "feedback": feedback,
        "matchedText": best["matchedText"],
        "missingWords": best["missing"],
        "extraWords": best["extra"]
    }


if __name__ == "__main__":
    print(f"[Whisper] Server running on port {PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=False)
