# python mkvar.py name.json  -> writes _var.jsx (ASCII only) and runs nothing
import json, sys
cfg = json.load(open(sys.argv[1], encoding="utf-8"))
open("_var.jsx", "w", encoding="ascii").write("$.global.MCP_VAR=" + json.dumps(cfg, ensure_ascii=True) + ";$.evalFile(new File($.fileName).parent.fsName+\"/make_variant.jsx\");")
print("ok")
