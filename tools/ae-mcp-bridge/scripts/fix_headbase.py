# usage: fix_headbase.py comp[:t] ...  -> put every "Card%d head" on the same offset from its box top (the unaccented
# one = the smallest baseline offset), measured by layer origin. Same-height boxes only. Accents used to push heads down.
import json, sys, subprocess, os, re
D = os.path.expanduser("~/Documents/ae-mcp-bridge").replace("\\", "/")
def run(s, g, c):
    r = subprocess.run(["python", D + "/aerun.py", s, g, json.dumps(c, ensure_ascii=False)], capture_output=True, text=True, encoding="utf-8"); return json.loads(r.stdout)
for arg in sys.argv[1:]:
    comp, t = (arg.split(":") + ["5"])[:2]; t = float(t)
    m = list(run("bbox.jsx", "BB", {"comp": comp, "t": [t]})["r"].values())[0]
    cards = sorted(int(x) for x in set(re.findall(r"Card(\d+) head", " ".join(m))))
    rows = [(ci, m["Card%d head" % ci]["o"][1] - m["Box card%d" % ci]["s"][1], m["Box card%d" % ci]["s"][3] - m["Box card%d" % ci]["s"][1], m["Card%d head" % ci]["k"]) for ci in cards if "Box card%d" % ci in m]
    if len(rows) < 2: print(comp, "skip"); continue
    tgt = min(r[1] for r in rows); ops = []
    for ci, off, h, k in rows:
        if abs(h - rows[0][2]) > 3: print(comp, "card", ci, "box height differs; skipped"); continue
        if off - tgt > 2: ops.append({"op": "move", "layer": "Card%d head" % ci, "d": [0, (tgt - off) * k, 0]})
    if ops: run("ops.jsx", "OPS", {"comp": comp, "ops": ops})
    print(comp, "offsets", [(r[0], round(r[1], 1)) for r in rows], "moved", [o["layer"] for o in ops])
