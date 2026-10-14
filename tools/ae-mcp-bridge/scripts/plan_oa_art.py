# SFX for the art-builder comps (THE STANDARD), from their ART configs. Only graphic-visit SFX; zoom wooshes, G0 card
# SFX and TR glitches are untouched. Output: oa_art_abatch.json (tracks assigned later against Premiere occupancy).
import json, sys
D = "C:/Users/lolo/Documents/ae-mcp-bridge/"
s = open(D + "scripts/plan_oa.py", encoding="utf-8").read(); ns = {}
exec(s[s.index("SEG = ["):s.index("CARDS = [")], ns); SEG = ns["SEG"]
CFG = {c["comp"]: c for c in json.load(open(D + "art_oa_cfg.json", encoding="utf-8"))}
TAIL = {"MUS18": 1.1, "RETRO": 0.6, "CLICK": 0.5, "W_SWL": 0.65, "POS": 1.4, "W_CAR": 1.6}
VAR = {"RETRO": [0, 1.23, 2.45, 3.66], "CLICK": [0, 0.58, 1.17]}
PRI = {"MUS18": 9, "RETRO": 8, "POS": 8, "W_SWL": 7, "W_CAR": 7, "CLICK": 3}
PEAK = {"W_SWL": 0.15, "W_CAR": 0.8}
ev = []
for comp, c in CFG.items():
    E = [(0.15, "MUS18", "title")]
    for sh in c.get("shots", [])[1:]:   # one woosh per camera move, peak at the middle of the move (snappy shots / reveal)
        w = "W_SWL" if sh["m1"] - sh["m0"] < 0.65 else "W_CAR"
        E.append((round((sh["m0"] + sh["m1"]) / 2 - PEAK[w], 3), w, "camera " + (sh["target"] if isinstance(sh["target"], str) else "cards")))
    if c.get("sub"): E.append((0.5, "CLICK", "subtitle"))
    for it in c["items"]:
        E.append((it["t"], "POS" if "1.000+" in it["text"] else "RETRO", "card " + it["text"][:18]))
        for ln in it.get("lines", []):
            if ln["t"] > it["t"] + 0.3: E.append((ln["t"], "CLICK", "line " + ln["text"][:16]))
    V = c.get("visual", {})
    for p in V.get("pins", []): E.append((p["t"], "CLICK", "pin " + p["name"]))
    if V.get("ripple"): E.append((V["ripple"], "CLICK", "ripple"))
    for t, k, lab in E:
        for (cc, a, b, src) in SEG:
            if cc != comp: continue
            st = a + (t - src)
            if a - 0.01 <= st <= b - 0.25: ev.append({"time": round(st, 3), "key": k, "label": comp[:10] + " " + lab})
ev.sort(key=lambda x: x["time"]); keep = []
for e in ev:   # dedupe: within 0.2 s keep the more important; same sound within 0.35 s -> one
    cl = [k for k in keep if (k["key"].startswith("W_")) == (e["key"].startswith("W_")) and (abs(k["time"] - e["time"]) < 0.2 or (k["key"] == e["key"] and abs(k["time"] - e["time"]) < 0.35))]   # camera wooshes never merge with jingles
    if cl:
        if PRI[e["key"]] > PRI[cl[0]["key"]]: keep.remove(cl[0]); keep.append(e)
        continue
    keep.append(e)
keep.sort(key=lambda x: x["time"]); vi = {}
for e in keep:
    e["len"] = TAIL[e["key"]]
    if e["key"] in VAR: i = vi.get(e["key"], 0); vi[e["key"]] = i + 1; e["in"] = VAR[e["key"]][i % len(VAR[e["key"]])]
    else: e["in"] = 0
json.dump(keep, open(D + "oa_art_sfx.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
sys.stdout.reconfigure(encoding="utf-8")
import collections; print(len(keep), collections.Counter(e["key"] for e in keep))
for e in keep[:12]: print(e["time"], e["key"], e["label"])
