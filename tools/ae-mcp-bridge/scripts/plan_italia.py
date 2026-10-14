# Step-3 planner for "Estudar na Italia" (from plan_cv.py). Keeps the user's existing CRT TRs + their glitches and the
# vinheta audio; rebuilds every other SFX by the skill rules. Comp time -> sequence time via SEG (comp, a, b, src_in).
import json, unicodedata, sys, collections
D = "C:/Users/lolo/Documents/ae-mcp-bridge/"
ev = json.load(open(D + "ev_it.json", encoding="utf-8"))["o"]
N = lambda s: unicodedata.normalize("NFC", s)

SEG = [("G1m intro lista", 10.45, 14.95, 0), ("G22m mestrado", 21.95, 28.40, 0), ("IT1 mesmo curso", 43.0, 52.3, 0),
       ("G20", 52.35, 59.83, 0), ("G23m dica", 73.43, 80.62, 2.47), ("G23", 107.27, 112.72, 0), ("G23", 114.35, 120.88, 7.07),
       ("G24", 127.63, 144.15, 0), ("G24", 146.02, 157.72, 18.38), ("G25", 167.03, 172.80, 0), ("G26", 184.38, 194.77, 0),
       ("IT2 resumindo", 225.2, 234.4, 0)]
NEGCARDS = ["IT card MILAO ROMA"]
CARDS = [("G19", 38.70, 39.90), ("IT card INGLES", 65.3, 68.6), ("G21", 86.92, 89.82), ("G22", 91.22, 95.27), ("IT card MESES", 98.1, 101.0),
         ("IT card AGOSTO", 159.3, 162.0), ("IT card MILAO ROMA", 176.8, 179.9), ("IT card PADUA NAPOLES", 181.0, 183.6),
         ("G28", 199.77, 206.00), ("G27", 205.73, 209.28), ("G29", 208.98, 212.52), ("G30", 215.25, 218.82)]
NEWCARDS = {"IT card INGLES": "000f42da", "IT card MESES": "000f42d9", "IT card AGOSTO": "000f42db", "IT card MILAO ROMA": "000f42d8", "IT card PADUA NAPOLES": "000f42d7"}
NEWGFX = {"G1m intro lista": "000f42e0", "G22m mestrado": "000f42df", "G23m dica": "000f42de", "IT1 mesmo curso": "000f42dd", "IT2 resumindo": "000f42dc"}
ZOOMS = [2.74, 33.34, 69.33, 102.46, 105.77, 159.06, 195.93, 223.55]   # first Motion-scale key of each VISIBLE zoom
NEWTR = [43.0, 225.2, 234.4]                                             # new graphic edges needing a CRT TR
SFXID = {"MUS18": "000f42b6", "RETRO": "000f42d4", "CLICK": "000f4290", "POS": "000f428c", "FAIL": "000f42d5", "HIT": "000f4286",
         "W_DEEP": "000f42d6", "W_CAR": "000f429d", "W_SWL": "000f4288", "W_LOW": "000f42a0", "GL1": "000f4287", "GL2": "000f4285"}
TRV = [("20", "000f427b"), ("22", "000f427d"), ("25", "000f427f")]

TITLE = ["Titulo", "Comprova", "Como o processo", "Um direito", "Col0 head", "Col1 head"]
POSV = ["\u20ac7.000", "de \u20ac140", "\u20ac200", "\u20ac150", "\u20ac30", "Paga menos"]
SKIP = ["Abertura", "Camera"]
def classify(e):
    n = N(e["layer"]).strip(); t = N(e.get("text") or "")
    if e["type"] in ("null", "cam"): return None
    if any(n.startswith(s) for s in SKIP): return None
    if any(n.startswith(N(x)) for x in TITLE): return "TITLE"
    if any(N(x) in n or N(x) in t for x in POSV): return "POS"
    if e["type"] == "shape": return "GFX"
    return "CAP"
SFX = {"TITLE": "MUS18", "POS": "POS", "NEG": "FAIL", "CAP": "CLICK", "GFX": "RETRO"}
PEAK = {"W_DEEP": 0.55, "W_LOW": 0.85, "W_CAR": 0.80, "W_SWL": 0.15}
def move_woosh(d): return "W_LOW" if d >= 1.2 else "W_CAR" if d >= 0.5 else "W_SWL"
def seq_of(c, t, tail=0.25):
    return [a + (t - s) for (cc, a, b, s) in SEG if cc == c and a - 0.01 <= a + (t - s) <= b - tail]

out = []
for e in ev:
    cat = classify(e)
    if cat is None or e["first"] is None: continue
    for st in seq_of(e["comp"], e["first"]):
        out.append({"time": round(st, 3), "key": SFX[cat], "label": e["comp"][:8] + " " + N(e["layer"])[:22], "cat": cat})
    # camera moves: Null keys come in (start, end) pairs separated by holds
for e in ev:
    if e["type"] != "null" or len(e["keys"]) < 2: continue
    k = e["keys"]
    for i in range(0, len(k) - 1, 2):
        a, b = k[i], k[i + 1]; w = move_woosh(b - a)
        for st in seq_of(e["comp"], (a + b) / 2 - PEAK[w], tail=0):
            out.append({"time": round(st, 3), "key": w, "label": e["comp"][:8] + " camera %.2fs" % (b - a), "cat": "MOVE"})
for c, a, b in CARDS:   # G0: ONE sfx in (sword; Fail if negative); click where Smooth Out starts (clip end - 0.317)
    out.append({"time": a, "key": "FAIL" if c in NEGCARDS else "HIT", "label": c + " card in", "cat": "CARD"})
    out.append({"time": round(b - 0.317, 3), "key": "CLICK", "label": c + " card out", "cat": "CARD"})
for z in ZOOMS:
    out.append({"time": z, "key": "W_DEEP", "label": "smooth zoom in", "cat": "ZOOM"})

PRI = {"POS": 9, "MOVE": 7, "TITLE": 6, "CARD": 6, "ZOOM": 6, "GFX": 5, "CAP": 3}
out.sort(key=lambda x: x["time"]); keep = []
for s in out:
    if s["cat"] in ("MOVE", "ZOOM", "CARD"): keep.append(s); continue
    clash = [k for k in keep if k["cat"] not in ("MOVE", "ZOOM", "CARD") and (abs(k["time"] - s["time"]) < 0.15 or (k["key"] == s["key"] and abs(k["time"] - s["time"]) < 0.35))]
    if clash:
        if PRI[s["cat"]] > PRI[clash[0]["cat"]]: keep.remove(clash[0]); keep.append(s)
        continue
    keep.append(s)
tr = []
for i, x in enumerate(NEWTR):
    n, pid = TRV[i % len(TRV)]; st = round(x - 0.2, 3)
    tr.append({"time": st, "pid": pid, "len": 0.567, "name": n})
    keep.append({"time": st, "key": "GL2" if i % 2 == 0 else "GL1", "in": 2.97 if i % 2 == 0 else 2.47, "len": 0.567, "label": "glitch new TR", "cat": "TR"})
keep.sort(key=lambda x: x["time"])
TAIL = {"W_DEEP": 2.35, "MUS18": 1.1, "RETRO": 0.6, "W_CAR": 1.6, "W_LOW": 2.45, "W_SWL": 0.65, "HIT": 1.6, "POS": 1.4, "CLICK": 0.5, "FAIL": 2.8}
VAR = {"RETRO": [0, 1.23, 2.45, 3.66], "CLICK": [0, 0.58, 1.17]}
vi = {}
for s in keep:
    if s["cat"] != "TR": s["len"] = TAIL[s["key"]]
    if s["key"] in VAR:
        i = vi.get(s["key"], 0); vi[s["key"]] = i + 1; s["in"] = VAR[s["key"]][i % len(VAR[s["key"]])]
# tracks: A4.. (index 3+); A3 keeps the user's glitches + vinheta audio. New TR glitches also go on A4+.
ends = []
for s in keep:
    s["track"] = None
    for k in range(len(ends)):
        if ends[k] <= s["time"] + 1e-6: s["track"] = 3 + k; ends[k] = s["time"] + s["len"]; break
    if s["track"] is None: ends.append(s["time"] + s["len"]); s["track"] = 3 + len(ends) - 1
vbatch = [{"projectItemId": NEWGFX[c], "trackIndex": 1, "time": a, "linkAudio": False, "sourceInPoint": s, "sourceOutPoint": round(s + b - a, 3)} for (c, a, b, s) in SEG if c in NEWGFX]
vbatch += [{"projectItemId": NEWCARDS[c], "trackIndex": 1, "time": a, "linkAudio": False, "sourceInPoint": 0, "sourceOutPoint": round(b - a, 3)} for (c, a, b) in CARDS if c in NEWCARDS]
vbatch += [{"projectItemId": p["pid"], "trackIndex": 2, "time": p["time"], "linkAudio": False, "sourceInPoint": 0, "sourceOutPoint": p["len"]} for p in tr]
abatch = [{"projectItemId": SFXID[s["key"]], "trackIndex": s["track"], "time": s["time"], "sourceInPoint": s.get("in", 0), "sourceOutPoint": round(s.get("in", 0) + s["len"], 3)} for s in keep]
open(D + "it_vbatch.json", "w").write(json.dumps(vbatch)); open(D + "it_abatch.json", "w").write(json.dumps(abatch))
json.dump({"sfx": keep, "tr": tr}, open(D + "it_plan.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
sys.stdout.reconfigure(encoding="utf-8")
print("V", len(vbatch), "SFX", len(keep), "tracks", len(ends), collections.Counter(s["key"] for s in keep))
for s in keep: print("%7.2f A%d %-5s %-6s %.2f %s" % (s["time"], s["track"] + 1, s["cat"], s["key"], s["len"], s["label"]))
