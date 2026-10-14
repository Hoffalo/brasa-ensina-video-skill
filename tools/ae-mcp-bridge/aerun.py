# usage: aerun.py <script.jsx> <GLOBALNAME> '<json>'  -> writes an ASCII-escaped wrapper and runs it through the bridge
import json, sys, os, time
D = os.path.expanduser("~/Documents/ae-mcp-bridge").replace("\\", "/")
s, g, cfg = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
open(D + "/scripts/_w.jsx", "w", encoding="ascii").write("$.global.%s=%s;$.evalFile(new File($.fileName).parent.fsName+'/%s');" % (g, json.dumps(cfg, ensure_ascii=True), s))
res = D + "/ae_mcp_result.json"; before = os.path.getmtime(res) if os.path.exists(res) else 0
json.dump({"command": "runScriptFile", "args": {"path": D + "/scripts/_w.jsx", "undoName": s}, "status": "pending"}, open(D + "/ae_command.json", "w"))
for i in range(600):
    time.sleep(0.5)
    try: st = json.load(open(D + "/ae_command.json")).get("status")
    except Exception: continue
    if st in ("completed", "error") and os.path.getmtime(res) >= before:
        sys.stdout.reconfigure(encoding="utf-8"); print(open(res, encoding="utf-8", errors="replace").read()[:60000]); sys.exit(0)
print("TIMEOUT")
