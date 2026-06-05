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
PORT = int(os.environ.get("WHISPER_PORT") or os.environ.get("PORT", 5001))


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


def do_transcribe(tmp_path, initial_prompt=None):
    """Core transcription logic — returns text string"""
    segments, info = model.transcribe(
        tmp_path,
        language="en",
        beam_size=3,
        best_of=3,
        temperature=0.0,
        initial_prompt=initial_prompt or None,
        vad_filter=True,
        vad_parameters=dict(
            min_silence_duration_ms=250,
        ),
        condition_on_previous_text=False,
        no_speech_threshold=0.45,
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

        full_text, info = do_transcribe(tmp_path, request.form.get("initialPrompt"))
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
    initial_prompt = request.form.get("initialPrompt", "")

    if not audio_file.filename:
        return jsonify({"error": "Empty filename"}), 400

    _, ext = os.path.splitext(audio_file.filename)
    if ext.lower() not in ALLOWED_EXTENSIONS:
        return jsonify({"error": f"Unsupported format: {ext}"}), 400

    tmp_fd, tmp_path = tempfile.mkstemp(suffix=ext)
    try:
        t_start = time.time()
        audio_file.save(tmp_path)

        if not initial_prompt and target_texts:
            initial_prompt = f"Expected English learner answers: {target_texts[:800]}"

        full_text, info = do_transcribe(tmp_path, initial_prompt)
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
            "missingWords": result["missingWords"],
            "extraWords": result["extraWords"],
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
    ones = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
    teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
    tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
    ordinal_words = {
        1: "first", 2: "second", 3: "third", 4: "fourth", 5: "fifth",
        6: "sixth", 7: "seventh", 8: "eighth", 9: "ninth", 10: "tenth",
        11: "eleventh", 12: "twelfth", 13: "thirteenth", 14: "fourteenth",
        15: "fifteenth", 16: "sixteenth", 17: "seventeenth", 18: "eighteenth",
        19: "nineteenth", 20: "twentieth", 30: "thirtieth", 40: "fortieth",
        50: "fiftieth", 60: "sixtieth", 70: "seventieth", 80: "eightieth",
        90: "ninetieth"
    }

    def integer_to_words(value):
        try:
            number = int(value)
        except:
            return str(value)
        if number < 0 or number > 999999:
            return str(value)
        if number < 10:
            return ones[number]
        if number < 20:
            return teens[number - 10]
        if number < 100:
            ten, rest = divmod(number, 10)
            return f"{tens[ten]} {ones[rest]}" if rest else tens[ten]
        if number < 1000:
            hundred, rest = divmod(number, 100)
            return f"{ones[hundred]} hundred {integer_to_words(rest)}" if rest else f"{ones[hundred]} hundred"
        thousand, rest = divmod(number, 1000)
        return f"{integer_to_words(thousand)} thousand {integer_to_words(rest)}" if rest else f"{integer_to_words(thousand)} thousand"

    def ordinal_to_words(value):
        try:
            number = int(value)
        except:
            return str(value)
        if number <= 0 or number > 999999:
            return str(value)
        if number in ordinal_words:
            return ordinal_words[number]
        if number < 100:
            ten = (number // 10) * 10
            rest = number % 10
            return f"{tens[ten // 10]} {ordinal_words[rest]}"
        cardinal = integer_to_words(number).split()
        last = cardinal[-1]
        reverse_ones = {word: idx for idx, word in enumerate(ones)}
        reverse_teens = {word: idx + 10 for idx, word in enumerate(teens)}
        word_to_ordinal = {
            **{word: ordinal_words.get(idx) for word, idx in reverse_ones.items()},
            **{word: ordinal_words.get(idx) for word, idx in reverse_teens.items()},
            "twenty": "twentieth", "thirty": "thirtieth", "forty": "fortieth",
            "fifty": "fiftieth", "sixty": "sixtieth", "seventy": "seventieth",
            "eighty": "eightieth", "ninety": "ninetieth",
        }
        cardinal[-1] = word_to_ordinal.get(last, f"{last}th")
        return " ".join(cardinal)

    def is_grouped_thousands(value):
        return re.fullmatch(r"\d{1,3}(,\d{3})+", str(value)) is not None

    def number_token_to_words(value):
        token = str(value)
        if "," in token and not is_grouped_thousands(token.split(".")[0]):
            return " ".join(decimal_to_words(part) for part in token.split(","))
        return decimal_to_words(token)

    def decimal_to_words(value):
        whole, _, decimal = str(value).replace(",", "").partition(".")
        if not decimal:
            return integer_to_words(whole)
        digits = " ".join(ones[int(ch)] if ch.isdigit() else ch for ch in decimal)
        return f"{integer_to_words(whole)} point {digits}"

    def money_to_words(raw_value, singular, plural):
        if "," in str(raw_value) and not is_grouped_thousands(str(raw_value).split(".")[0]):
            return " ".join(decimal_to_words(part) for part in str(raw_value).split(",")) + f" {plural}"
        clean = str(raw_value).replace(",", "")
        whole_text, _, cents_text = clean.partition(".")
        whole = int(whole_text or 0)
        cents = int((cents_text + "00")[:2]) if cents_text else 0
        major = f"{integer_to_words(whole)} {singular if whole == 1 else plural}" if whole > 0 else ""
        minor = f"{integer_to_words(cents)} {'cent' if cents == 1 else 'cents'}" if cents > 0 else ""
        return " ".join(part for part in [major, minor] if part) or f"zero {plural}"

    def normalize_numbers_and_symbols(text):
        money_units = {
            "$": ("dollar", "dollars"),
            "€": ("euro", "euros"),
            "£": ("pound", "pounds"),
            "¥": ("yen", "yen"),
        }
        for symbol, (singular, plural) in money_units.items():
            escaped = re.escape(symbol)
            text = re.sub(rf"{escaped}\s*(\d[\d,]*(?:\.\d+)?)", lambda m: money_to_words(m.group(1), singular, plural), text)
            text = re.sub(rf"(\d[\d,]*(?:\.\d+)?)\s*{escaped}", lambda m: money_to_words(m.group(1), singular, plural), text)
        text = re.sub(r"\bbucks?\b", "dollars", text)
        text = re.sub(r"\b(\d[\d,]*)(st|nd|rd|th)\b", lambda m: ordinal_to_words(m.group(1).replace(",", "")), text)
        text = re.sub(r"\b(\d[\d,]*(?:\.\d+)?)\s*%", lambda m: f"{number_token_to_words(m.group(1))} percent", text)
        text = re.sub(r"\b(\d[\d,]*\.\d+)\b", lambda m: number_token_to_words(m.group(1)), text)
        text = re.sub(r"\b\d[\d,]*\b", lambda m: number_token_to_words(m.group(0)), text)
        return text

    def normalize(text):
        text = (text or "").lower().strip()
        for short, expanded in contractions.items():
            text = re.sub(rf"\b{re.escape(short)}\b", expanded, text)
        text = normalize_numbers_and_symbols(text)
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
        return ratio if ratio >= 0.68 else 0.0

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
        score = round(max(0, min(1, (0.76 * recall) + (0.18 * f1) + (0.06 * length_ratio))) * 100)

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
