# usage: audit_layout.py comp[:dur] ...  -> margin violations + uneven text inside sibling boxes at every camera rest
# Rests = scene_<comp>.json keys (+0.05 s) and the end. Uses bbox.jsx (screen bounds + text baseline origin).
import json, sys, subprocess, os, glob
D = os.path.expanduser("~/Documents/ae-mcp-bridge").replace("\\", "/"); MX, MY = 100, 80
def run(s, g, c):
    r = subprocess.run(["python", D + "/aerun.py", s, g, json.dumps(c, ensure_ascii=False)], capture_output=True, text=True, encoding="utf-8"); return json.loads(r.stdout)
for arg in sys.argv[1:]:
    comp, dur = (arg.split(":") + [None])[:2]
    sc = D + "/scene_%s.json" % comp.split()[0]
    keys = json.load(open(sc))["keys"] if os.path.exists(sc) else []
    ts = sorted(set([round(k[0] + 0.05, 2) for k in keys if k[0] > 0] + ([round(float(dur) - 0.1, 2)] if dur else [])))
    rep = []
    res = run("bbox.jsx", "BB", {"comp": comp, "t": ts})
    if "r" not in res: print("==", comp, "ERROR", str(res)[:300]); continue
    for t, m in res["r"].items():
        vis = {n: v for n, v in m.items() if v["op"] >= 50 and v["s"][2] - v["s"][0] > 2
               and v["s"][2] > 0 and v["s"][0] < 1920 and v["s"][3] > 0 and v["s"][1] < 1080}   # on screen (fully off = fine)
        for n, v in vis.items():
            l, tp, r, b = v["s"]
            if l < MX - 2 or r > 1920 - MX + 2 or tp < MY - 2 or b > 1080 - MY + 2: rep.append("t%s MARGIN %s %s" % (t, n, v["s"]))
        boxes = {n: v for n, v in vis.items() if n.lower().startswith("box")}
        rows = {}
        for bn, bv in boxes.items():
            inner = [(n, v) for n, v in vis.items() if n not in boxes and v["s"][0] >= bv["s"][0] - 2 and v["s"][2] <= bv["s"][2] + 2 and v["s"][1] >= bv["s"][1] - 2 and v["s"][3] <= bv["s"][3] + 2]
            if not inner: continue
            top = min(inner, key=lambda x: x[1]["o"][1]); L = min(v["s"][0] for _, v in inner) - bv["s"][0]; R = bv["s"][2] - max(v["s"][2] for _, v in inner)
            rows.setdefault((bv["s"][1], bv["s"][3] - bv["s"][1]), []).append((bn, round(top[1]["o"][1] - bv["s"][1]), L, R, len(inner)))
            if L < 30 or R < 20: rep.append("t%s TIGHT %s padL %d padR %d" % (t, bn, L, R))
        for key, sib in rows.items():
            if len(sib) < 2: continue
            bl = [x[1] for x in sib]
            if max(bl) - min(bl) > 4: rep.append("t%s BASELINE %s" % (t, [(x[0], x[1]) for x in sib]))
            single = [x for x in sib if x[4] == 1]
            if len(single) == len(sib):
                if any(abs(x[2] - x[3]) > 8 for x in sib): rep.append("t%s NOT-CENTRED %s" % (t, [(x[0], x[2], x[3]) for x in sib]))
            elif any(abs(x[2] - sib[0][2]) > 6 for x in sib): rep.append("t%s PAD-LEFT-UNEVEN %s" % (t, [(x[0], x[2]) for x in sib]))
    print("==", comp, "rests", ts, "->", "OK" if not rep else ""); [print("  ", x) for x in sorted(set(rep))]
