# Build a house-style list comp from a template comp (BG + Null-parented camera kept, everything else removed).
# usage: build_list.py <config.json>
# config: {name, src:"G25", dur, glowFrom (layer name in src), keepNull:[x,y,z] (static camera),
#          title:{text, t, color?:"Y"|"W", size_px?:80}, layout:"list"|"pills"|"cols",
#          items:[{text, t, hl:[words], it:[words], num:true, strike_t?}], cols:[{header, t, items:[...]}],
#          box:{t} | null, item_px?:52, gap_px?:26}
# Screen layout: title centred, 80 px gap, content centred as a block (text left-aligned inside a yellow box).
import json, sys, subprocess, os
D = os.path.expanduser("~/Documents/ae-mcp-bridge").replace("\\", "/")
Y = [1, 0.8, 0.01]; W = [0.957, 0.957, 0.957]

def run(script, g, cfg):
    r = subprocess.run(["python", D + "/aerun.py", script, g, json.dumps(cfg, ensure_ascii=False)], capture_output=True, text=True, encoding="utf-8")
    try: return json.loads(r.stdout)
    except Exception: raise SystemExit("bad output from %s: %s %s" % (script, r.stdout[:500], r.stderr[:500]))

def ops(comp, lst):
    res = run("ops.jsx", "OPS", {"comp": comp, "ops": lst})
    errs = [x for x in res.get("o", []) if "ERR" in x]
    if errs: print("ERR", errs)
    return res

def bbox(comp, t, layers):
    r = run("bbox.jsx", "BB", {"comp": comp, "t": [t], "layers": layers})["r"]
    return list(r.values())[0]

def runs_for(text, hl, it, num, base_font="Lato-Regular"):
    rs = [{"s": 0, "e": len(text), "font": base_font, "color": W}]
    if num:
        i = text.find(" "); rs.append({"s": 0, "e": i, "font": "Lato-Bold", "color": Y})
    for h in hl or []:
        i = text.find(h)
        if i >= 0: rs.append({"s": i, "e": i + len(h), "font": "Lato-Bold", "color": Y})
    for h in it or []:            # foreign (non-Portuguese) terms: italic (bold-italic if highlighted)
        i = text.find(h)
        if i >= 0:
            bold = any(text.find(x) <= i < text.find(x) + len(x) for x in (hl or []) if text.find(x) >= 0)
            rs.append({"s": i, "e": i + len(h), "font": "Lato-BoldItalic" if bold else "Lato-Italic"})
    return rs

cfg = json.load(open(sys.argv[1], encoding="utf-8"))
C = cfg["name"]
run("_dupcomp.jsx", "DC", {"src": cfg.get("src", "G25"), "names": [C], "dur": cfg.get("dur", 20)})
glow = cfg.get("glowFrom", "antes de escrever")
# probe the z=0 plane (camera static at its final pose)
ops(C, [{"op": "nullkeys", "keys": [[0, cfg.get("keepNull", [1245, -174, -381])]]},
        {"op": "addtext", "name": "_probeL", "text": "Hx", "font": "Lato-Regular", "size": 100, "just": "L", "c": [0, 0, 0]},
        {"op": "addtext", "name": "_probeH", "text": "HX", "font": "Hagrid-Extrabold", "size": 100, "just": "L", "c": [0, 0, 0]}])
pb = bbox(C, 0.5, ["_probeL", "_probeH"])
k = pb["_probeL"]["k"]
sL, wL = pb["_probeL"]["s"], pb["_probeL"]["w"]
wx = lambda sx: wL[0] + (sx - sL[0]) * k
wy = lambda sy: wL[1] + (sy - sL[1]) * k
hL = pb["_probeL"]["s"][3] - pb["_probeL"]["s"][1]; hH = pb["_probeH"]["s"][3] - pb["_probeH"]["s"][1]
item_size = 100 * cfg.get("item_px", 60) / hL
title_size = 100 * cfg.get("title", {}).get("size_px", 78) / hH
G = cfg.get("gap_px", 30)

# create text layers (with glow from the template's text), then remove template content
mk = []; names = []
T = cfg.get("title")
if T:
    mk.append({"op": "addtext", "name": "Titulo", "text": T["text"], "font": "Hagrid-Extrabold", "size": title_size,
               "color": Y if T.get("color", "Y") == "Y" else W, "just": "C", "c": [0, 0, 0], "glowFrom": glow})
lay = cfg.get("layout", "list")
groups = []   # list of lists of layer names (one box per group)
def add_item(nm, it, font_px=None, hag=False, center=False):
    sz = (title_size * 0.62) if hag else item_size
    if font_px: sz = item_size * font_px
    mk.append({"op": "addtext", "name": nm, "text": it["text"], "font": "Hagrid-Extrabold" if hag else "Lato-Regular", "size": sz,
               "color": Y if hag else W, "just": "C" if center else "L", "c": [0, 0, 0], "glowFrom": glow})
    if not hag:
        mk.append({"op": "text", "layer": nm, "runs": runs_for(it["text"], it.get("hl"), it.get("it"), it.get("num"))})
if lay in ("list", "pills"):
    g = []
    for i, it in enumerate(cfg["items"]):
        nm = "Item %d" % (i + 1); add_item(nm, it, hag=(lay == "pills"), center=(lay == "pills")); g.append(nm)
    groups.append(g)
else:
    for ci, col in enumerate(cfg["cols"]):
        g = ["Col%d head" % ci]
        add_item(g[0], {"text": col["header"]}, hag=True)
        for i, it in enumerate(col["items"]):
            nm = "Col%d item %d" % (ci, i + 1); add_item(nm, it); g.append(nm)
        groups.append(g)
ops(C, mk)
rm = run("_rmcontent.jsx", "RC", {"comp": C, "keep": ["Titulo", "_probeL", "_probeH"] + [n for g in groups for n in g]})
ops(C, [{"op": "remove", "layer": "_probeL"}, {"op": "remove", "layer": "_probeH"}])

allnames = (["Titulo"] if T else []) + [n for g in groups for n in g]
b = bbox(C, 0.5, allnames)
if T and b["Titulo"]["s"][2] - b["Titulo"]["s"][0] > cfg.get("title_max", 1500):   # titles must fit the margins
    f = cfg.get("title_max", 1500) / (b["Titulo"]["s"][2] - b["Titulo"]["s"][0])
    ops(C, [{"op": "text", "layer": "Titulo", "size": title_size * f}])
    b = bbox(C, 0.5, allnames)
S = lambda n: b[n]["s"]
moves = {}; boxes = []
PADX, PADY = 56, 44
if lay == "list":
    g = groups[0]
    cw = max(S(n)[2] - S(n)[0] for n in g)
    hs = [S(n)[3] - S(n)[1] for n in g]
    pitch = max(hs); tops = [S(n)[1] for n in g]
    ch = pitch * len(g) + G * (len(g) - 1)
    bw, bh = cw + 2 * PADX, ch + 2 * PADY
    th = (S("Titulo")[3] - S("Titulo")[1]) if T else 0
    total = th + (80 if T else 0) + bh
    top = (1080 - total) / 2
    if T: moves["Titulo"] = (960 - (S("Titulo")[0] + S("Titulo")[2]) / 2, top - S("Titulo")[1])
    y = top + th + (80 if T else 0) + PADY; x = 960 - cw / 2
    # all items are created on the same baseline, so shift every item by the SAME amount plus its row offset
    # (aligning by glyph boxes made rows uneven: accents/descenders change the box)
    top0 = min(S(n)[1] for n in g)
    for i, n in enumerate(g):
        moves[n] = (x - S(n)[0], y - top0 + i * (pitch + G))
    boxes.append(("Box", 960, top + th + (80 if T else 0) + bh / 2, bw, bh))
elif lay == "pills":
    g = groups[0]; PX, PY, GAP = 44, 30, 34
    pw = max(S(n)[2] - S(n)[0] for n in g) + 2 * PX; ph = max(S(n)[3] - S(n)[1] for n in g) + 2 * PY
    rowW = len(g) * pw + (len(g) - 1) * GAP
    if rowW > 1720:  # wrap into 2 rows
        per = (len(g) + 1) // 2
    else: per = len(g)
    rows = [g[i:i + per] for i in range(0, len(g), per)]
    th = (S("Titulo")[3] - S("Titulo")[1]) if T else 0
    total = th + 80 + len(rows) * ph + (len(rows) - 1) * GAP
    top = (1080 - total) / 2
    if T: moves["Titulo"] = (960 - (S("Titulo")[0] + S("Titulo")[2]) / 2, top - S("Titulo")[1])
    y0 = top + th + 80
    for ri, row in enumerate(rows):
        rw = len(row) * pw + (len(row) - 1) * GAP; x0 = 960 - rw / 2
        for j, n in enumerate(row):
            cx = x0 + j * (pw + GAP) + pw / 2; cy = y0 + ri * (ph + GAP) + ph / 2
            capmid = (max(S(m)[1] for m in g) + max(S(m)[3] for m in g)) / 2   # same baseline for all pills (accents ignored)
            moves[n] = (cx - (S(n)[0] + S(n)[2]) / 2, cy - capmid)
            boxes.append(("Pill " + n, cx, cy, pw, ph))
else:  # cols
    GAPC = 60
    cws = [max(S(n)[2] - S(n)[0] for n in g) for g in groups]
    colw = max(cws) + 2 * PADX
    hs = [[S(n)[3] - S(n)[1] for n in g] for g in groups]
    chs = [sum(h) + G * (len(h) - 1) + 14 for h in hs]
    bh = max(chs) + 2 * PADY
    th = (S("Titulo")[3] - S("Titulo")[1]) if T else 0
    total = th + 80 + bh; top = (1080 - total) / 2
    if T: moves["Titulo"] = (960 - (S("Titulo")[0] + S("Titulo")[2]) / 2, top - S("Titulo")[1])
    totw = len(groups) * colw + (len(groups) - 1) * GAPC; x0 = 960 - totw / 2
    for gi, g in enumerate(groups):
        bx = x0 + gi * (colw + GAPC); y = top + th + 80 + PADY
        top0 = min(S(n)[1] for n in g[1:]) if len(g) > 1 else 0
        for j, n in enumerate(g):
            if j == 0: moves[n] = (bx + PADX - S(n)[0], y - S(n)[1]); y += hs[gi][0] + G + 14; continue
            moves[n] = (bx + PADX - S(n)[0], y - top0 + (j - 1) * (max(hs[gi][1:]) + G))
        boxes.append(("Box col%d" % gi, bx + colw / 2, top + th + 80 + bh / 2, colw, bh))

ml = [{"op": "move", "layer": n, "d": [d[0] * k, d[1] * k, 0]} for n, d in moves.items()]
ops(C, ml)
# entrances + boxes
el = []
if T: el.append({"op": "in", "layer": "Titulo", "t": T.get("t", 0), "dy": 30 * k, "d": 0.4})
times = {}
if lay in ("list", "pills"):
    for i, it in enumerate(cfg["items"]): times["Item %d" % (i + 1)] = it["t"]
else:
    for ci, col in enumerate(cfg["cols"]):
        times["Col%d head" % ci] = col["t"]
        for i, it in enumerate(col["items"]): times["Col%d item %d" % (ci, i + 1)] = it["t"]
for n, t in times.items(): el.append({"op": "in", "layer": n, "t": t, "dy": 40 * k, "d": 0.4})
bt = (cfg.get("box") or {}).get("t")
for name, cx, cy, w, h in boxes:
    if name.startswith("Pill "): t = times[name[5:]] - 0.12
    elif name.startswith("Box col"): t = times["Col%s head" % name[-1]] - 0.1
    else: t = bt if bt is not None else min(times.values()) - 0.15
    if cfg.get("box") is None and name == "Box": continue
    under = name[5:] if name.startswith("Pill ") else (groups[int(name[-1])][-1] if name.startswith("Box col") else groups[0][-1])
    el.append({"op": "box", "name": name, "after": under, "c": [wx(cx), wy(cy), 0], "wh": [w * k, h * k], "k": k, "t": max(0, t), "glowFrom": "Titulo" if T else None,
               "fill": [0.012, 0.341, 0.102] if name.startswith("Pill ") else None})
ops(C, el)
# strikes (bad example): white line wiping across the item at its vertical middle
sl = []
if lay == "list":
    b2 = bbox(C, cfg.get("dur", 20) - 0.1, list(times.keys()))
    for i, it in enumerate(cfg["items"]):
        if "strike_t" in it:
            s = b2["Item %d" % (i + 1)]["s"]
            sl.append({"op": "line", "name": "Strike %d" % (i + 1), "c": [wx((s[0] + s[2]) / 2), wy((s[1] + s[3]) / 2 + 4), 0], "w": (s[2] - s[0] + 16) * k,
                       "k": k, "t": it["strike_t"], "stroke": 5, "color": W})
if sl: ops(C, sl)
run("_save.jsx", "X", {})
print(json.dumps({"comp": C, "k": k, "item_size": round(item_size, 1), "title_size": round(title_size, 1), "boxes": len(boxes)}))
