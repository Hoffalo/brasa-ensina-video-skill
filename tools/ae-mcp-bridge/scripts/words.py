# usage: words.py FILE start end  -> word timings in that range
import json, sys
f, a, b = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
t = json.load(open(r"C:/Users/lolo/Documents/ae-mcp-bridge/transcripts/%s.json" % f, encoding="utf-8"))
out = []
for s in t["segments"]:
    for w in s["words"]:
        if a <= w["start"] <= b: out.append("%.2f-%.2f %s" % (w["start"], w["end"], w["text"]))
sys.stdout.buffer.write((" | ".join(out) + "\n").encode("utf-8"))
