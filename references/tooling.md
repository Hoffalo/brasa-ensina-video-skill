# Tooling, APIs and gotchas

## AE (ExtendScript through the bridge)
- **Bridge:** `~/Documents/ae-mcp-bridge/run.sh <script> [undo]`. It writes `ae_command.json` (runScriptFile) and
  waits for `ae_mcp_result.json`. The MCP server's allowlist blocks runScriptFile, which is why run.sh exists. Pass
  the script name relative to `scripts/` (not "scripts/x.jsx").
- **Check the bridge runs in the AE the user SEES.** After an AE restart an old windowless AfterFX.exe can keep the
  panel alive. Edits then land there, invisible to the user, and their save of the stale project would overwrite
  yours. Check `Get-Process AfterFX | select Id,StartTime,MainWindowTitle`; if more than one has the project, ask
  the user. Never let them save the stale window. (A windowless AfterFX started by Premiere is the Dynamic Link
  server; leave that one alone.)
- **Commands stuck at "pending"** = the bridge panel is not processing (e.g. after AE/PC restart). Check in order:
  (1) Window → mcp-bridge-auto.jsx open, "Auto-run commands" ticked; (2) the panel log shows only the two startup
  lines and `ae_mcp_result.json` is older than the AE start → the panel never read the file: Edit → Preferences →
  Scripting & Expressions → "Allow Scripts to Write Files and Access Network" must be ON (it can reset after crashes),
  then close and reopen the panel; (3) "Check for Commands Now" bypasses the timer if it was dropped.
- **Check that AE has the .aep that Premiere links to** before editing: list the timeline clips' media paths in
  Premiere. On Bolsas EUA the user had an older copy ("cv Motions (Claude edits).aep") open while the timeline used
  "cv Motions.aep"; editing the copy would change nothing in the video.
- **ASCII only** in .jsx. Build configs with Python `json.dumps(ensure_ascii=True)`. Read JSON outputs with an
  explicit encoding (utf-8, falling back to cp1252).
- **Language traps:**
  - Chained ternaries mis-evaluate; use if/else.
  - `"str"+errorObj` can throw.
  - Reading combined Position on separated-dimension layers throws.
- **Read-only properties:** boxText is read-only (rebuild the layer); allCaps is read-only (use fontCapsOption).
- **Stale references:** adding shape properties invalidates earlier refs. There is no comp.layerByID.
- **Text measurement:** measure text bounds INCLUDING Transform-effect (ADBE Geometry2) offsets; they are in comp
  pixels. Members on different 3D planes must be projected at the settled camera view. Icon PNGs have padded
  canvases, so space them by rendered pixels.
- **Undo is unreliable:** scripted Edit>Undo (executeCommand 16) doesn't work dependably. Restore damaged comps from
  a backup .aep instead.
- **Importing another .aep (merge) can open a modal dialog** (missing footage / fonts) that blocks the bridge: the
  command stays "running" and aerun.py prints TIMEOUT. Ask the user to dismiss the dialog; the script then finishes.
- **Template layers can START late** (a Null that begins at 0.88 s): probing before it exists measures the wrong
  camera. `_dupcomp.jsx` now pulls Null/Camera/BG in-points to 0.
- **Never use the Render Queue from a script** (it crashed AE). Use saveFrameToPng (`frames_x.jsx` via `shots.sh`);
  if it stalls, wait and retry.
- **Margin fitting:** lowering the camera zoom scales every 3D layer's screen offset uniformly; scale 2D layers about
  the centre by the same factor. Only count layers mostly on screen. Exclude tall scrolling content.
- **Text edits that reflow:**
  - Capitalising a word can push a justified line into a wrap; re-check widths.
  - Split-sentence padding must be re-measured after any font change.

## Premiere MCP
- Call `verify_premiere_connection` first. The catalog is reached via `search_tools` (query or regex `pattern`) +
  `get_tool_schema` + `invoke_tool`.
- **Useful tools:**
  - Timeline: list_sequence_tracks, add_to_timeline(_batch), add_track / delete_track, set_active_sequence.
  - Media: import_media, find_project_item_by_name, check_offline_media, import_fcp_xml.
  - Audio, blend, markers: adjust_audio_levels (dB), set_blend_mode, add_marker.
  - Keyframes: get_keyframes, remove_keyframe.
  - Output: export_frame, save_project.
- **execute_extendscript** `{script}`: wrap the code in an IIFE that RETURNS a string. A bare expression returns
  "undefined". Use it for any bulk operation (levels, blend, scale, markers) instead of hundreds of calls.
- **Component properties:**
  - Volume = "Internal Volume Stereo" / "Internal Volume Mono" props[1] (linear; 0 dB = 0.17783). Match the exact
    matchName: "Internal Channel Volume Stereo" also contains "Volume", and its props[1] is the Left channel.
  - Opacity = "AE.ADBE Opacity" (props[0] opacity, props[1] blend mode: 18 Normal, 22 Screen).
  - Motion = "AE.ADBE Motion" (props[1] Scale).
- **"MCP Bridge is not running" on a big batch** can be a false error: the batch may have been placed. Count the
  clips per track BEFORE retrying, or everything gets doubled.
- **export_frame:** "Illegal Parameter type" means the output folder doesn't exist.
- **Dynamic link cache:** Premiere keeps the cached render after an AE save, so verify AE-side fixes in AE.
- **Offline comps after a folder rename:** once the user re-imports, list the timeline clips whose projectItem is
  offline, remove them, and place the new items at the same start + source in/out with `add_to_timeline_batch`
  (linkAudio false). Verify with export_frame.
- **No MCP tool** imports AE comps or applies user effect presets. The user does both.
- **Clip names lie:** they can drift from the comp names. Identify the real comp via the gzipped .prproj
  (dynamic-link ImporterPrefs → comp GUID) when it matters.
- **Timelines from XML:** generate FCP7 XML (`make_xml.py`) → `import_fcp_xml` creates a new sequence linked to the
  existing media.

## Python / media
- **Python:** 3.12 at `C:/Users/lolo/AppData/Local/Programs/Python/Python312/python.exe`. PIL is NOT installed there
  (sheet.py / gaze.py run under the default `python`).
- **Transcription can die silently on the GPU** while AE is open: the process exits with no output and no file.
  Fall back to a CPU copy of transcribe.py (raise before the cuda model so it uses "medium"/int8); it is slower but
  reliable. Start it in the background early.
- **faster-whisper:** add the nvidia-cublas/cudnn wheel `bin` dirs to the DLL path (done in transcribe.py).
- **ffmpeg** (on PATH): volumedetect, silencedetect, adelay/amix for assembling cut audio.
- **Episode-specific scripts:** check the hard-coded paths at the top of make_xml.py, gaze.py, align.py and findw.py.
- **Windows console:** set `PYTHONIOENCODING=utf-8` when printing accented or € / − text.
