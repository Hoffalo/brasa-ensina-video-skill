#!/bin/bash
# usage: shots.sh TAG COMP t1 t2 ...  -> renders frames and builds frames/sheet_TAG_COMP.png
D="$HOME/Documents/ae-mcp-bridge"; tag=$1; comp=$2; shift 2
arr=$(IFS=,; echo "$*")
rm -f "$D/frames/${tag}_${comp// /_}_"*.png
printf '$.global.MCP_SHOTS = {"%s": [%s]}; $.global.MCP_TAG="%s";\n$.evalFile(new File($.fileName).parent.fsName + "/frames_x.jsx");\n' "$comp" "$arr" "$tag" > "$D/scripts/_shots.jsx"
bash "$D/run.sh" _shots.jsx shots >/dev/null
python "$D/scripts/sheet.py" "$tag" "$comp" "$@"
