# usage: findw.py "phrase" [after_seconds] -> sequence time of phrase start in user cut transcript
import json, sys, re, unicodedata
t = json.load(open(r"C:/Users/lolo/Documents/ae-mcp-bridge/transcripts/user_cut.json", encoding="utf-8"))
def n(s):
    s = unicodedata.normalize("NFD", s.lower()); return re.sub(r"[^a-z0-9]", "", "".join(c for c in s if unicodedata.category(c) != "Mn"))
W = [(w["start"], w["end"], n(w["text"])) for s in t["segments"] for w in s["words"]]
for arg in sys.argv[1:]:
    ph, after = (arg.split("@") + ["0"])[:2]; ph = [n(x) for x in ph.split()]; after = float(after)
    hit = None
    for i in range(len(W)):
        if W[i][0] < after: continue
        if all(i + k < len(W) and W[i + k][2].startswith(ph[k]) for k in range(len(ph))): hit = (W[i][0], W[i + len(ph) - 1][1]); break
    print("%-40s %s" % (arg, "%.2f-%.2f" % hit if hit else "NOT FOUND"))
