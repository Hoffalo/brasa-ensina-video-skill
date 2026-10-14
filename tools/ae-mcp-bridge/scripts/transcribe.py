# usage: transcribe.py <video> <out.json> [max_seconds]
import sys, os, json, subprocess, tempfile, glob, site
for sp in site.getsitepackages():
    for d in glob.glob(os.path.join(sp, "nvidia", "*", "bin")):
        os.add_dll_directory(d); os.environ["PATH"] = d + os.pathsep + os.environ["PATH"]
src, out = sys.argv[1], sys.argv[2]
maxs = float(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3] != "-" else None
ss = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0
wav = os.path.join(tempfile.gettempdir(), os.path.basename(src) + ".wav")
cmd = ["ffmpeg", "-y", "-v", "error", "-ss", str(ss), "-i", src, "-ac", "1", "-ar", "16000"] + (["-t", str(maxs)] if maxs else []) + [wav]
subprocess.run(cmd, check=True)
from faster_whisper import WhisperModel
import wave, numpy as np
wf = wave.open(wav, "rb"); audio = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0; wf.close()
try:
    m = WhisperModel("large-v3", device="cuda", compute_type="float16"); dev = "cuda"
    segs, info = m.transcribe(audio, language="pt", word_timestamps=True, vad_filter=True, beam_size=5, condition_on_previous_text=False)
    segs = list(segs)
except Exception as e:
    print("cuda failed:", str(e)[:200], file=sys.stderr)
    m = WhisperModel("medium", device="cpu", compute_type="int8"); dev = "cpu"
    segs, info = m.transcribe(audio, language="pt", word_timestamps=True, beam_size=5)
    segs = list(segs)
res = {"source": os.path.basename(src), "device": dev, "segments": []}
for s in segs:
    res["segments"].append({"start": s.start + ss, "end": s.end + ss, "text": s.text.strip(),
                            "words": [{"start": w.start + ss, "end": w.end + ss, "text": w.word.strip(), "p": round(w.probability, 3)} for w in (s.words or [])]})
json.dump(res, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print("done", src, dev, len(res["segments"]))
