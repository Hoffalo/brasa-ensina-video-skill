# Step-3 planner for "entrevista" (from plan_bolsas.py) (template for future episodes: edit SEG / CARDS / ZOOMS / ITEM / SFXID / classify).
# Rules (skill sfx-transitions.md): graphics/text motion -> game sounds & jingles; wooshes ONLY for camera moves and
# Smooth Zoom In (one long woosh per move, sized to it); every SFX plays to its audible end (TR glitches excepted);
# G0 cards -> sword hit + positive jingle in, click before out; CRT TR at every graphic edge except vinheta-covered.
import json, unicodedata, sys
D = "C:/Users/lolo/Documents/ae-mcp-bridge/"
ev = json.load(open(D + "ev_entrev.json", encoding="utf-8"))["o"]
N = lambda s: unicodedata.normalize("NFC", s)

SEG = [("G1", 44.5, 67.817, 0), ("G2", 76.367, 87.8, 0.917), ("G3", 100.433, 115.817, 0), ("G3", 120.217, 123.767, 15.383),
       ("G3", 127.05, 131.317, 18.533), ("G3", 133.467, 137.133, 22.8), ("G4", 147.033, 154.717, 0), ("G5", 157.183, 165.317, 0.483),
       ("G5", 169.383, 173.033, 8.617), ("G6", 178.667, 184.4, 0), ("G5", 193.8, 197.15, 12.267), ("G5", 201.333, 206.833, 15.617)]
NEGCARDS = []   # cards that are negative points -> Fail jingle
CARDS = []
ZOOMS = [10.533, 25.067, 72.667, 218.167, 270.0]      # V1 clip starts (deep woosh at the exact clip start)
VINHETA_EDGES = []
ITEM = {"G1": "000f42fa", "G2": "000f42fb", "G3": "000f42fc", "G4": "000f42fd", "G5": "000f42fe", "G6": "000f42ff"}
SFXID = {"GL1": "000f430c", "GL2": "000f430d", "W_LOW": "000f430e", "W_SWL": "000f430f", "W_CAR": "000f4310", "W_DEEP": "000f4311",
         "POS": "000f4312", "NEU1": "000f4313", "CLICK": "000f4314", "FAIL": "000f4315", "RETRO": "000f4316", "MUS18": "000f4317", "CHORD": "000f4318"}
TRS = [("03", "000f431a", 0.4), ("07", "000f431c", 0.72), ("11", "000f431f", 0.96), ("02", "000f4319", 0.4), ("08", "000f431d", 0.72),
       ("13", "000f4320", 0.96), ("05", "000f431b", 0.4), ("10", "000f431e", 0.72), ("14", "000f4321", 0.96)]
GFX_V, TR_V, SFX_A0 = 1, 2, 3          # V2 graphics, V3 TRs, SFX from A4 up

TITLE = ["Titulo O QUE PESQUISAR", "SAIBA RESPONDER", "Titulo BOA REFERENCIA"]
POS = []
NEG = []
SKIP = []
SPECIAL = {("G5", "Shape Layer 1"): "POS", ("G3", "Shape Layer 1"): "NEG"}   # check mark = done; strike over the bad example
def classify(e):
    n = N(e["layer"]).strip()
    if e["type"] in ("null", "cam"): return None
    if (e["comp"], n) in SPECIAL: return SPECIAL[(e["comp"], n)]
    if any(n.startswith(s) for s in SKIP): return None
    if any(n.startswith(N(t)) for t in TITLE): return "TITLE"
    if any(n.startswith(N(t)) for t in POS): return "POS"
    if any(n.startswith(N(t)) for t in NEG): return "NEG"
    if e["type"] == "text": return "CAP"
    return "GFX"
SFX = {"TITLE": "MUS18", "POS": "POS", "NEG": "FAIL", "NEU": "NEU1", "CAP": "CLICK", "GFX": "RETRO"}

# camera moves from Null keys (consecutive keys with a real change)
moves = {}
for e in ev:
    if e["type"] == "null" and len(e["keys"]) > 1: moves[e["comp"]] = e["keys"]
MV = {"G1": [(1.9, 2.45), (7.5, 8.217)], "G2": [(1.9, 2.45), (4.833, 5.383), (7.717, 8.233)], "G3": [(-1.2, -0.65), (4.05, 5.0), (9.833, 10.5)],
      "G5": [(2.933, 3.483), (4.683, 5.5)]}
PEAK = {"W_DEEP": 0.55, "W_LOW": 0.85, "W_CAR": 0.80, "W_SYNTH": 0.15, "W_THROW": 0.10, "W_SWL": 0.15}
def move_woosh(d): return "W_LOW" if d >= 1.2 else "W_CAR" if d >= 0.5 else "W_SWL"

def seq_of(c, t, tail=0.25):
    r = []
    for (cc, a, b, s) in SEG:
        if cc != c: continue
        st = a + (t - s)
        if a - 0.01 <= st <= b - tail: r.append(st)
    return r

out = []
for e in ev:
    cat = classify(e)
    if cat is None or e["first"] is None: continue
    c = e["comp"]
    if False and cat in ("CAP", "GFX") and any(m0 - 0.15 <= e["first"] <= m1 for (m0, m1) in MV.get(c, [])): continue   # exits/slides during a move: the woosh covers them (titles/values still sound)
    for st in seq_of(c, e["first"]):
        out.append({"time": round(st, 3), "key": SFX[cat], "label": c[:6] + " " + e["layer"][:24], "cat": cat})
for c, mv in MV.items():
    for a, b in mv:
        k = move_woosh(b - a)
        for st in seq_of(c, (a + b) / 2 - PEAK[k], tail=0):
            out.append({"time": round(st, 3), "key": k, "label": c[:6] + " camera %.2fs" % (b - a), "cat": "MOVE"})
for c, a, b in CARDS:
    # G0 card (user rules): IN = ONE SFX (sword; Fail if negative point) at the clip start; OUT = click where the Smooth
    # Out preset starts, which is anchored to the clip END (end - 0.317 s)
    out.append({"time": a, "key": "FAIL" if c in NEGCARDS else "HIT", "label": c + " card in", "cat": "CARD"})
    out.append({"time": round(b - 0.317, 3), "key": "CLICK", "label": c + " card out (preset start)", "cat": "CARD"})
for i, z in enumerate(ZOOMS):
    k = "W_DEEP"  # Smooth Zoom In: deep woosh ONLY, starting EXACTLY at the zoomed clip start (user rules)
    out.append({"time": z, "key": k, "label": "smooth zoom in", "cat": "ZOOM"})

PRI = {"POS": 9, "NEG": 9, "NEU": 8, "MOVE": 7, "TITLE": 6, "CARD": 6, "ZOOM": 6, "GFX": 5, "CAP": 3}
out.sort(key=lambda x: x["time"])
keep = []
for s in out:
    if s["cat"] in ("MOVE", "ZOOM", "CARD"): keep.append(s); continue
    clash = [k for k in keep if k["cat"] not in ("MOVE", "ZOOM", "CARD") and (abs(k["time"] - s["time"]) < 0.15 or (k["key"] == s["key"] and abs(k["time"] - s["time"]) < 0.35))]
    if clash:
        if PRI[s["cat"]] > PRI[clash[0]["cat"]]: keep.remove(clash[0]); keep.append(s)
        continue
    keep.append(s)

# CRT transitions at every graphic edge (not cards, not vinheta-covered)
edges = sorted(set(round(x, 3) for (c, a, b, s) in SEG for x in (a, b)))
edges = [x for x in edges if all(abs(x - v) > 0.05 for v in VINHETA_EDGES)]
tr = []
for i, x in enumerate(edges):
    n, pid, d = TRS[i % len(TRS)]
    st = round(x - d * 0.4, 3); tr.append({"time": st, "pid": pid, "len": d, "name": n})
    keep.append({"time": st, "key": "GL1" if i % 2 == 0 else "GL2", "len": d, "label": "glitch TR" + n, "cat": "TR"})
keep.sort(key=lambda x: x["time"])

# lengths: audible end of the first sound in each file (sfx-lengths.tsv); TR glitches stay cut to the TR (user rule)
TAIL = {"W_DEEP": 2.35, "MUS18": 1.1, "RETRO": 0.6, "W_CAR": 1.6, "W_SYNTH": 2.75, "W_THROW": 1.65, "W_LOW": 2.45, "W_SWL": 0.65, "HIT": 1.6,
        "POS": 1.4, "CHORD": 2.75, "NEU1": 1.7, "CLICK": 0.5, "ERR": 0.35, "FAIL": 2.8}
VAR = {"RETRO": [0, 1.23, 2.45, 3.66], "CLICK": [0, 0.58, 1.17]}
FILELEN = {"RETRO": 4.36, "CLICK": 1.24}
vi = {}
for s in keep:
    if s["cat"] != "TR": s["len"] = TAIL[s["key"]]
    if s["key"] in VAR:
        i = vi.get(s["key"], 0); vi[s["key"]] = i + 1; s["in"] = VAR[s["key"]][i % len(VAR[s["key"]])]
ends = []
for s in keep:
    s["track"] = None
    for k in range(len(ends)):
        if ends[k] <= s["time"] + 1e-6: s["track"] = SFX_A0 + k; ends[k] = s["time"] + s["len"]; break
    if s["track"] is None: ends.append(s["time"] + s["len"]); s["track"] = SFX_A0 + len(ends) - 1

vbatch = [{"projectItemId": ITEM[c], "trackIndex": GFX_V, "time": a, "linkAudio": False, "sourceInPoint": s, "sourceOutPoint": round(s + (b - a), 3)} for (c, a, b, s) in SEG]
vbatch += [{"projectItemId": ITEM[c], "trackIndex": GFX_V, "time": a, "linkAudio": False, "sourceInPoint": 0, "sourceOutPoint": round(b - a, 3)} for (c, a, b) in CARDS]
vbatch += [{"projectItemId": p["pid"], "trackIndex": TR_V, "time": p["time"], "linkAudio": False, "sourceInPoint": 0, "sourceOutPoint": p["len"]} for p in tr]
abatch = [{"projectItemId": SFXID[s["key"]], "trackIndex": s["track"], "time": s["time"], "sourceInPoint": s.get("in", 0),
           "sourceOutPoint": round(min(s.get("in", 0) + s["len"], FILELEN.get(s["key"], 99)), 3)} for s in keep]
json.dump({"seg": SEG, "cards": CARDS, "tr": tr, "sfx": keep, "zooms": ZOOMS, "ntracks": len(ends)}, open(D + "entrev_plan.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
open(D + "entrev_vbatch.json", "w").write(json.dumps(vbatch)); open(D + "entrev_abatch.json", "w").write(json.dumps(abatch))
sys.stdout.reconfigure(encoding="utf-8")
print("graphics", len(SEG) + len(CARDS), "TR", len(tr), "SFX", len(keep), "SFX tracks", len(ends))
import collections; print(collections.Counter(s["cat"] for s in keep)); print(collections.Counter(s["key"] for s in keep))
for s in keep: print("%7.2f A%d %-6s %-8s %.2fs %s" % (s["time"], s["track"] + 1, s["cat"], s["key"], s["len"], s["label"]))
