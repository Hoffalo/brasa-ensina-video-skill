# Annotate every transcript segment with the script line it best matches.
import json, re, sys, unicodedata, difflib, glob, os
D = os.path.expanduser("~/Documents/ae-mcp-bridge/")
lines = json.load(open(D + "pb_lines.json", encoding="utf-8"))
def norm(s):
    s = unicodedata.normalize("NFD", s.lower()); s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.replace("para ", "pra ").replace(" para", " pra")
    return re.findall(r"[a-z0-9]+", s)
L = [(b, l, norm(t)) for b, l, t in lines]
def best(words):
    out = []
    for b, l, lw in L:
        sm = difflib.SequenceMatcher(None, words, lw, autojunk=False)
        m = sum(x.size for x in sm.get_matching_blocks())
        prec = m / max(1, len(words)); cov = m / max(1, len(lw))
        out.append((prec * 0.6 + cov * 0.4, l, prec, cov))
    out.sort(reverse=True); return out[0]
res = []
for f in sorted(glob.glob(D + "transcripts/T19A57*.json")):
    t = json.load(open(f, encoding="utf-8")); name = os.path.basename(f)[:-5]
    for s in t["segments"]:
        w = norm(s["text"])
        if len(w) < 2: sc = (0, "-", 0, 0)
        else: sc = best(w)
        res.append({"file": name, "start": round(s["start"], 2), "end": round(s["end"], 2), "text": s["text"], "line": sc[1] if sc[2] > 0.5 else "-", "prec": round(sc[2], 2), "cov": round(sc[3], 2)})
json.dump(res, open(D + "pb_align.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
with open(D + "pb_align.txt", "w", encoding="utf-8") as o:
    for r in res: o.write("%s %7.2f-%7.2f %-4s p%.2f c%.2f | %s\n" % (r["file"][-4:], r["start"], r["end"], r["line"], r["prec"], r["cov"], r["text"]))
print(len(res))
