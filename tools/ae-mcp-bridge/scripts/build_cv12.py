# Build "CV12 cv da Ana": Ana's real CV page in the house comp, camera tour + spotlight per decision, formula card.
# Comp time = sequence time - 310.5 (visit A 310.5-330.9 -> 0-20.4, visit B 334.0-343.2 -> 23.5-32.7).
import json, subprocess, os
D = os.path.expanduser("~/Documents/ae-mcp-bridge").replace("\\", "/")
C = "CV12 cv da Ana"
PNG = "C:/Users/lolo/Downloads/Ana_Beatriz_Ferreira_CV_pagina.png"
Y = [1, 0.8, 0.01]; W = [0.957, 0.957, 0.957]; DG = [0.012, 0.341, 0.102]

def run(script, g, cfg):
    r = subprocess.run(["python", D + "/aerun.py", script, g, json.dumps(cfg, ensure_ascii=False)], capture_output=True, text=True, encoding="utf-8")
    res = json.loads(r.stdout)
    errs = [x for x in res.get("o", []) if "ERR" in str(x)]
    if errs or res.get("status") != "success": print("ERR", script, errs or res)
    return res
def cp(ops): return run("cvpage.jsx", "CP", {"comp": C, "ops": ops})

# camera mapping measured at the base pose (Null 1 = P0), probes at z=0 / z=-150
P0 = [1245, -174, -381]
k0, k1 = 1339 / 1901, 1339 / 2076
w0 = lambda sx, sy: [9.2 + (sx + 794) * k0, -71.7 + (sy - 685) * k0, 0]
w1 = lambda sx, sy, dy: [9.2 + (sx + 956) * k1, -71.7 + (sy - 699) * k1 + dy * k0, -150]
PT = 200 / 72                      # page px (= screen px) per pt
X0, TOP0 = (1920 - 595.3 * PT) / 2, 220
def rest(center_pt, at=540): return at - center_pt * PT   # page top (screen) that puts center_pt at screen y=at
D1 = TOP0 - rest(454)            # experiencia de pesquisa
DB = TOP0 - rest(316)            # bolsa
DH = TOP0 - rest(707, 470)       # habilidades (room for the quote under it)
cam = lambda d: [P0[0], P0[1] + d * k0, P0[2]]

def R(x1, y1, x2, y2, pad=24): return [x1 * PT - pad, y1 * PT - pad, x2 * PT + pad, y2 * PT + pad]
L, Rr = 42.6, 552.7
SEC = {"perfil": R(L, 107.4, Rr, 182.1), "bullet": R(50.5, 461.2, Rr, 500.4), "bolsa": R(L, 308.2, Rr, 350.3), "habil": R(L, 675.2, Rr, 740.4)}
def boxop(name, r, t, out=None, grow=6):
    x1, y1, x2, y2 = r[0] - grow, r[1] - grow, r[2] + grow, r[3] + grow
    o = {"op": "box", "name": name, "parent": "CV pagina", "c": [(x1 + x2) / 2, (y1 + y2) / 2], "wh": [x2 - x1, y2 - y1], "t": t}
    if out is not None: o["out"] = out
    return o

ops = [{"op": "remove", "name": n} for n in ("_p0", "_p1", "_pH")]
ops += [{"op": "nullkeys", "keys": [[0, cam(0)], [6.8, cam(0)], [7.45, cam(D1)], [20.6, cam(D1)], [21.2, cam(DB)], [29.1, cam(DB)], [29.75, cam(DH)]]},
        {"op": "page", "name": "CV pagina", "png": PNG, "pos": w0(X0, TOP0), "scale": k0 * 100, "t": 0.2, "dy": 40 * k0, "rotX": 10},
        {"op": "rig", "name": "Card rig", "pos": w1(0, 0, D1), "scale": k1 * 100},
        {"op": "dim", "name": "Spotlight", "parent": "CV pagina", "wh": [1654, 2339], "color": DG,
         "ov": [[0, 0], [2.6, 0], [3.0, 62], [10.75, 62], [11.05, 90], [20.5, 90], [20.8, 0], [23.75, 0], [24.15, 62]],
         "mask": [[2.6, SEC["perfil"]], [6.8, SEC["perfil"]], [7.45, SEC["bullet"]], [20.9, SEC["bullet"]], [21.0, SEC["bolsa"]], [29.1, SEC["bolsa"]], [29.75, SEC["habil"]]]},
        boxop("Box perfil", SEC["perfil"], 2.65, 6.8), boxop("Box formula", SEC["bullet"], 7.45, 10.75),
        boxop("Box bolsa", SEC["bolsa"], 23.75, 29.1), boxop("Box habilidades", SEC["habil"], 29.75)]
# highlighter marks on the page
ops.append({"op": "hl", "name": "Marca 40 propostas", "parent": "CV pagina", "r": R(92.3, 337.5, 226.6, 350.3, 3), "t": 26.9, "out": 29.1})
for i, r in enumerate([[149.4, 697.0, 196.6, 709.8], [228.1, 697.0, 275.3, 709.8], [306.9, 697.0, 371.7, 709.8],
                       [128.2, 727.6, 161.2, 740.4], [195.8, 727.6, 262.8, 740.4], [311.3, 727.6, 328.7, 740.4]]):
    ops.append({"op": "hl", "name": "Marca nivel %d" % (i + 1), "parent": "CV pagina", "r": R(*r, pad=3), "t": 30.15 + i * 0.12})
cp(ops)

# tabs (pill on the top-left of each box) + title
TABS = [("Tab 1", "1. PERFIL LOGO NO TOPO", "perfil", 2.8, 6.8), ("Tab 2", "2. A FÓRMULA EM CADA ITEM", "bullet", 7.6, 10.75),
        ("Tab 3", "3. ATÉ A BOLSA VEM QUANTIFICADA", "bolsa", 23.9, 29.1), ("Tab 4", "+ HABILIDADES COM NÍVEL", "habil", 29.9, None)]
cp([{"op": "text", "name": n + " txt", "parent": "CV pagina", "text": s, "font": "Hagrid-Extrabold", "size": 30, "color": Y, "just": "L"} for n, s, *_ in TABS])
m = cp([{"op": "measure", "names": [n + " txt" for n, *_ in TABS]}])["r"]
ops = []
for n, s, sec, t, out in TABS:
    r = m[n + " txt"]; pw, ph = r[2] + 2 * 26, r[3] + 2 * 15
    x1 = SEC[sec][0] - 6 + 40; cy = SEC[sec][1] - 6
    ops += [{"op": "box", "name": n + " pill", "parent": "CV pagina", "c": [x1 + pw / 2, cy], "wh": [pw, ph], "t": t - 0.1, "fill": DG, "stroke": 3, "round": ph / 2},
            {"op": "place", "name": n + " txt", "at": "c", "p": [x1 + pw / 2, cy]}, {"op": "order", "name": n + " txt", "before": n + " pill"},
            {"op": "in", "name": n + " txt", "t": t, "dy": 20}]
    if out is not None: ops += [{"op": "out", "name": n + " pill", "t": out}, {"op": "out", "name": n + " txt", "t": out}]
cp(ops)

# bad-example quote under Habilidades (struck through)
QY = SEC["habil"][3] + 150
q = "\u201cProficiente em pacote Office\u201d"
cp([{"op": "text", "name": "Quote txt", "parent": "CV pagina", "text": q, "font": "Lato-Regular", "size": 40, "color": W, "just": "L",
     "runs": [{"s": q.index("Office"), "e": q.index("Office") + 6, "font": "Lato-Italic"}]}])
qr = cp([{"op": "measure", "names": ["Quote txt"]}])["r"]["Quote txt"]
qx1 = SEC["habil"][0] - 6 + 40; qw, qh = qr[2] + 2 * 40, qr[3] + 2 * 26
cp([{"op": "box", "name": "Quote box", "parent": "CV pagina", "c": [qx1 + qw / 2, QY], "wh": [qw, qh], "t": 30.85, "fill": DG, "stroke": 3},
    {"op": "place", "name": "Quote txt", "at": "c", "p": [qx1 + qw / 2, QY]}, {"op": "order", "name": "Quote txt", "before": "Quote box"},
    {"op": "in", "name": "Quote txt", "t": 30.95, "dy": 20},
    {"op": "strike", "name": "Strike quote", "parent": "CV pagina", "x1": qx1 + 30, "x2": qx1 + qw - 30, "y": QY + 3, "t": 32.0, "d": 0.45}])

# formula card (card space = screen px while the camera rests on the bullet)
ROWS = [("VERBO", "Codifico e analiso", 11.0, []),
        ("TAREFA", "42 entrevistas semiestruturadas com beneficiários de programas de transferência de renda", 11.88, ["42 entrevistas"]),
        ("FERRAMENTA", "usando NVivo", 13.72, ["NVivo"]),
        ("RESULTADO", "os 3 padrões identificados orientaram a reformulação de um indicador de avaliação adotado pela prefeitura de Guarulhos", 15.0, ["3 padrões"])]
TW = 980
ops = [{"op": "text", "name": "Card titulo", "parent": "Card rig", "text": "A FÓRMULA", "font": "Hagrid-Extrabold", "size": 72, "color": Y, "just": "C"}]
for i, (lab, txt, t, hl) in enumerate(ROWS):
    runs = [{"s": txt.index(h), "e": txt.index(h) + len(h), "font": "Lato-Bold", "color": Y} for h in hl]
    ops += [{"op": "text", "name": "Pill %d txt" % (i + 1), "parent": "Card rig", "text": lab, "font": "Hagrid-Extrabold", "size": 30, "color": Y, "just": "C"},
            {"op": "text", "name": "Item %d" % (i + 1), "parent": "Card rig", "text": txt, "font": "Lato-Regular", "size": 40, "color": W, "just": "J", "box": [TW, 400], "runs": runs}]
cp(ops)
names = ["Card titulo"] + ["Pill %d txt" % (i + 1) for i in range(4)] + ["Item %d" % (i + 1) for i in range(4)]
m = cp([{"op": "measure", "names": names}])["r"]
LH = 40 * 1.2                                              # Lato line box (first-line centre = top + LH/2)
PW = max(m["Pill %d txt" % (i + 1)][2] for i in range(4)) + 2 * 28
PH = max(m["Pill %d txt" % (i + 1)][3] for i in range(4)) + 2 * 16
rh = [max(PH, m["Item %d" % (i + 1)][3] + 8) for i in range(4)]
GAP, PADX, PADY, CG = 34, 56, 46, 40
bw = PADX + PW + CG + TW + PADX; bh = PADY * 2 + sum(rh) + GAP * 3
th = m["Card titulo"][3]; top = (1080 - (th + 70 + bh)) / 2
bx1, by1 = 960 - bw / 2, top + th + 70
ops = [{"op": "place", "name": "Card titulo", "at": "c", "p": [960, top + th / 2]}, {"op": "in", "name": "Card titulo", "t": 10.75, "dy": 30},
       {"op": "box", "name": "Card box", "parent": "Card rig", "c": [960, by1 + bh / 2], "wh": [bw, bh], "t": 10.85, "fill": DG}]
y = by1 + PADY
for i, (lab, txt, t, hl) in enumerate(ROWS):
    n = i + 1; cy = y + PH / 2
    ops += [{"op": "box", "name": "Pill %d" % n, "parent": "Card rig", "c": [bx1 + PADX + PW / 2, cy], "wh": [PW, PH], "t": t - 0.12, "fill": DG, "stroke": 3, "round": PH / 2},
            {"op": "place", "name": "Pill %d txt" % n, "at": "c", "p": [bx1 + PADX + PW / 2, cy]}, {"op": "order", "name": "Pill %d txt" % n, "before": "Pill %d" % n},
            {"op": "in", "name": "Pill %d txt" % n, "t": t, "dy": 20},
            {"op": "place", "name": "Item %d" % n, "at": "tl", "p": [bx1 + PADX + PW + CG, cy - m["Item %d" % n][3] / 2 if m["Item %d" % n][3] < PH else y]},
            {"op": "in", "name": "Item %d" % n, "t": t + 0.05, "dy": 30}]
    y += rh[i] + GAP
for n in ["Card titulo", "Card box"] + ["Pill %d" % (i + 1) for i in range(4)] + ["Pill %d txt" % (i + 1) for i in range(4)] + ["Item %d" % (i + 1) for i in range(4)]:
    ops.append({"op": "out", "name": n, "t": 20.5})
cp(ops)
# title: top of frame, out with the first camera move
run("ops.jsx", "OPS", {"comp": C, "ops": [{"op": "move", "layer": "Titulo", "d": [0, (80 - 229) * k0, 0]}, {"op": "in", "layer": "Titulo", "t": 0.1, "dy": 30 * k0, "d": 0.4},
                                         {"op": "out", "layer": "Titulo", "t": 6.8, "d": 0.4}]})
run("_save.jsx", "X", {})
print("done", json.dumps({"D1": D1, "DB": DB, "DH": DH, "card": [bw, bh, top]}))
