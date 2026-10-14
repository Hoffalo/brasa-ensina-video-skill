# Build the full v2 edit: graphics segments (V3), CRT transitions (V4), SFX (A4-A6) from comp events.
import json, re, unicodedata
D = "C:/Users/lolo/Documents/ae-mcp-bridge/"
raw = open(D + "events2.json", "rb").read()
try: ev = json.loads(raw.decode("utf-8"))["o"]
except Exception: ev = json.loads(raw.decode("cp1252"))["o"]
def key(s): return unicodedata.normalize("NFC", s)
ITEM = {"G45": "000f4480", "G44": "000f4481", "G46": "000f447f", "G46b": "000f447e", "G47": "000f447d", "G48": "000f447c", "G49a": "000f447a",
        "G49b": "000f4479", "G50a": "000f4477", "G50b": "000f4476", "G51a": "000f4474", "G51b": "000f4473", "G0.1": "000f4484", "G0.2": "000f4483", "G0.3": "000f4482"}
# (comp, seqIn, seqOut, srcIn)
SEG = [("G45", 13.85, 25.833, 0), ("G44", 34.0, 54.0, 3.633),
       ("G46", 58.467, 66.9, 0), ("G46", 77.3, 82.3, 18.833), ("G46", 89.6, 98.1, 31.133), ("G46b", 101.9, 107.24, 0),
       ("G47", 113.2, 127.9, 5.967), ("G47", 134.6, 153.83, 27.367), ("G48", 166.2, 177.37, 6.267), ("G49a", 177.383, 186.0, 0),
       ("G49b", 196.4, 205.0, 0), ("G50a", 211.3, 222.9, 6.3), ("G50b", 226.0, 231.75, 0),
       ("G51a", 246.9, 260.0, 10.467), ("G51a", 267.4, 278.2, 30.967), ("G51b", 280.6, 294.84, 0)]
CARDS = [("G0.1", 153.9, 159.8), ("G0.2", 223.0, 226.0), ("G0.3", 278.25, 280.6)]
ZOOMS = [0.0, 82.7, 192.9, 206.5, 238.1]
POS = ["€0", "R$ 0", "−19%", "MENOR", "ZERO", "RÁPIDO", "≈ US$ 400/mês", "COBERTA", "AJUDA MENSAL", "Resultado", "INCLUSIVE PRA ESTRANGEIROS", "SEM VESTIBULAR", "MAIS RARA", "CUSTOS ESCONDIDOS@G45"]
NEU = ["US$ 600–900/mês", "US$ 2.500–3.500", "€750/MÊS", "€2.000–4.000/ANO", "€6.000–9.000/ANO", "€", "Texto MORADIA (destaque)"]
NEG = ["€11.900/ano", "OBRIGATÓRIO", "ANTECIPADA", "1 SEMESTRE", "NÃO É CUSTO ZERO"]
TITLES = ["PAÍSES BARATOS", "ALEMANHA", "FRANÇA", "POLÔNIA", "ARGENTINA", "TAIWAN", "BOLSA ICDF", "A COMBINAÇÃO MAIS RARA", "PLANILHA", "MENSALIDADE ZERO", "CUSTOS ESCONDIDOS"]
def short(c): return key(c).split(" - ")[0]
def classify(c, e):
    n = key(e["layer"]); t = key(e.get("text") or "")
    if e["type"] in ("null", "cam"): return None
    if n.startswith("Globo") or n.startswith("Paralelo") or n.startswith("Meridiano") or n.startswith("Pin "): return None  # globe build handled by title/boxes
    if n.startswith("Box ") or n.startswith("Peça") or n.startswith("Chip") or n.startswith("Slot "): return "HIT"
    if n == "Fundo = TOTAL": return "CHORD"
    if n == "Tabela box": return "GFX"
    if n.startswith("Linha ") or n.startswith("Celula") or n.startswith("Valor") or n == "Tabela divisoria": return "ROW"
    if n == "Chave soma": return "GFX"
    if n + "@" + c in POS or n in POS or t in POS: return "POS"
    if n in NEU or t in NEU: return "NEU"
    if n in NEG or t in NEG: return "NEG"
    if n in TITLES or t in TITLES: return "TITLE"
    if e["type"] == "text": return "CAP"   # captions, labels, pill texts (pill texts dedup with their box)
    return "GFX"
# SFX family rule: full AE motion graphics -> videogame-like sounds (retro game motion, UI clicks, Collect Item /
# chime / fail jingles). The anime sword hit is reserved for static text animated in Premiere (G0 cards).
# WOOSHES ARE FOR CAMERA MOVEMENT ONLY (Null moves, Smooth Zoom In) -- never for graphics/text movement.
SFX = {"HIT": ("RETRO", 0.6), "POS": ("POS", 1.4), "NEU": ("NEU1", 1.1), "NEG": ("FAIL", 1.3), "TITLE": ("MUS18", 1.1), "CAP": ("CLICK", 0.5), "GFX": ("RETRO", 0.6),
       "ROW": ("CLICK", 0.5), "CHORD": ("CHORD", 1.5), "CLICK": ("CLICK", 0.35)}
events = []
for e in ev:
    c = short(e["comp"]); cat = classify(c, e)
    if cat is None or e["first"] is None: continue
    events.append((c, e["first"], cat, key(e["layer"])))
# animated swaps (second layer appears at the swap time)
events += [("G47", 11.0, "POS", "swap €178–254"), ("G47", 15.7, "NEU", "swap CVEC")]
# camera moves (Null keys) per comp: pairs of keys with different values -> woosh at move middle
MOVES = {"G44": [(21.87, 22.57, "W_SWL")], "G46": [(39.44, 40.14, "W_LOW")], "G47": [(29.76, 30.56, "W_SWL")], "G48": [(3.52, 5.26, "W_LOW")]}
# ONE long woosh per camera move / zoom, matched to the move's length -- never chain short wooshes to fill it.
# loud body (within 10 dB of peak), measured: W_LOW 0.45-2.00 (peak 0.85), W_CAR 0.45-1.20 (peak 0.80),
# W_SYNTH 0.05-0.65 then long fade to 2.75 (peak 0.15), W_THROW 0.05-1.40 (peak 0.10), W_SWL 0.10-0.35 (peak 0.15)
PEAK = {"W_DEEP": 0.55, "W_LOW": 0.85, "W_CAR": 0.80, "W_SYNTH": 0.15, "W_THROW": 0.10, "W_SWL": 0.15}
BODY_END = {"W_LOW": 2.00, "W_CAR": 1.20, "W_SYNTH": 1.70, "W_THROW": 1.40, "W_SWL": 0.35, "W_WHIP": 1.85}
def move_woosh(d):  # pick by move duration: the loud body should roughly match it
    return "W_LOW" if d >= 1.2 else "W_CAR" if d >= 0.5 else "W_SWL"
out = []
def seq_of(c, t):
    r = []
    for (cc, a, b, s) in SEG:
        if cc != c: continue
        st = a + (t - s)
        if a - 0.01 <= st <= b - 0.25: r.append(st)
    return r
for c, t, cat, n in events:
    for st in seq_of(c, t):
        k, ln = SFX[cat]; out.append({"time": round(st, 3), "key": k, "len": ln, "label": c + " " + n, "cat": cat})
for c, mv in MOVES.items():
    for a, b, _ in mv:
        k = move_woosh(b - a)  # peak at the middle of an ease-in/out Null move
        for st in seq_of(c, (a + b) / 2 - PEAK[k]):
            out.append({"time": round(st, 3), "key": k, "len": 2.0, "label": c + " camera %.2fs" % (b - a), "cat": "MOVE"})
for c, a, b in CARDS:
    out.append({"time": a, "key": "HIT", "len": 1.6, "label": c + " card in (sword)", "cat": "CARD"})  # G0 card = ONE SFX (sword; Fail if negative)
# Smooth Zoom In = 100->110 % over ~1.67 s, fast start + long landing -> front-loaded woosh, peak ~0.1 s after start
for i, z in enumerate(ZOOMS):
    k = "W_DEEP"  # Smooth Zoom In: deep woosh ONLY, starting EXACTLY at the zoomed clip start (user rules)
    out.append({"time": z, "key": k, "len": 2.0, "label": "smooth zoom in", "cat": "ZOOM"})
# dedupe: same time window (0.15 s) -> keep the most specific (value > title > hit > row > caption)
PRI = {"POS": 9, "NEG": 9, "NEU": 8, "CHORD": 9, "MOVE": 7, "TITLE": 6, "CARD": 6, "ZOOM": 6, "HIT": 5, "ROW": 4, "GFX": 3, "CAP": 2}
out.sort(key=lambda x: x["time"])
keep = []
for s in out:
    clash = [k for k in keep if k["cat"] != "MOVE" and s["cat"] != "MOVE" and (abs(k["time"] - s["time"]) < 0.15 or (k["key"] == s["key"] and abs(k["time"] - s["time"]) < 0.35))]
    if clash:
        if PRI[s["cat"]] > PRI[clash[0]["cat"]]: keep.remove(clash[0]); keep.append(s)
        continue
    keep.append(s)
keep.sort(key=lambda x: x["time"])
# a move/zoom owns its span: drop any other movement woosh starting inside its loud body (no woosh stacking)
BIG = {"W_DEEP", "W_LOW", "W_CAR", "W_SYNTH", "W_THROW", "W_SWL", "W_WHIP"}
owners = [s for s in keep if s["cat"] in ("MOVE", "ZOOM")]
keep = [s for s in keep if s in owners or s["key"] not in BIG or
        not any(o["time"] - 0.15 <= s["time"] <= o["time"] + BODY_END[o["key"]] for o in owners)]
# transitions at every graphic edge
edges = []
for (c, a, b, s) in SEG: edges += [a, b]
edges = sorted(set(round(x, 2) for x in edges))
edges = [x for x in edges if abs(x - 25.83) > 0.05]            # G45 out is covered by the vinheta
merged = []
for x in edges:
    if merged and x - merged[-1] < 0.1: continue
    merged.append(x)
TRS = [("03", "000f4402", 0.4), ("07", "000f4403", 0.72), ("11", "000f4404", 0.96), ("02", "000f4405", 0.4), ("08", "000f4406", 0.72),
       ("13", "000f4407", 0.96), ("05", "000f4408", 0.4), ("10", "000f4409", 0.72), ("14", "000f440a", 0.96)]
tr = []
for i, x in enumerate(merged):
    n, pid, d = TRS[i % len(TRS)]
    st = round(x - d * 0.4, 3); tr.append({"time": st, "pid": pid, "len": d, "name": n})
    keep.append({"time": st, "key": "GL1" if i % 2 == 0 else "GL2", "len": d, "label": "glitch TR" + n, "cat": "TR"})
keep.sort(key=lambda x: x["time"])
# every SFX plays until it is inaudible (measured with sfx_tails.py: end of the FIRST sound in the file, before the
# next variation starts). Never trim inside a ringing tail -- overflow goes to a new track instead.
TAIL = {"W_DEEP": 2.35, "MUS18": 1.1, "RETRO": 0.6, "W_CAR": 1.6, "W_SYNTH": 2.75, "W_THROW": 1.65, "W_LOW": 2.45, "W_SWL": 0.65, "W_WHIP": 2.13, "W_SWISH": 0.45, "HIT": 1.6,
        "POS": 1.4, "CHORD": 2.75, "NEU1": 1.7, "CLICK": 0.5, "ERR": 0.35, "FAIL": 2.8}
# multi-variation game files: rotate the variation (source in-point) so repeated pops don't sound identical
VAR = {"RETRO": [0, 1.23, 2.45, 3.66], "CLICK": [0, 0.58, 1.17]}
FILELEN = {"RETRO": 4.36, "CLICK": 1.24}
vi = {}
for s in keep:
    if s["key"] in VAR:
        i = vi.get(s["key"], 0); vi[s["key"]] = i + 1; s["in"] = VAR[s["key"]][i % len(VAR[s["key"]])]
for s in keep:
    if s["cat"] != "TR": s["len"] = TAIL[s["key"]]  # exception: TR glitches stay cut to the TR span (user rule)
ends = [-1, -1, -1]
for s in keep:
    s["track"] = None
    for k in range(len(ends)):
        if ends[k] <= s["time"] + 1e-6: s["track"] = 3 + k; ends[k] = s["time"] + s["len"]; break
    if s["track"] is None:  # all SFX tracks busy: open a new one (A7+) instead of cutting a ringing tail
        ends.append(s["time"] + s["len"]); s["track"] = 3 + len(ends) - 1
if len(ends) > 3: print("NOTE: needs %d SFX tracks -> add_track (position 'above') before placing" % len(ends))
ID = {"GL1": "000f43f3", "GL2": "000f43f4", "W_LOW": "000f43f5", "W_SWL": "000f43f6", "W_WHIP": "000f43f7", "W_SWISH": "000f43f8", "HIT": "000f43f9",
      "POS": "000f43fa", "CHORD": "000f43fd", "NEU1": "000f43fe", "CLICK": "000f43ff", "RETRO": "IMPORT_ME", "MUS18": "IMPORT_ME", "W_CAR": "IMPORT_ME", "W_SYNTH": "IMPORT_ME", "W_DEEP": "IMPORT_ME", "W_THROW": "IMPORT_ME",  # RETRO = ES_User Interface, Motion, Motion, Game, Jingle, Event, Retro
      "ERR": "000f4400", "FAIL": "000f4401"}
vbatch = [{"projectItemId": ITEM[c], "trackIndex": 2, "time": a, "linkAudio": False, "sourceInPoint": s, "sourceOutPoint": round(s + (b - a), 3)} for (c, a, b, s) in SEG]
vbatch += [{"projectItemId": ITEM[c], "trackIndex": 2, "time": a, "linkAudio": False, "sourceInPoint": 0, "sourceOutPoint": round(b - a, 3)} for (c, a, b) in CARDS]
vbatch += [{"projectItemId": p["pid"], "trackIndex": 3, "time": p["time"], "linkAudio": False, "sourceInPoint": 0, "sourceOutPoint": p["len"]} for p in tr]
abatch = [{"projectItemId": ID[s["key"]], "trackIndex": s["track"], "time": s["time"], "sourceInPoint": s.get("in", 0), "sourceOutPoint": round(min(s.get("in", 0) + s["len"], FILELEN.get(s["key"], 99)), 3)} for s in keep]
json.dump({"seg": SEG, "cards": CARDS, "tr": tr, "sfx": keep, "zooms": ZOOMS}, open(D + "pb_v2_plan.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
open(D + "pb_v2_vbatch.json", "w").write(json.dumps(vbatch)); open(D + "pb_v2_abatch.json", "w").write(json.dumps(abatch))
print("graphics", len(vbatch) - len(tr), "TR", len(tr), "SFX", len(keep))
import collections; print(collections.Counter(s["cat"] for s in keep))
for s in keep: print("%7.2f %-8s %-8s %s" % (s["time"], s["cat"], s["key"], s["label"]))
