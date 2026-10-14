#!/bin/bash
# usage: run.sh <script.jsx> [undoName]  -> queues runScriptFile and waits for result
D="$HOME/Documents/ae-mcp-bridge"
before=$(stat -c %Y "$D/ae_mcp_result.json" 2>/dev/null || echo 0)
P="C:/Users/lolo/Documents/ae-mcp-bridge/scripts/$1"
printf '{"command":"runScriptFile","args":{"path":"%s","undoName":"%s"},"status":"pending"}' "$P" "${2:-MCP script}" > "$D/ae_command.json"
for i in $(seq 1 120); do
  st=$(grep -o '"status": *"[a-z]*"' "$D/ae_command.json" | head -1)
  now=$(stat -c %Y "$D/ae_mcp_result.json" 2>/dev/null || echo 0)
  if [[ "$st" == *completed* || "$st" == *error* ]] && [ "$now" -ge "$before" ]; then cat "$D/ae_mcp_result.json"; exit 0; fi
  sleep 1
done
echo "TIMEOUT: $st"
