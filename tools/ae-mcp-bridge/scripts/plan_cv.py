# Step-3 planner for "CV Forte" (from plan_entrevista.py) (template for future episodes: edit SEG / CARDS / ZOOMS / ITEM / SFXID / classify).
# Rules (skill sfx-transitions.md): graphics/text motion -> game sounds & jingles; wooshes ONLY for camera moves and
# Smooth Zoom In (one long woosh per move, sized to it); every SFX plays to its audible end (TR glitches excepted);
# G0 cards -> sword hit + positive jingle in, click before out; CRT TR at every graphic edge except vinheta-covered.
import json, unicodedata, sys
D = "C:/Users/lolo/Documents/ae-mcp-bridge/"
ev = json.load(open(D + "ev_cv.json", encoding="utf-8"))["o"]
N = lambda s: unicodedata.normalize("NFC", s)

SEG = [("G18", 29.633, 45.05, 0), ("CV1 primeiro terco", 55.3, 63.4, 0), ("CV2 formula", 84.4, 92.8, 0), ("CV3 compare", 92.8, 104.6, 0),
       ("CV5 metrica", 129.0, 150.2, 0), ("CV7 dois modelos", 175.0, 203.0, 0), ("CV8 dois motivos", 217.0, 231.0, 0),
       ("CV10 formatacao", 262.2, 270.6, 0), ("CV11 dois detalhes", 285.6, 292.0, 0), ("CV11 dois detalhes", 295.5, 300.5, 9.9),
       ("CV12 tres decisoes", 310.5, 320.6, 0), ("CV12 tres decisoes", 333.9, 343.2, 23.4),
       ("CV13 pontos importantes", 355.8, 368.9, 0), ("CV13 pontos importantes", 371.9, 376.4, 16.1)]
NEGCARDS = ["G17"]   # cards that are negative points -> Fail jingle
CARDS = [("G17", 5.5, 10.5), ("G19", 75.5, 78.4), ("CV card E DAI", 113.4, 116.2), ("CV card SELECIONADO", 156.2, 160.6),
         ("CV card ESPELHO", 235.4, 241.6), ("CV card BLOCO DE NOTAS", 273.7, 279.0)]
ZOOMS = [10.617, 69.8, 104.5, 167.967, 211.883, 256.95, 379.65]   # V1 clip starts (deep woosh at the exact clip start)
VINHETA_EDGES = [29.633]
ITEM = {"G18": "000f42cb", "CV1 primeiro terco": "000f42da", "CV2 formula": "000f42d9", "CV3 compare": "000f42d8", "CV5 metrica": "000f42d7",
        "CV7 dois modelos": "000f42d6", "CV8 dois motivos": "000f42d5", "CV10 formatacao": "000f42d4", "CV11 dois detalhes": "000f42d3",
        "CV12 tres decisoes": "000f42d2", "CV13 pontos importantes": "000f42d1", "G17": "000f42c9", "G19": "000f42db",
        "CV card E DAI": "000f42cf", "CV card SELECIONADO": "000f42cd", "CV card ESPELHO": "000f42ce", "CV card BLOCO DE NOTAS": "000f42d0"}
SFXID = {"GL1": "000f4282", "GL2": "000f4283", "W_LOW": "000f427e", "W_SWL": "000f4275", "W_CAR": "000f4279", "W_DEEP": "000f42e9",
         "POS": "000f4293", "NEU1": "000f4294", "CLICK": "000f4296", "FAIL": "000f42ea", "RETRO": "000f42eb", "MUS18": "000f4295",
         "CHORD": "000f4299", "HIT": "000f4297"}
TRS = [("03", "000f42a9", 0.4), ("07", "000f42ad", 0.72), ("11", "000f42b1", 0.96), ("02", "000f42a8", 0.4), ("08", "000f42ae", 0.72),
       ("13", "000f42b3", 0.96), ("05", "000f42ab", 0.4), ("10", "000f42b0", 0.72), ("14", "000f42b4", 0.96)]
GFX_V, TR_V, SFX_A0 = 1, 2, 3          # V2 graphics, V3 TRs (vinheta only at 25.6-31.4), SFX from A4 up

TITLE = ["Titulo", "Olho em formato de F", "Col0 head", "Col1 head"]
POS = []
NEG = []
SKIP = []
SPECIAL = {("G18", "6 a 10 segundos"): "NEU", ("CV3 compare", "Item 3"): "POS", ("CV3 compare", "Strike 1"): "NEG",
           ("CV12 tres decisoes", "Item 3"): "POS"}
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
MV = {"G18": [(1.867, 2.433), (9.167, 9.667)]}
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
for c, a, b in CARDS:  # sword + positive jingle in, click out (G0 rule)
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
json.dump({"seg": SEG, "cards": CARDS, "tr": tr, "sfx": keep, "zooms": ZOOMS, "ntracks": len(ends)}, open(D + "cv_plan.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
open(D + "cv_vbatch.json", "w").write(json.dumps(vbatch)); open(D + "cv_abatch.json", "w").write(json.dumps(abatch))
sys.stdout.reconfigure(encoding="utf-8")
print("graphics", len(SEG) + len(CARDS), "TR", len(tr), "SFX", len(keep), "SFX tracks", len(ends))
import collections; print(collections.Counter(s["cat"] for s in keep)); print(collections.Counter(s["key"] for s in keep))
for s in keep: print("%7.2f A%d %-6s %-8s %.2fs %s" % (s["time"], s["track"] + 1, s["cat"], s["key"], s["len"], s["label"]))
