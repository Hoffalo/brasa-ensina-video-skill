# Step 2: building graphics in AE

All scripts are in `~/Documents/ae-mcp-bridge/scripts/` and run through `run.sh <script> [undoName]`. Each script
reads its config from a `$.global.X = {...}` line. Generate a small wrapper .jsx (`$.global.X=<json>;$.evalFile(...)`)
with Python using `json.dumps(ensure_ascii=True)`. **Never put raw UTF-8 in a .jsx**; accents must go in as \u
escapes, or the text turns to gibberish.

## Beat map
1. Read the user's final cut: `pp_seq.py <prproj/autosave> "<seq>"` gives the clip list.
2. Assemble the cut audio with ffmpeg (adelay / amix) and transcribe it to `transcripts/user_cut.json`.
3. `findw.py "phrase@after"` gives the sequence time of a phrase. Graphic cues = the moment each idea is SAID.

## Workflow per graphic
1. **Start from an approved comp of the same family** when one exists.
   `make_variant.jsx` (config via `mkvar.py var_X.json` → `_var.jsx`), MCP_VAR = `{src, name, dur, inPlace,
   layers:[{p, text, start, hide, show}], keyMap}`. It duplicates or edits in place, sets texts statically, shifts
   each layer's animation rigidly to its `start`, hides layers ("[off] " prefix) and remaps camera keys. Layer-name
   prefixes match the first 30 characters.
2. **Existing comps that need new timing:** `retime.jsx` (MCP_RT `{comp, anchors:[[old,new]], dur}`), then ALWAYS
   `fixslow.jsx` (FS `{comps, maxd:0.62, dur:0.45}`). A beat boundary between two keys stretches the animation.
3. **Value changes:** `swapanim.jsx` (SW `{comp, layer, oldText, newText, t}`).
4. **Centred-looking phase → left columns:** `centerphase.jsx` (CP `{comp, ref, groups, t, t0, t1}`).
5. **Spreadsheet / table:** `build_table.jsx` (TB `{comp, base, x, y, w, rh, split, tBox, rows:[{label, value, t,
   yellow, thick, fill, font, vfont}], note}`). Row order = the order things are SAID. Text baseline ≈ row centre.
6. **G0 cards:** `make_card.jsx` (CD `{src:"G0", name, text}`). G0 font size is 170 in a 3840 comp. Don't shrink it;
   cards are scaled 50 % in Premiere.
7. **Margins / framing:**
   - `fitcam.jsx` (MCP_FIT `{comp, times, mx:100, my:80}`, keyFrom/holdTo, re-runnable) lowers the camera zoom so
     content fits.
   - `centercam.jsx` (MCP_CC `{comp, t, keys, x}`) centres content at a rest.
   - Small fixes: `_nudge.jsx` (NUDGE `{comp, name, dx, dy}`) and `fadeout.jsx`.
8. **Text and box passes** on older comps: `lib_textbox.jsx` (per-comp SPEC table), `deitalic.jsx`, `prefixnum.jsx`.
9. **Verify:** `shots.sh TAG "<comp>" t1 t2 ...` renders frames and a contact sheet into `frames/`. Check every ~1 s
   over the USED range, including openings, every move and rest, and the end.
10. Save (`app.project.save()`) after each verified batch.

## General-purpose tools (added on bolsas eua)
- `aerun.py <script.jsx> <GLOBAL> '<json>'` writes an ASCII-escaped wrapper and runs it through the bridge (Python,
  no WSL bash issues).
- `bbox.jsx` (BB `{comp, t:[...], layers?}`) → screen + world bounds per layer and `k` (world units per screen px on
  that layer's plane). Lay out in SCREEN px, convert with k. AV layers report their full canvas: measure logos from
  a rendered frame instead (non-green pixels).
- `ops.jsx` (OPS `{comp, ops:[...]}`): text/runs, move (shifts all keys), pos, in/out (house anim), box/line (trim
  draw-on, optional fill), addtext, keyval, nullkeys/nullscale, cutkeys, scale, retime. Layer refs by name or "#idx".
- `ops.jsx` resolves "#idx" in layer/after/before/glowFrom BEFORE running (indices shift as ops insert layers);
  `remove` op exists. New text via `addtext` inherits scale 100: size it against neighbours (they are often 50–80 %).
- `rise.jsx` / `speedin.jsx` both skip entrances paced with a camera move.
- Gotchas met: inline highlight layers can carry a leftover Scale (82 %); a key value read through a truncated dump
  is not safe to rewrite; a camera dolly through a section that never fades = broken frames.
- Merging another .aep: `importFile` with ImportAsType.PROJECT, keep the needed comps + their dependencies, delete
  the rest, rename (e.g. "G38m …") to avoid name clashes. Premiere clips still point at the old file until the
  user replaces them.

## Building new list / pill / column comps fast: `build_list.py <config.json>`
- Duplicates a house-style template comp (BG + Null + camera, e.g. G25), removes its content, and builds:
  a Hagrid title (auto-shrunk to ≤1500 px), items in Lato with yellow-bold highlights, yellow numbers, italic
  ONLY on foreign terms (`it:[...]`), a yellow box (list), pills (`layout:"pills"`) or two boxed columns
  (`layout:"cols"`). It also adds house entrances (≤40 px rise, 0.4 s) on each item's cue time and optional
  strike-throughs (`strike_t`). The layout is computed in screen px through the 3D camera (probe → k).
- Rows/pills align by BASELINE (all items start on one baseline and move by the same amount + row offset). Aligning
  by glyph boxes made rows uneven, because accents and descenders change the box (fixed in build_list.py).
- 3 columns rarely fit at item_px 52: use a numbered list instead, or item_px ≤ 44.
- G0 cards: `make_card.jsx`, then `cardfit.jsx` (CF2 `{comps, text:{comp:"LINE 1
LINE 2"}}`, which centre-justifies
  and resizes the box), then recentre the text on the box by its bbox delta (`bbox.jsx` + `ops move`). Break long
  terms (> ~20 characters) into 2 lines.
- **build_list output is static and glowless; ALWAYS follow it with:** `addglow.jsx` (house glow) and a camera pass
  like `cam_oa.py` (LEGACY, superseded by THE STANDARD §5): the title centred, then a 0.5 s tilt to reveal the list. Each later visit gets a quick 6 % push
  (0.35 s) that ends on the normal framing, plus a quick ≤5 % push on a new topic inside a comp. Then put a woosh on
  each move in step 3 (car-pass for ≥0.45 s, swoosh-low for quick pushes).
- Template G2 (Onde aplicar .aep) ships with camera depth of field ON; switch it off before duplicating.
- Configs (`cfg_*.json`) keep times in comp-local seconds = word time − visit start.
- Gotchas fixed: template layers end at the template's length, so `_dupcomp.jsx` extends them (otherwise black
  frames and a lost camera after 10 s); boxes/pill fills go UNDER their text (`after`); list rows use a uniform pitch
  (accents must not change spacing); `make_card.jsx` resizes the rect instead of scaling it (pinched corners).

## Document-page graphics: `cvpage.jsx` (driver example: `build_cv12.py`)
- Render the page with PyMuPDF (`/c/Python314/python`, `pymupdf`): `get_pixmap(dpi=200)` → PNG, and `search_for(text)`
  → section/phrase rects in pt (px = pt × 200/72).
- Probe the camera (`ops addtext` probes at z=0 / z=-150 + `bbox.jsx`) to get k and the screen→world mapping. The page
  layer gets anchor [0,0] and scale k·100, so page-parented children work in SCREEN px. A "Card rig" null at
  z=-150 (scale k1·100) does the same for the pulled-out card.
- Ops: page (house rise + X tilt + drop shadow), dim (inverted rounded mask keyed per section; collapse the hole
  while a card is up), box, hl (multiply highlighter wipe), strike, text, measure, place, in/out, order, nullkeys.
- Layer order matters for coplanar 3D layers: tabs above section boxes, card text above the card box. Avoid a
  config key named "op" inside an op.
- Visits: one comp, several Premiere source ranges. Do camera jumps between visits while the graphic is off screen.

## Curve-shape pass (EVERY comp you create or edit)
- `fixskew.jsx` (FK `{comps:[...], dry:true|false}`) finds segments whose out-influence > the next key's
  in-influence (the inverted shape) and swaps them, so you get low out and high in. Run it dry first, then for real.
- Ease helpers (`ops.jsx easeAll`, `cvpage.jsx ease`) set EVERY key in=high / out=low. Never alternate by key index.

## Scene builder (motion language): `build_scene.py <cfg>` (configs `scene_cfg_oa*.json`)
- layout "stack" (title + one box) or "cards" (one card per topic, focus_t per card, overview_t). It builds the big
  title opening, a 0.7 s camera reveal or travel, depth (title z 0 / content z −1300), `in3d` entrances, boxes and
  glow, and writes `scene_<comp>.json` with the camera moves for the SFX planner.
- Camera null keys MUST have linear spatial interpolation with zero tangents (ops `nullkeys` does this). Auto-bezier
  makes the camera DRIFT between identical hold keys, off-centring the framing (and it reads as a "slow zoom").
- Size text with ONE font size per class (title / heads / body), never per-layer glyph boxes.
- Rebuilt comps get NEW item IDs: the Premiere clips go offline and the user re-imports; then re-place the clips.

## Entrance-rise pass (EVERY comp)
- `rise.jsx` (RS `{comps:[...], px:50, dry:true|false}`): for each fade-in it pulls the first Position key toward
  the second, so the on-screen travel is ≤ px. The final position is untouched. Run `dry:true` first to list the
  rises; the backup comes before the real run.
- `speedin.jsx` (SP `{comps, maxd:0.5, d:0.4, dry}`): then speed up slow entrances by moving Position key 2 and the
  Opacity key that ends the fade to start + d. It skips quick ones, camera-paced ones and tight key chains, and
  prints why. The SFX don't move, because they sit on the start key.

## Alignment pass (do it on EVERY comp, also on user-built ones)
- Any multi-line body paragraph that is centred point text breaks the rules. Convert it with `lib_textbox.jsx`
  (add a `"<PREFIX>:<comp>": {skip:[titles, labels, cells], pairs:[[first, continuation]]}` entry and run with
  `MCP_SPEC_PREFIX`; the bare SPEC keys belong to old episodes and clash by name).
- After converting: set the remaining point texts of the group to left justification and align every member to one
  left edge (`bbox.jsx` + `ops.jsx move`). Timeline columns: block centred under its marker, text left inside.
- Short justified lines open big word gaps: widen the box (`ops boxw`), shrink the font slightly, or rewrite the text
  as ONE paragraph (old hard returns around a style change survive the reflow). Paragraphs that share a column share
  the box width, scale and font size.
- `ops text` resets fontCapsOption, so pass `allcaps:true` for Hagrid layers that relied on All Caps.

## Before handing the comps over (CHECKPOINT 2)
- **Check every graphic's CONTENT against the transcript** (names, spellings, which example goes with which point),
  not just its timing. Existing comps can carry typos ("Chenning", "Fullbright") or mismatched examples.
- Check every comp against the FUNDAMENTAL RULES (SKILL.md) and graphics-style.md.
- Check that each comp's resolution matches what Premiere expects (G0 = 3840, others = 1920).
- Give the user the comp list with sequence in/out, and add sequence markers if the Premiere bridge is up.

## Typical bugs to check for
- Text running off-frame, or a left-aligned title floating mid-frame.
- An empty first second at the start of a comp.
- Values touching the right margin.
- Mixed-case Hagrid.
- Italic on Portuguese words (any), or a foreign term left upright (should be italic).
- Glyph gibberish from non-ASCII scripts.
- Stretched animations after a retime.
- A TOTAL / fill shape covering its own text (fix with `moveToBeginning` on the text).


## Layout QA (run before showing ANY comp; zero findings)
- `audit_layout.py "<comp>:<dur>" ...`: at every camera rest (from `scene_<comp>.json` keys) and the end, it flags:
  - MARGIN: on-screen element crossing 100/80 px (fully off-screen is fine; peeking in counts).
  - BASELINE: sibling boxes whose text baselines differ by > 4 px.
  - NOT-CENTRED: single-label boxes whose left/right padding differ by > 8 px.
  - PAD-LEFT-UNEVEN / TIGHT: uneven or too-small padding in text boxes.
  It does NOT see timing problems (an empty frame while the camera waits for content): also look at a contact sheet
  across each comp's first seconds and every move.
- `bbox.jsx` now returns `o` = screen position of each layer's origin (text baseline). Use it for alignment.
- `fix_headbase.py "<comp>:<t>" ...`: puts every "Card%d head" at the same offset from its box top (unaccented one).
- `shiftwin.jsx` (SWN `{comp, layers:["@null", ...], from, to, dt}`): shift only the keys inside a time window,
  keeping eases and spatial tangents (camera Nulls stay linear). Move the matching woosh in Premiere by the same dt.
- In-place re-layout of a card row (OA1 recipe): measure with bbox at the overview, compute identical boxes + gaps +
  centred row in screen px, `ops move` the labels (dx/dy × k), `remove` + `box` the boxes (same draw-on time,
  `glowFrom` the label). Keeps the comp's item ID, so the Premiere clips stay linked.
- build_scene.py (cards) now: baseline alignment by origin, centred label-only cards, 40/60 px gaps, a fit loop,
  a margin check at every camera rest (prints MARGIN VIOLATIONS), and a guard that moves `focus_t` so the camera
  arrives as the card's cue is spoken.
- `posanim.jsx` (PA `{comp, t0, t1, items:[{layer, d:[dx,dy,dz] world}], zoom?:{from,to}, clearZoom?, zoomValue?}`):
  re-arrange layers during a camera move (right-skewed ease, linear spatial) and key the camera zoom on the same
  move. Recipe (OA2 overview): measure at the overview pose with bbox, compute the compact layout in screen px,
  d = delta × layer k, zoom so the block fills ~90 % of the safe area. Keep `fitcam` for nothing but emergencies.
- `glowlight.jsx` (GL `{comps, a, b, radius, intensity}`): converts every Glow in the comps to the light A&B glow.

## Art builder (G45 vocabulary): `art.jsx` + driver `build_art_oa.py` (Onde aplicar configs = template)
- Rebuilds a comp IN PLACE (keeps the comp item, camera rig and BG; Premiere links survive). ART config:
  `{comp, title, sub?, kind:"card"|"label"|"head", items:[{text, t, hl, lines:[{text,t,hl}]}], visual, signs}`.
  - kind "label": centred Hagrid labels (region lists). "card": Lato sentences, "N." number in yellow Hagrid, hl
    words yellow Lato Bold. "head": Hagrid header + Lato lines arriving on their own cues.
  - visual "globe": pins `{name, lat, lon, t}` pop on their cue; `face:[[t, lon, lat]]` whips the globe to face each
    place; `ripple: t` pulses all pins. Signs for this rig: `{"spin": -1, "tilt": 1}` (verified on OA1).
  - visual "check": a translucent panel that flips in like a card and ends flat, one row per item: the box fills
    yellow, the check mark draws on and the bar turns yellow on each item's cue. For processes and documents.
  - camera: `shots` `[{target:"title",m0:0,m1:0},{target:"overview",m0,m1}]` + `reveal {t0,t1}` (= the move; the
    visual slides home from `vshift` 700 px during it). The driver's `shots_subject()` builds this from the cues:
    move at max(1.2, first cue/pin − 0.35) for 0.7 s, pins moved to the arrival. `pitch: 0` (no staging).
    art.jsx frames left-aligned targets with their left edge on the 150 px margin (`poseFor(..., left=true)`) and
    keys the title's x for parallax in the title shot.
- Layout in screen px at the rest pose: left column from x 150 (title, subtitle, cards; one font size per class,
  shrunk until the widest card fits 820 px), visual centred in the remaining right zone, block centred vertically,
  margins 150/100 (air beyond the 100/80 safe margin). See graphics-style.md THE STANDARD for every number.
- Camera: title shot → one 0.7 s move to the overview → static (THE STANDARD §5). Old zoom/rotation keys cleared.
  (The first version used a push-in + drift and then per-card "snappy" shots; both were rejected by the user.)
- **AE quirk:** a Glow on a 3D Lato subtitle made it vanish on some frames (it rendered only once the glow was
  off). Glow goes on the TITLE only.
- **saveFrameToPng warm-up:** the first 1–2 frames of each `shots.sh` run can come out black. Put a throwaway frame
  first, and never judge a comp from the first frame of a run.
- **A shape layer left rotated on Y gets clipped by AE along a straight vertical line** (OA4 checklist panel, its
  children were not clipped). Animated panels must END flat (rotation 0); keep life with a gentle position float.
- `audit_layout.py` false positive: the globe's flat "Paralelo" rings report a square bbox wider than the circle;
  judge the globe from the frame.
- SFX must be re-planned after an art rebuild (camera moves and event times change): cards flip on the item cues,
  pins pop / checks tick on the same cues, and one car-pass woosh per comp for the title → overview move.
