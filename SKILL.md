---
name: brasa-ensina-video
description: >
  Produce a BRASA Ensina YouTube episode end to end in Premiere Pro + After Effects. Covers the rough cut from raw
  talking-head footage + script, the house-style motion graphics in AE, then SFX, CRT transitions and preset markers in
  Premiere. Use whenever the user asks to make, cut, edit, animate or finish a BRASA Ensina video (or any step of
  one: "rough cut", "motion graphics", "SFX/transitions"), or to fix BRASA Ensina graphics in an existing .aep.
---

# BRASA Ensina — end-to-end video

Three steps, each ending in a CHECKPOINT where you STOP and wait for the user. Never run past a checkpoint.

**Inputs from the user:** raw footage (Canon `T19A57xx.MOV`), the script (PDF), optionally a transcription.
**One .aep per episode:** if graphics for the episode live in other .aep files, merge them into the episode .aep
(import project → keep the comps + dependencies → rename, e.g. "G38m …") and tell the user to re-link those clips.
**Episode folder:** `Documents\Projetos\BRASA\BRASA Ensina\<episode>\` holds the .prproj, the episode's own .aep (every
graphic of the video lives in that one AE project), raw footage and music.

Read the reference file for a step before starting it:

| Step | Reference |
|---|---|
| 1. Rough cut | [references/rough-cut.md](references/rough-cut.md) |
| 2. Motion graphics (rules + look) | [references/graphics-style.md](references/graphics-style.md) |
| 2. Motion graphics (how to build in AE) | [references/graphics-build.md](references/graphics-build.md) |
| 3. SFX, transitions, presets | [references/sfx-transitions.md](references/sfx-transitions.md) |
| Any step: tools, APIs, gotchas | [references/tooling.md](references/tooling.md) |

## Setup (check once per session)
- **AE bridge:** AE open with the "mcp-bridge-auto" ScriptUI panel running. Run scripts with
  `~/Documents/ae-mcp-bridge/run.sh <script.jsx> [undoName]`; scripts live in `~/Documents/ae-mcp-bridge/scripts/`.
  If the bridge doesn't answer, ask the user to open the panel. Don't work around it.
- **Premiere MCP:** `verify_premiere_connection` first. Most tools are reached via `search_tools` + `invoke_tool`;
  `execute_extendscript` is available for bulk operations.
- **Python:** `C:/Users/lolo/AppData/Local/Programs/Python/Python312/python.exe` (faster-whisper on the GPU, pypdf).
  Several scripts have the episode path or the transcript filename hard-coded (`SRC = ...` in make_xml.py / gaze.py,
  `pb_lines.json`, `transcripts/user_cut.json`). Point them at the current episode before running.
- Back up the .aep before any batch of AE changes (`<name> (backup antes <step>).aep`).

## Step 1: rough cut → CHECKPOINT 1
Keep only real, on-camera, projected takes of each script line, cut tight, as a NEW sequence `<ep> - CORTE v1`
(never touch the user's raw sequence). Details: rough-cut.md. The rules the user had to correct:
- Real take vs practice = **loudness first** (real ≈ −18.5 dB mean, peaks ≈ 0; practice is 3–6 dB quieter), then
  voice confidence, eyes on camera, full sentence. Prefer the **last complete loud take**. A take that fails halfway
  is not a take.
- **Whole sentences, never clipped short (user, Onde aplicar):** keep each sentence complete in ONE clip, natural
  lead-in and tail included. Do not stitch a sentence from fragments, and do not end a clip early because the next
  clip repeats the end of the sentence. Clarity and fluidity beat tightness. When in doubt, extend the clip.
- Whisper word times are NOT cut points. Snap to the audio energy: IN at voice onset, OUT 0.10–0.25 s after the
  last voiced sound. Split lines to remove breaths and pauses.

**STOP.** Hand over the sequence plus a notes file (source of each line, weakest choices). The user re-trims and adds
the vinheta and music. Afterwards, study their changes (`pp_seq.py`, `edges.py`) and log what they corrected.

## Step 2: motion graphics → CHECKPOINT 2
Work from the USER's final cut. Transcribe the assembled cut audio to get a beat map.
1. **Plan host vs graphic beats first** (a table of sequence ranges). The host stays on screen most of the time.
2. Choose per beat:
   - Key info being said → an animated AE comp.
   - An important term → a **G0 card** (static boxed title; the user animates it with presets).
   - Small emphasis → the **Smooth Zoom In preset** on the host clip.
   - Minor detail → nothing.
3. **Build every comp with THE STANDARD (user-approved 2026-10-14, Onde aplicar): the art builder `art.jsx`**
   (graphics-style.md "THE STANDARD", graphics-build.md "Art builder"). Write one ART config per comp in a driver
   like `build_art_oa.py` and build them all in one batch, in place. One comp per idea; long comps split, with host
   time between. Older builders (build_scene / build_list) are legacy: use them only for layouts the art builder
   can't do, and still apply the standard's look.
4. Verify every comp across its whole used range (a frame every ~1 s, openings, moves, rests, the end).
5. Give the user the list of comps to import into Premiere as a table: comp, track, sequence in–out, comp source
   in–out, marked NEW vs already linked. A comp used in several visits is ONE comp: list it once with a "visits" column
   (each visit's sequence + source range), and say "import once, place N times". AE→Premiere import has no MCP
   tool; the user does it.

**STOP** for review. When the user says the comps are imported, continue.

## Step 3: placement, SFX, transitions → FINAL CHECKPOINT
Place graphics on V3, CRT transitions on V4 (Screen), and SFX on A4–A6 for EVERY animation or movement. Set levels
(SFX −10 dB, deep woosh −15 dB, low woosh +10 dB). Scale G0 cards to 50 %. Add markers wherever the user must apply a preset. Export
frames to verify, save, and report. Details: sfx-transitions.md.

## FUNDAMENTAL RULES: the user must never have to repeat these
1. **Host screen time first.** Graphics only for information that needs one. **Each graphic runs ~10–30 s** (vary
   slightly). Split only past ~30 s, with host between. No 1–3 s AE-comp pops. **Alternate graphics and host:** a
   comp shows each point while it is stated, and the host takes over when she expands on it (visits, see graphics-style). G0 cards are the exception:
   usually < 10 s, yellow. IN: exactly ONE SFX, the anime sword hit (Fail jingle if the term is a negative
   point). OUT: one click at the START of the Smooth Out animation, which is anchored to the clip END (end − 0.317 s).
2. **Minor details get no graphic.** Important term → G0 card + smooth in/out presets. Emphasis → smooth zoom in preset.
3. **Presets, never hand keyframes,** for smooth in/out/zoom in Premiere.
4. **No hard cuts inside graphics.** Every appear, change and exit is animated. Never swap Source Text with hold keys
   (use swapanim.jsx).
5. **SFX on every animation and movement,** captions included. No exceptions. **Every SFX plays to its end (or until it can no longer be heard); never cut a tail.** (Exception: CRT-transition glitches stay cut to the TR length.) Lengths are in references/sfx-lengths.tsv. Wooshes = camera movement only (one long woosh per move, sized to it). Graphics/text movement → videogame sounds/jingles. **Main points (list items, pills, columns) get video-game jingles; UI clicks only for small info and out animations** (clicks get lost on main points). Anime sword hit only for static Premiere-animated text (G0 cards).
6. **Left-aligned = positioned left.** A one-line-title section can look centred, then animate to left when the layout
   grows (centerphase.jsx). Title + subtitle + ONE box = a centred block, with the box text left-aligned inside.
7. **Correct capitalisation** on every label ("Custo de vida"). **Hagrid is ONLY for titles and ALWAYS UPPERCASE.**
   Highlight words with yellow Lato instead.
8. **House timing:** ~0.35–0.5 s moves and fades, eases 16.67 / 81–100. No slow drifts.
   **Keyframe curves are ALWAYS RIGHT-SKEWED:** the key a move LEAVES gets LOW out-influence (text 16.67, camera
   ≤33) and the key it ARRIVES at gets HIGH in-influence (90–100). That gives a fast start and a long soft landing.
   NEVER inverted (high out / low in), including camera Null moves after a hold, fade-outs, masks and trim paths.
   Never set ease by alternating per key index. Run `fixskew.jsx` (dry first) on every comp you touch.
9. **Statement order:** both title lines first, then the sentence.
10. **Designed graphic over raw text** when the content has a shape (spreadsheet → table graphic).
11. **Italics ONLY on non-Portuguese terms** (user rule): foreign words, names and English terms (*need-blind*,
    *early admission*, *Common App*, *Chevening*, *CV*) are italic. Portuguese text is NEVER italic, not even
    bad-example quotes, where the strike-through alone marks them.
12. **Margins and positioning are NON-NEGOTIABLE (user has repeated this many times).**
    - Safe margins ~100 px sides / ~80 px top and bottom, at EVERY camera rest and every frame of every move. Nothing
      partly on screen may cross them, and no neighbouring card/box may peek in from off-screen (fade it during the move).
    - Text inside a box is placed deliberately: same baseline across sibling boxes (align by the layer ORIGIN, never
      by glyph boxes: accents like É/Ã/Ç shift them), even padding, and a single label is CENTRED in its box.
      Sibling boxes are identical in size, with even 40–60 px gaps, and the row/grid is centred inside the margins.
    - Never park the camera on an empty spot: a camera move must land as the content arrives.
    - **Nothing is static (user, repeated):** when the camera changes position (an overview pull-back, a new rest),
      RE-ARRANGE the elements during that same move so they fit better: compact the stack, close the gaps, then
      frame it bigger (`posanim.jsx`). Never "fix" margins only by pulling the camera back further.
    - Before showing ANY comp: run `audit_layout.py` (all rests) and look at a contact sheet. Zero findings.
    Every comp opens with content within ~0.3 s.
14. **Design standard = graphics-style.md "THE STANDARD" (follow it number by number).** Left column (yellow
    Hagrid title, Lato subtitle, a stack of translucent cards flipping in on cue) + a right visual synced to the list
    (globe / checklist). Camera: title shot (left-positioned) → ONE 0.7 s move to the full composition → static
    while the frame builds. Never per-card shots, zooms into details, staged spacing, push-ins or drifts. Read its
    §8 "Mistakes made" list before building.
13. **Verify before reporting.** Render the frames and look at them. Never claim a change you haven't seen.

## Work fast (user: "hurry up")
Batch the work: one script per pass over all comps, one `add_to_timeline_batch` per ~50 clips, one
`execute_extendscript` for levels, blend and scale. Verify with ONE contact sheet per pass, not a render loop per
comp. Ask only when blocked.

## Keep learning (MANDATORY, every time)
EVERY piece of feedback the user gives (a correction, a preference, a "do it like this", even a one-liner mid-task)
is turned into a rule IMMEDIATELY, in the same turn, before continuing the work:
1. Update the matching place in this skill: SKILL.md (fundamental rules) and/or the reference file
   (graphics-style / graphics-build / sfx-transitions / rough-cut / tooling), and the scripts it affects
   (e.g. `plan_v2.py`).
2. Append a line to `~/Documents/ae-mcp-bridge/BRASA_Ensina_patterns.md` (the running log, with the date).
3. Tell the user in the reply which files now carry the rule.

Also log the lessons from your own mistakes that the user had to catch. If feedback contradicts an existing rule,
replace the old rule; don't leave both.
