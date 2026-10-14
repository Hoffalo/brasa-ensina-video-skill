# Camera moves for the Onde aplicar list comps (user style): moves REVEAL or change topic; pushes are small + quick.
#  - visit 1: title centred (same depth) -> 0.5 s tilt to the full framing as the content arrives (reveal)
#  - later visits: land with a quick 6 % push-in (0.35 s) that ENDS on the normal framing (nothing crops)
#  - in-comp new topic (EXTRA): quick 5 % push-in from the framing (0.35 s)
import json, subprocess
D = "C:/Users/lolo/Documents/ae-mcp-bridge/"
def run(s, g, c):
    r = subprocess.run(["python", D + "aerun.py", s, g, json.dumps(c, ensure_ascii=False)], capture_output=True, text=True, encoding="utf-8"); return json.loads(r.stdout)
FINAL = [930, 304, -2507]; DIST = 1400 - FINAL[2]
ev = json.load(open(D + "ev_oa.json", encoding="utf-8"))["o"]
VISITS = {"OA2 criterios": [10.0, 25.2], "OA3 common app": [20.9], "OA10 japao": [15.1], "OA11 china": [14.2], "OA12 dicas": [22.9, 32.8, 41.6]}
EXTRA = {"OA5 canada": [11.2]}
COMPS = ["OA1 regioes", "OA2 criterios", "OA3 common app", "OA4 documentos", "OA5 canada", "OA6 ucas", "OA7 campus france", "OA8 italia",
         "OA9 europa", "OA10 japao", "OA11 china", "OA12 dicas"]
def zpose(scale, base=FINAL): return [base[0], base[1], round(base[2] + DIST * (1 - 1 / scale), 1)]
for c in COMPS:
    b = run("bbox.jsx", "BB", {"comp": c, "t": [0.6], "layers": ["Titulo"]})["r"]["0.6"]["Titulo"]
    s, k = b["s"], b["k"]; ty = (s[1] + s[3]) / 2
    centred = [FINAL[0], round(FINAL[1] + (ty - 540) * k, 1), FINAL[2]]
    firsts = [e["first"] for e in ev if e["comp"] == c and e["first"] is not None and e["first"] > 0.3 and e["layer"] != "Titulo"]
    t1 = max(0.5, min(firsts) - 0.5) if firsts else 0.5
    keys = [[0, centred], [round(t1, 3), centred], [round(t1 + 0.5, 3), FINAL]]
    for sk in VISITS.get(c, []): keys += [[sk, zpose(1 / 1.06)], [round(sk + 0.35, 3), FINAL]]
    for te in EXTRA.get(c, []): keys += [[te, FINAL], [round(te + 0.35, 3), zpose(1.05)]]
    keys.sort(key=lambda x: x[0])
    res = run("ops.jsx", "OPS", {"comp": c, "ops": [{"op": "nullkeys", "keys": keys}]})
    print(c, [x[0] for x in keys], res["o"])
