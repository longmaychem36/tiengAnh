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

# ==========================================
# Configuration - optimized for speed
# ==========================================
MODEL_SIZE = os.environ.get("WHISPER_MODEL", "base")
DEVICE = os.environ.get("WHISPER_DEVICE", "cpu")
COMPUTE_TYPE = os.environ.get("WHISPER_COMPUTE", "int8")
PORT = int(os.environ.get("WHISPER_PORT", 5001))

# ==========================================
# Initialize Model
# ==========================================
try:
    model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type=COMPUTE_TYPE, cpu_threads=4)
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


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


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
        audio_file.save(tmp_path)
        
        # Speed-optimized transcription settings
        segments, info = model.transcribe(
            tmp_path,
            language="en",
            beam_size=1,              # Fastest: greedy search
            best_of=1,                # No sampling alternatives
            temperature=0.0,
            vad_filter=True,
            vad_parameters=dict(
                min_silence_duration_ms=300,
            ),
            condition_on_previous_text=False,  # Faster, no context dependency
            no_speech_threshold=0.6,
        )

        full_text = ""
        for segment in segments:
            full_text += segment.text
        full_text = full_text.strip()

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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=False)
