# Step-3 planner for "bolsas eua" (template for future episodes: edit SEG / CARDS / ZOOMS / ITEM / SFXID / classify).
# Rules (skill sfx-transitions.md): graphics/text motion -> game sounds & jingles; wooshes ONLY for camera moves and
# Smooth Zoom In (one long woosh per move, sized to it); every SFX plays to its audible end (TR glitches excepted);
# G0 cards -> sword hit + positive jingle in, click before out; CRT TR at every graphic edge except vinheta-covered.
import json, unicodedata, sys
D = "C:/Users/lolo/Documents/ae-mcp-bridge/"
ev = json.load(open(D + "ev_bolsas.json", encoding="utf-8"))["o"]
N = lambda s: unicodedata.normalize("NFC", s)

SEG = [("G38m tipos de bolsa", 28.4, 49.817, 0), ("G39m need-blind", 52.483, 69.233, 0), ("G39m need-blind", 75.033, 84.517, 19.65),
       ("G37", 108.817, 138.667, 0), ("G39", 151.783, 170.1, 0), ("G40", 183.083, 187.083, 0), ("G40", 191.383, 199.2, 8.3),
       ("G41", 202.5, 211.35, 0), ("G43", 223.55, 238.5, 0)]
NEGCARDS = []   # cards that are negative points -> Fail jingle
CARDS = [("G33", 89.617, 90.783), ("G35", 91.55, 93.0), ("G36", 101.267, 102.3), ("G38", 148.083, 150.95), ("G42", 212.783, 214.55)]
ZOOMS = [0.0, 15.383, 95.133, 170.1, 243.05]
VINHETA_EDGES = [28.4]
ITEM = {"G38m tipos de bolsa": "000f434d", "G39m need-blind": "000f434e", "G33": "000f434f", "G43": "000f4350", "G42": "000f4351", "G41": "000f4352",
        "G40": "000f4353", "G39": "000f4354", "G38": "000f4355", "G37": "000f4356", "G36": "000f4357", "G35": "000f4358"}
SFXID = {"GL1": "000f4311", "GL2": "000f4312", "W_LOW": "000f430c", "W_SWL": "000f4303", "W_CAR": "000f4307", "W_SYNTH": "000f4364", "W_DEEP": "000f43f2", "W_THROW": "000f4300",
         "HIT": "000f4328", "POS": "000f4324", "CHORD": "000f432a", "NEU1": "000f4365", "CLICK": "000f4327", "ERR": "000f42f9", "FAIL": "000f4363",
         "RETRO": "000f4362", "MUS18": "000f4326"}
TRS = [("03", "000f432e", 0.4), ("07", "000f4332", 0.72), ("11", "000f4336", 0.96), ("02", "000f432d", 0.4), ("08", "000f4333", 0.72),
       ("13", "000f4338", 0.96), ("05", "000f4330", 0.4), ("10", "000f4335", 0.72), ("14", "000f4339", 0.96)]
GFX_V, TR_V, SFX_A0 = 1, 3, 4          # V2 graphics, V4 TRs, SFX from A5 up

TITLE = ["1. NEED-BASED SCHOLARSHIP", "2. MERIT-BASED SCHOLARSHIP", "Need Blind 2", "Need aware", "CLARK UNIVERSITY", "Diversas universidades nos EUA",
         "Titulo PLANILHA", "Titulo 3 LEMBRETES", "“[nome da universidade]", "Common Data Set”"]
POS = ["BROWN PROMISE", "need-BLIND", "$120 milhões", "$15 e $25 mil por ano.", "7 mil a 30 mil dólares por ano"]
NEG = ["need-aware"]
SKIP = ["Nome "]                        # tile names ride on the tile's sound

def classify(e):
    n = N(e["layer"]).strip()
    if e["type"] in ("null", "cam"): return None
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
MV = {"G38m tipos de bolsa": [(2.0, 2.5), (11.07, 11.75)], "G39m need-blind": [(19.967, 21.217)], "G37": [(1.25, 1.8), (24.9, 25.6)],
      "G39": [(7.683, 8.283)], "G40": [(8.15, 8.917)]}   # checked against key values (G39m 0->19.97 is a 2 px drift, ignored)
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
    if cat in ("CAP", "GFX") and any(m0 - 0.15 <= e["first"] <= m1 for (m0, m1) in MV.get(c, [])): continue   # exits/slides during a move: the woosh covers them (titles/values still sound)
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
json.dump({"seg": SEG, "cards": CARDS, "tr": tr, "sfx": keep, "zooms": ZOOMS, "ntracks": len(ends)}, open(D + "bolsas_plan.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
open(D + "bolsas_vbatch.json", "w").write(json.dumps(vbatch)); open(D + "bolsas_abatch.json", "w").write(json.dumps(abatch))
sys.stdout.reconfigure(encoding="utf-8")
print("graphics", len(SEG) + len(CARDS), "TR", len(tr), "SFX", len(keep), "SFX tracks", len(ends))
import collections; print(collections.Counter(s["cat"] for s in keep)); print(collections.Counter(s["key"] for s in keep))
for s in keep: print("%7.2f A%d %-6s %-8s %.2fs %s" % (s["time"], s["track"] + 1, s["cat"], s["key"], s["len"], s["label"]))
