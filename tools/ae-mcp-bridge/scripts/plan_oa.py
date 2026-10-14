# Step-3 planner for "Onde aplicar": graphics on V4, CRT TRs on V5, SFX on EXISTING free audio tracks first
# (A4, then A2 outside the vinheta clips), new tracks only if needed (user rule).
import json, sys, collections
D = "C:/Users/lolo/Documents/ae-mcp-bridge/"
ev = json.load(open(D + "ev_oa.json", encoding="utf-8"))["o"]
# (comp, seq a, seq b, src in)
SEG = [("OA1 regioes", 26.8, 34.6, 0), ("OA2 criterios", 45.2, 50.2, 0), ("OA2 criterios", 55.2, 61.4, 10.0), ("OA2 criterios", 70.4, 76.0, 25.2),
       ("OA3 common app", 101.9, 115.0, 0), ("OA3 common app", 122.8, 127.4, 20.9), ("OA4 documentos", 150.5, 162.9, 0),
       ("OA5 canada", 189.5, 209.0, 0), ("OA6 ucas", 232.6, 256.8, 0), ("OA7 campus france", 270.6, 297.0, 0), ("OA8 italia", 300.9, 328.0, 0),
       ("OA9 europa", 328.1, 343.5, 0), ("OA10 japao", 371.3, 378.7, 0), ("OA10 japao", 386.4, 392.0, 15.1), ("OA11 china", 392.1, 400.8, 0),
       ("OA11 china", 406.3, 415.2, 14.2), ("OA12 dicas", 415.2, 421.0, 0), ("OA12 dicas", 438.1, 445.4, 22.9), ("OA12 dicas", 448.0, 453.0, 32.8),
       ("OA12 dicas", 456.8, 464.7, 41.6)]
CARDS = [("OA card COMMON APP", 95.2, 98.8), ("OA card SITE", 133.1, 140.4), ("OA card TEST OPTIONAL", 170.2, 174.8),
         ("OA card CAMPUS FRANCE", 266.3, 270.5), ("OA card REGRA", 344.0, 348.9), ("OA card NACIONAL", 480.0, 486.4)]
NEGCARDS = []
ITEM = {"OA1 regioes": "000f427a", "OA2 criterios": "000f4279", "OA3 common app": "000f4278", "OA4 documentos": "000f4277", "OA5 canada": "000f4276",
        "OA6 ucas": "000f4275", "OA7 campus france": "000f4274", "OA8 italia": "000f4273", "OA9 europa": "000f4272", "OA10 japao": "000f4271",
        "OA11 china": "000f4270", "OA12 dicas": "000f426f", "OA card TEST OPTIONAL": "000f4269", "OA card SITE": "000f426a", "OA card REGRA": "000f426b",
        "OA card NACIONAL": "000f426c", "OA card COMMON APP": "000f426d", "OA card CAMPUS FRANCE": "000f426e"}
ZOOMS = [6.767, 61.367, 84.65, 140.533, 175.217, 214.65, 357.217, 473.233]   # V1 clip starts that get Smooth Zoom In (markers)
VINHETA = [(34.567, 40.3), (493.567, 499.3)]
SFXID = {"MUS18": "000f427b", "RETRO": "000f427c", "CLICK": "000f427d", "POS": "000f427e", "HIT": "000f427f", "FAIL": "000f4280",
         "W_DEEP": "000f4281", "W_CAR": "000f4282", "W_SWL": "000f4283", "GL1": "000f4285", "GL2": "000f4286"}
TRV = [("03", "000f4525", 0.4), ("07", "000f4529", 0.72), ("11", "000f452d", 0.96), ("02", "000f4524", 0.4), ("08", "000f452a", 0.72),
       ("13", "000f452f", 0.96), ("05", "000f4527", 0.4), ("10", "000f452c", 0.72), ("14", "000f4530", 0.96), ("01", "000f4523", 0.4),
       ("06", "000f4528", 0.72), ("12", "000f452e", 0.96), ("04", "000f4526", 0.4), ("09", "000f452b", 0.72), ("15", "000f4531", 0.96)]
# ONLY "NN TR.mp4" 01-15 from CRT TRANSITION (user rule). Never "CRT Transition 16+" or other packs.
GFX_V, TR_V = 3, 4

def classify(e):
    n = e["layer"]
    if e["type"] in ("null", "cam"): return None
    if n.startswith("Titulo"): return "TITLE"
    if e["type"] == "shape": return "GFX"
    if "1.000+" in (e.get("text") or ""): return "POS"
    if e["comp"] in ("OA9 europa",) or " line " in e["layer"]: return "CAP"     # small info / quick recap lines -> click
    return "MAIN"                                                  # main points -> video-game jingle (user rule)
SFX = {"TITLE": "MUS18", "POS": "POS", "CAP": "CLICK", "GFX": "RETRO", "MAIN": "RETRO"}
def seq_of(c, t, tail=0.25):
    return [a + (t - s) for (cc, a, b, s) in SEG if cc == c and a - 0.01 <= a + (t - s) <= b - tail]
out = []
for e in ev:
    cat = classify(e)
    if cat is None or e["first"] is None: continue
    for st in seq_of(e["comp"], e["first"]):
        out.append({"time": round(st, 3), "key": SFX[cat], "label": e["comp"][:10] + " " + e["layer"][:14], "cat": cat})
for c, a, b in CARDS:
    out.append({"time": a, "key": "FAIL" if c in NEGCARDS else "HIT", "label": c + " in", "cat": "CARD"})
    out.append({"time": round(b - 0.317, 3), "key": "CLICK", "label": c + " out", "cat": "CARD"})
# camera moves (cam_oa.py): reveal tilts 0.5 s -> car-pass woosh; quick pushes 0.35 s -> swoosh_low
MOVES = {"OA1 regioes": [(3.3, 4.0)], "OA2 criterios": [(2.46, 3.16), (10.0, 10.7), (25.2, 25.9), (28.6, 29.3)], "OA3 common app": [(0.6, 1.3), (20.9, 21.25)], "OA4 documentos": [(1.9, 2.6)], "OA5 canada": [(0.9, 1.6), (10.7, 11.4), (16.6, 17.3)], "OA6 ucas": [(1.3, 2.0)], "OA7 campus france": [(0.6, 1.3)], "OA8 italia": [(6.8, 7.5)], "OA9 europa": [(0.6, 1.3)], "OA10 japao": [(0.6, 1.3), (15.1, 15.45)], "OA11 china": [(1.6, 2.3), (7.1, 7.8), (14.2, 14.9), (20.5, 21.2)], "OA12 dicas": [(0.7, 1.4), (22.9, 23.6), (32.8, 33.5), (41.6, 42.3), (46.5, 47.2)]}
PEAK = {"W_CAR": 0.80, "W_SWL": 0.15}
for c, mv in MOVES.items():
    for a0, b0 in mv:
        w = "W_CAR" if b0 - a0 >= 0.45 else "W_SWL"
        for st in seq_of(c, max((a0 + b0) / 2 - PEAK[w], min(a0, max([x[3] for x in SEG if x[0] == c and x[3] <= a0 + 1e-6] or [0]))), tail=0):
            out.append({"time": round(max(st, [x for x in SEG if x[0] == c and x[1] - 0.01 <= st + 0.8][-1][1] if False else st), 3), "key": w, "label": c[:10] + " camera", "cat": "MOVE"})
for z in ZOOMS: out.append({"time": z, "key": "W_DEEP", "label": "smooth zoom in", "cat": "ZOOM"})
PRI = {"POS": 9, "MAIN": 7, "TITLE": 6, "CARD": 6, "ZOOM": 6, "GFX": 5, "CAP": 3}
out.sort(key=lambda x: x["time"]); keep = []
for s in out:
    if s["cat"] in ("ZOOM", "CARD", "MOVE"): keep.append(s); continue
    clash = [k for k in keep if k["cat"] not in ("ZOOM", "CARD", "MOVE") and (abs(k["time"] - s["time"]) < 0.15 or (k["key"] == s["key"] and abs(k["time"] - s["time"]) < 0.35))]
    if clash:
        if PRI[s["cat"]] > PRI[clash[0]["cat"]]: keep.remove(clash[0]); keep.append(s)
        continue
    keep.append(s)
# CRT TRs at every graphic edge (merge edges < 0.3 s apart; skip vinheta-covered ones)
edges = sorted(set(x for (c, a, b, s) in SEG for x in (a, b)))
merged = []
for x in edges:
    if merged and x - merged[-1] < 0.3: merged[-1] = (merged[-1] + x) / 2
    else: merged.append(x)
merged = [x for x in merged if not any(v0 - 0.3 <= x <= v1 for v0, v1 in VINHETA)]
tr = []
for i, x in enumerate(merged):
    n, pid, ln = TRV[i % len(TRV)]; st = round(x - 0.4 * ln, 3)
    tr.append({"time": st, "pid": pid, "len": ln})
    keep.append({"time": st, "key": "GL2" if i % 2 == 0 else "GL1", "in": 0, "len": ln, "label": "glitch TR", "cat": "TR"})
keep.sort(key=lambda x: x["time"])
TAIL = {"W_DEEP": 2.35, "W_CAR": 1.6, "W_SWL": 0.65, "MUS18": 1.1, "RETRO": 0.6, "HIT": 1.6, "POS": 1.4, "CLICK": 0.5, "FAIL": 2.8}
VAR = {"RETRO": [0, 1.23, 2.45, 3.66], "CLICK": [0, 0.58, 1.17]}
vi = {}
for s in keep:
    if s["cat"] != "TR": s["len"] = TAIL[s["key"]]
    if s["key"] in VAR:
        i = vi.get(s["key"], 0); vi[s["key"]] = i + 1; s["in"] = VAR[s["key"]][i % len(VAR[s["key"]])]
# lanes: existing A4 (3), A2 (1, blocked by the vinheta), then new A5 (4), A6 (5)
busy = {3: [], 1: list(VINHETA), 4: [], 5: [], 6: []}
for s in keep:
    a, b = s["time"], s["time"] + s["len"]
    for tk in (3, 1, 4, 5, 6):
        if all(b <= x0 + 1e-6 or a >= x1 - 1e-6 for x0, x1 in busy[tk]): busy[tk].append((a, b)); s["track"] = tk; break
vb = [{"projectItemId": ITEM[c], "trackIndex": GFX_V, "time": a, "linkAudio": False, "sourceInPoint": s, "sourceOutPoint": round(s + b - a, 3)} for (c, a, b, s) in SEG]
vb += [{"projectItemId": ITEM[c], "trackIndex": GFX_V, "time": a, "linkAudio": False, "sourceInPoint": 0, "sourceOutPoint": round(b - a, 3)} for (c, a, b) in CARDS]
vb += [{"projectItemId": p["pid"], "trackIndex": TR_V, "time": p["time"], "linkAudio": False, "sourceInPoint": 0, "sourceOutPoint": p["len"]} for p in tr]
ab = [{"projectItemId": SFXID[s["key"]], "trackIndex": s["track"], "time": s["time"], "sourceInPoint": s.get("in", 0), "sourceOutPoint": round(s.get("in", 0) + s["len"], 3)} for s in keep]
json.dump(vb, open(D + "oa_vbatch.json", "w")); json.dump(ab, open(D + "oa_abatch.json", "w"))
sys.stdout.reconfigure(encoding="utf-8")
print("V", len(vb), "TR", len(tr), "SFX", len(ab), "tracks used", sorted(set(s["track"] for s in keep)), collections.Counter(s["key"] for s in keep))
