# BRASA motion-language scene builder (reference: paises baratos, user G2-G43).
#   layout "stack": big title opening -> fast reveal (camera dolly/tilt) to title-header + one box of items
#   layout "cards": big title -> camera travels card to card (one per topic) -> overview pull-back showing all
# Depth: title on z=0, content on ZC (closer to camera). 3D entrances (rise + forward). Margins checked at every rest.
# usage: build_scene.py cfg.json      cfg: see CFG examples in make_scenes_oa.py
import json, sys, subprocess, os, math
D = os.path.expanduser("~/Documents/ae-mcp-bridge").replace("\\", "/")
Y = [1, 0.8, 0.01]; W = [0.957, 0.957, 0.957]; DG = [0.012, 0.341, 0.102]
ZOOM = 2344.5466; CAMOFF = 1400.0
ZT, ZC = 0.0, -1300.0                 # title plane, content plane
P = [960.0, 540.0, -2000.0]           # overview null pose (camera z = -3400)
MX, MY = 110, 90                      # safe margins (px)

def run(script, g, cfg):
    r = subprocess.run(["python", D + "/aerun.py", script, g, json.dumps(cfg, ensure_ascii=False)], capture_output=True, text=True, encoding="utf-8")
    try: return json.loads(r.stdout)
    except Exception: raise SystemExit("bad output %s: %s %s" % (script, r.stdout[:400], r.stderr[:400]))
def ops(comp, lst):
    res = run("ops.jsx", "OPS", {"comp": comp, "ops": lst}); errs = [x for x in res.get("o", []) if "ERR" in x]
    if errs: print("ERR", errs[:5])
    return res
def bbox(comp, t, layers): return list(run("bbox.jsx", "BB", {"comp": comp, "t": [t], "layers": layers})["r"].values())[0]
def k(z, pose): return (z - (pose[2] - CAMOFF)) / ZOOM
def world(sx, sy, z, pose): kk = k(z, pose); return [pose[0] + (sx - 960) * kk, pose[1] + (sy - 540) * kk, z]
def pose_for(cx, cy, z, scale, base=P):   # camera centred on world (cx,cy) on plane z, magnified `scale` vs base
    d = z - (base[2] - CAMOFF); return [round(cx, 2), round(cy, 2), round(z - d / scale + CAMOFF, 2)]
def runs_for(text, hl, it, num):
    rs = [{"s": 0, "e": len(text), "font": "Lato-Regular", "color": W}]
    if num: i = text.find(" "); rs.append({"s": 0, "e": i, "font": "Lato-Bold", "color": Y})
    for h in hl or []:
        i = text.find(h)
        if i >= 0: rs.append({"s": i, "e": i + len(h), "font": "Lato-Bold", "color": Y})
    for h in it or []:
        i = text.find(h)
        if i >= 0: rs.append({"s": i, "e": i + len(h), "font": "Lato-Italic"})
    return rs

cfg = json.load(open(sys.argv[1], encoding="utf-8")); C = cfg["name"]; DUR = cfg["dur"]
for _cd in cfg.get("cards", []):   # never fly the camera to an empty spot: arrive (focus_t + 0.7) just before the cue
    if _cd.get("focus_t") is not None and _cd["t"] > _cd["focus_t"] + 0.7 + 0.3:
        print("focus_t %.2f -> %.2f for %s (cue %.2f)" % (_cd["focus_t"], _cd["t"] - 0.85, _cd["header"], _cd["t"])); _cd["focus_t"] = round(_cd["t"] - 0.85, 2)
run("_dupcomp.jsx", "DC", {"src": "G2", "names": [C], "dur": DUR})
run("_rmcontent.jsx", "RC", {"comp": C, "keep": []})
ops(C, [{"op": "nullkeys", "keys": [[0, P]]}])
lay = cfg["layout"]
# ---------- create layers (centred at world origin of their plane; moved after measuring) ----------
mk = [{"op": "addtext", "name": "Titulo", "text": cfg["title"]["text"], "font": "Hagrid-Extrabold", "size": 100, "color": Y, "just": "C", "c": world(960, 540, ZT, P)}]
names = []
if lay == "stack":
    for i, it in enumerate(cfg["items"]):
        n = "Item %d" % (i + 1); names.append(n)
        mk += [{"op": "addtext", "name": n, "text": it["text"], "font": "Lato-Regular", "size": 100, "just": "L", "c": world(960, 540, ZC, P)},
               {"op": "text", "layer": n, "runs": runs_for(it["text"], it.get("hl"), it.get("it"), it.get("num"))}]
else:
    for ci, cd in enumerate(cfg["cards"]):
        h = "Card%d head" % ci; names.append(h)
        mk.append({"op": "addtext", "name": h, "text": cd["header"], "font": "Hagrid-Extrabold", "size": 100, "color": Y, "just": "L", "c": world(960, 540, ZC, P)})
        for li, ln in enumerate(cd["lines"]):
            n = "Card%d line %d" % (ci, li + 1); names.append(n)
            mk += [{"op": "addtext", "name": n, "text": ln["text"], "font": "Lato-Regular", "size": 100, "just": "L", "c": world(960, 540, ZC, P)},
                   {"op": "text", "layer": n, "runs": runs_for(ln["text"], ln.get("hl"), ln.get("it"), False)}]
ops(C, mk)
# ---------- size: measure "Hx" heights at overview pose ----------
b = bbox(C, 0.5, ["Titulo"] + names)
H = lambda n: b[n]["s"][3] - b[n]["s"][1]
TITLE_PX = cfg.get("title_px", 74); ITEM_PX = cfg.get("item_px", 50 if lay == "stack" else 40); HEAD_PX = cfg.get("head_px", 36)
heads = [n for n in names if n.endswith("head")]; bodies = [n for n in names if not n.endswith("head")]
med = lambda L: sorted(H(n) for n in L)[len(L) // 2]
SZ = {"Titulo": 100 * TITLE_PX / H("Titulo"), "head": 100 * HEAD_PX / med(heads) if heads else 0, "body": 100 * ITEM_PX / med(bodies) if bodies else 0}
def setsizes(f_t=1.0, f_c=1.0):
    SZ["Titulo"] *= f_t; SZ["head"] *= f_c; SZ["body"] *= f_c
    ops(C, [{"op": "text", "layer": "Titulo", "size": SZ["Titulo"]}] + [{"op": "text", "layer": n, "size": SZ["head"] if n.endswith("head") else SZ["body"]} for n in names])
setsizes()
b = bbox(C, 0.5, ["Titulo"] + names); S = lambda n: b[n]["s"]
tw = S("Titulo")[2] - S("Titulo")[0]
if tw > 1920 - 2 * MX: setsizes(f_t=(1920 - 2 * MX) / tw)
b = bbox(C, 0.5, ["Titulo"] + names); S = lambda n: b[n]["s"]
th = S("Titulo")[3] - S("Titulo")[1]; tw = S("Titulo")[2] - S("Titulo")[0]
moves = {}; boxes = []; focus = []
GAP_T = 70
if lay == "stack":
    PADX, PADY, G = 60, 46, 26
    tops = [S(n)[1] for n in names]; top0 = min(tops); pitch = max(S(n)[3] - S(n)[1] for n in names)
    cw = max(S(n)[2] - S(n)[0] for n in names); bw, bh = cw + 2 * PADX, pitch * len(names) + G * (len(names) - 1) + 2 * PADY
    scale = min(1.0, (1920 - 2 * MX) / max(bw, tw), (1080 - 2 * MY) / (th + GAP_T + bh))
    if scale < 1.0:  # shrink fonts uniformly then redo (rare)
        setsizes(f_t=scale, f_c=scale)
        b = bbox(C, 0.5, ["Titulo"] + names); S = lambda n: b[n]["s"]
        th = S("Titulo")[3] - S("Titulo")[1]; tw = S("Titulo")[2] - S("Titulo")[0]
        tops = [S(n)[1] for n in names]; top0 = min(tops); pitch = max(S(n)[3] - S(n)[1] for n in names)
        cw = max(S(n)[2] - S(n)[0] for n in names); bw, bh = cw + 2 * PADX, pitch * len(names) + G * (len(names) - 1) + 2 * PADY
    LA0 = min(b[n]["o"][1] - S(n)[1] for n in names)   # ascender height: rows share one baseline grid
    total = th + GAP_T + bh; ytop = (1080 - total) / 2
    moves["Titulo"] = (960 - (S("Titulo")[0] + S("Titulo")[2]) / 2, ytop - S("Titulo")[1], ZT)
    bx0, by0 = 960 - bw / 2, ytop + th + GAP_T
    for i, n in enumerate(names):   # rows on one baseline grid (all created on the same baseline)
        moves[n] = (bx0 + PADX - S(n)[0], by0 + PADY + LA0 + i * (pitch + G) - b[n]["o"][1], ZC)
    boxes.append(("Box", 960, by0 + bh / 2, bw, bh, ZC, None))
else:
    # Layout rules (user): identical boxes, labels on ONE baseline (layer origin, never glyph boxes: accents move
    # those), header-only cards centre their label, cards with lines keep text left at PADX, row/grid centred and
    # inside MX/MY. Gaps 40 px (header-only) / 60 px (with lines).
    cards = cfg["cards"]; ncol = cfg.get("cols", len(cards)); nrow = math.ceil(len(cards) / ncol)
    hdr_only = all(not c["lines"] for c in cards)
    PADX, PADY, GH, G = 56, (40 if hdr_only else 36), 18, 14
    GAPC = 40 if hdr_only else 60
    def grp(ci): return ["Card%d head" % ci] + ["Card%d line %d" % (ci, li + 1) for li in range(len(cards[ci]["lines"]))]
    O = lambda n: b[n]["o"]
    def dims():
        lw = max(S(n)[2] - S(n)[0] for n in names); cwid = lw + 2 * PADX
        bodies = [n for n in names if not n.endswith("head")]
        CH = min(O(h)[1] - S(h)[1] for h in heads)                     # cap height (unaccented)
        LA = min(O(n)[1] - S(n)[1] for n in bodies) if bodies else 0   # body ascender height
        lh = max(S(n)[3] - S(n)[1] for n in bodies) if bodies else 0
        nl = max(len(c["lines"]) for c in cards); chei = PADY * 2 + CH + (GH + nl * lh + (nl - 1) * G if nl else 0)
        return cwid, chei, lh, CH, LA, ncol * cwid + (ncol - 1) * GAPC, nrow * chei + (nrow - 1) * GAPC
    cwid, chei, lh, CH, LA, gw, gh = dims()
    for _ in range(4):   # shrink text until title + grid fit inside the margins (padding/gaps stay)
        scale = min(1.0, (1920 - 2 * MX) / gw, (1080 - 2 * MY - th - GAP_T) / gh)
        if scale >= 0.999: break
        setsizes(f_c=scale * 0.97)
        b = bbox(C, 0.5, ["Titulo"] + names); S = lambda n: b[n]["s"]
        cwid, chei, lh, CH, LA, gw, gh = dims()
    total = th + GAP_T + gh; ytop = (1080 - total) / 2
    moves["Titulo"] = (960 - (S("Titulo")[0] + S("Titulo")[2]) / 2, ytop - S("Titulo")[1], ZT)
    gx0, gy0 = 960 - gw / 2, ytop + th + GAP_T
    for ci in range(len(cards)):
        r, cc = divmod(ci, ncol); x0 = gx0 + cc * (cwid + GAPC); y0 = gy0 + r * (chei + GAPC)
        g = grp(ci); hn = g[0]
        hx = (x0 + cwid / 2 - (S(hn)[2] - S(hn)[0]) / 2) if hdr_only else x0 + PADX
        moves[hn] = (hx - S(hn)[0], y0 + PADY + CH - O(hn)[1], ZC)
        for li, n in enumerate(g[1:]):
            moves[n] = (x0 + PADX - S(n)[0], y0 + PADY + CH + GH + LA + li * (lh + G) - O(n)[1], ZC)
        boxes.append(("Box card%d" % ci, x0 + cwid / 2, y0 + chei / 2, cwid, chei, ZC, ci))
        focus.append((x0 + cwid / 2, y0 + chei / 2, cwid, chei))
    cfg["_scale"] = 1.0
# ---------- apply moves (screen px -> world, per plane) ----------
ml = []
for n, (dx, dy, z) in moves.items():
    kk = k(z, P); ml.append({"op": "move", "layer": n, "d": [dx * kk, dy * kk, 0]})
ops(C, ml)
# ---------- boxes ----------
bl = []
for name, cx, cy, w, h, z, ci in boxes:
    kk = k(z, P); under = "Item %d" % len(names) if lay == "stack" else ("Card%d line %d" % (ci, len(cfg["cards"][ci]["lines"])) if cfg["cards"][ci]["lines"] else "Card%d head" % ci)
    bl.append({"op": "box", "name": name, "after": under, "c": world(cx, cy, z, P), "wh": [w * kk, h * kk], "k": kk, "t": 0, "fill": None})
ops(C, bl)
# ---------- camera + entrance timing ----------
bt = bbox(C, 0.5, ["Titulo"]); ts = bt["Titulo"]["s"]; tcx, tcy = (ts[0] + ts[2]) / 2, (ts[1] + ts[3]) / 2; twp = ts[2] - ts[0]
wt = world(tcx, tcy, ZT, P); fT = min(2.3, 1540.0 / twp)
OPEN = pose_for(wt[0], wt[1], ZT, fT)
ME = 0.7                                   # camera move duration (reference 0.55-0.75 s)
keys = [[0, OPEN]]; cam_moves = []
rev = cfg["reveal_t"]
if lay == "stack":
    over = P if cfg.get("_scale", 1) >= 0.999 else P
    keys += [[rev, OPEN], [round(rev + ME, 3), over]]; cam_moves.append((rev, rev + ME))
    for sk in cfg.get("pushes", []):        # quick small push at a visit start (lands on the overview framing)
        far = pose_for(over[0], over[1], ZC, 1 / 1.06, over); keys += [[sk, far], [round(sk + 0.35, 3), over]]; cam_moves.append((sk, sk + 0.35))
else:
    over = P
    fposes = []
    for (cx, cy, w, h) in focus:
        wc = world(cx, cy, ZC, P); f = min((1920 - 2 * MX) * 0.85 / w, (1080 - 2 * MY) * 0.85 / h, 3.2)
        fposes.append(pose_for(wc[0], wc[1], ZC, f))
    seq = [(rev, fposes[cfg["cards"].index(c)]) if False else None for c in []]
    cur = OPEN; keys = [[0, OPEN]]
    for (t, target) in [(cd["focus_t"], fposes[ci]) for ci, cd in enumerate(cfg["cards"]) if cd.get("focus_t") is not None] + [(cfg["overview_t"], over)]:
        keys += [[t, cur], [round(t + ME, 3), target]]; cam_moves.append((t, t + ME)); cur = target
keys.sort(key=lambda x: x[0])
ops(C, [{"op": "nullkeys", "keys": keys}])
# entrances: title at 0.1; content entrances in 3D (rise 40 px + from 140 z behind), boxes draw at their first element
el = [{"op": "in3d", "layer": "Titulo", "t": 0.1, "dy": 30 * k(ZT, OPEN), "dz": 0, "d": 0.4}]
kc = k(ZC, P)
if lay == "stack":
    for i, it in enumerate(cfg["items"]):
        el.append({"op": "in3d", "layer": "Item %d" % (i + 1), "t": max(it["t"], rev + ME - 0.1), "dy": 40 * kc, "dz": 160, "d": 0.4})
    first = min(max(it["t"], rev + ME - 0.1) for it in cfg["items"])
    tb = boxes[0]
    el.append({"op": "remove", "layer": "Box"})
    el.append({"op": "box", "name": "Box", "after": "Item %d" % len(names), "c": world(tb[1], tb[2], ZC, P), "wh": [tb[3] * kc, tb[4] * kc], "k": kc, "t": max(0, first - 0.15)})
else:
    for ci, cd in enumerate(cfg["cards"]):
        t0 = max(cd["t"], (cd["focus_t"] if cd.get("focus_t") is not None else cfg["overview_t"]) + ME - 0.15)
        el.append({"op": "in3d", "layer": "Card%d head" % ci, "t": t0, "dy": 30 * kc, "dz": 160, "d": 0.4})
        for li, ln in enumerate(cd["lines"]):
            el.append({"op": "in3d", "layer": "Card%d line %d" % (ci, li + 1), "t": max(ln["t"], t0 + 0.25 * (li + 1)), "dy": 30 * kc, "dz": 160, "d": 0.4})
        tb = boxes[ci]
        el.append({"op": "remove", "layer": tb[0]})
        under = ("Card%d line %d" % (ci, len(cd["lines"]))) if cd["lines"] else "Card%d head" % ci
        el.append({"op": "box", "name": tb[0], "after": under, "c": world(tb[1], tb[2], ZC, P), "wh": [tb[3] * kc, tb[4] * kc], "k": kc, "t": max(0, t0 - 0.15)})
if lay == "cards":
    f0 = cfg["cards"][0]["focus_t"]; ov = cfg["overview_t"]
    if f0 is not None: el.append({"op": "opkeys", "layer": "Titulo", "keys": [[0.1, 0], [0.5, 100], [f0, 100], [f0 + 0.35, 0], [ov, 0], [ov + 0.45, 100]]})
ops(C, el)
# ---------- margin check at every camera rest (fails loudly) ----------
rests = sorted(set([round(kt[0] + 0.05, 2) for kt in keys] + [round(DUR - 0.05, 2)]))
viol = []
for t, m in run("bbox.jsx", "BB", {"comp": C, "t": rests})["r"].items():
    for n, v in m.items():
        if v["op"] < 50: continue
        l, tp, r, bt = v["s"]
        if l < MX - 2 or r > 1920 - MX + 2 or tp < MY - 2 or bt > 1080 - MY + 2: viol.append((t, n, v["s"]))
if viol: print("MARGIN VIOLATIONS", viol)
run("addglow.jsx", "AG", {"comps": [C]})
run("bglive.jsx", "BL", {"comps": [C]})
run("_save.jsx", "X", {})
json.dump({"comp": C, "keys": keys, "moves": cam_moves}, open(D + "/scene_%s.json" % C.split()[0], "w"))
print(json.dumps({"comp": C, "moves": cam_moves, "scale": cfg.get("_scale", 1)}))
