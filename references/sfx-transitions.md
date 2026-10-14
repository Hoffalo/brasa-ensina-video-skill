# Step 3: placement, SFX, CRT transitions, preset markers

## Assets (user's machine)
- **SFX:** `Documents\Assets Gerais\Sound Effects\`. Folders: Woosh\{movement woosh, transition woosh}, Positive
  jingles, Neutral, Negative bleeps&bloops, glitches, hit & impact, riser, subwoofer, drone.
- **CRT transitions:** `Documents\Assets Gerais\THE MASTER BUNDLE\THE MASTER BUNDLE\CRT TRANSITION\NN TR.mp4`.
  01–05 = 0.40 s, 06–10 = 0.72 s, 11–15 = 0.96 s.
- **Import:** use `import_media` with binName "sfx" / "transicoes". If import fails, ask the user to import.
- **Bins:** music, sfx, motion graphics, transicoes, other sequences.

## Track layout
- **Follow the user's existing layout when the cut already has one** (bolsas eua: V1 host, V2 graphics + cards,
  V3 vinheta, V4 CRT TRs, A1 voice, A3 vinheta, A4 music, SFX on new A5–A7). The list below is the default.

- V1 interview.
- V2 adjustment layer + vinheta.
- **V3 graphics** (Normal blend).
- **V4 CRT TRs** (blend **Screen = 22**).
- A1 voice, A2 vinheta, A3 music, **A4–A6 SFX**.
- To add audio tracks, use `add_track` with position "above". "below" inserts at the TOP and pushes the voice down.

## Placement
1. Write a segment table `(comp, seqIn, seqOut, srcIn)` plus cards plus zoom spots.
2. Dump each comp's events with `_events2.jsx` (EV = [exact comp names]) → `events2.json`. It records the first key
   time per visible layer plus Null/camera keys.
3. Run the planner. **`scripts/plan_bolsas.py` is the current template** (game-sound mapping, one woosh per camera
   move, full SFX lengths, G0 = one sword hit). Edit SEG / CARDS / ZOOMS / ITEM / SFXID / TITLE / POS / NEG / MV;
   events from `_events2.jsx` → `ev_<ep>.json`.
   - It outputs `*_vbatch.json` and `*_abatch.json`.
   - Sequence time = seqIn + (compTime − srcIn); keep only events inside visible segments.
4. `add_to_timeline_batch`:
   - Graphics: linkAudio false, with source in/out.
   - TRs: linkAudio false.
   - SFX: sourceOutPoint = the sound's audible end from `sfx-lengths.tsv` (never shorter; see the rule below).
5. Run one `execute_extendscript` pass for:
   - TR blend modes = 22 (`AE.ADBE Opacity` props[1]).
   - SFX levels: set ONLY the Volume effect's Level: matchName exactly `Internal Volume Stereo` (or
     `Internal Volume Mono` for mono files like throw-woosh), props[1]. **Never match /Volume/ loosely:** it also hits
     `Internal Channel Volume Stereo`, whose props[1] is the LEFT channel (the user had to ask me to undo that). Linear values: 0 dB = 0.17783, **−10 dB = 0.05623**, **deep woosh (Smooth Zoom In) −15 dB = 0.031623**,
     **low woosh +10 dB = 0.56234**.
   - **G0 card clips → Motion Scale 50** (`AE.ADBE Motion` props[1]).
5b. **Reuse existing audio tracks before adding new ones (user rule):** put SFX on any existing track with free
   space at that time, e.g. the track above the music that only holds the vinheta sound. Add a new track only when
   every existing track is occupied at that moment. Never put SFX on the voice or music tracks.
6. Add preset markers: `seq.markers.createMarker(t)` with name, comments and colour.
   - "PRESET Smooth Zoom In" (on the V1 clip).
   - "PRESET Smooth In/Out Text" (on each G0 card).

   The user applies the presets; the matching woosh is already placed.
7. Verify with `export_frame` (create the folder first). Check graphics, a card, a TR and the last comp.
8. `save_project`. Report: counts, the markers to act on, fixes made, open questions, and the share of runtime under
   graphics.

## CRT transitions
- A TR at every graphic IN and OUT edge, including edges next to cards. Exception: an edge covered by the vinheta.
- Start = cut − 40 % of the TR length, so it overlaps the cut.
- **ONLY `NN TR.mp4` 01–15** from the CRT TRANSITION folder (user rule). Never "CRT Transition 16+" or clips from
  other packs. Lengths: 01–05 = 0.40 s, 06–10 = 0.72 s, 11–15 = 0.96 s; import them into the project if missing.
- Cycle through different numbers; never the same number twice in a row.
- Each TR gets a glitch SFX on the same span, alternating "glitch 2" / "glitches 1", source in-point 0 (both files are
  loud from 0 s). **The glitch is cut to the TR length.** This is the one exception to the "play to the end" rule.

## SFX mapping: EVERY animation or movement gets one
**Sound family follows WHAT is moving (user rules):**
- **WOOSHES = CAMERA MOVEMENT ONLY:** AE camera/Null moves and the Smooth Zoom In preset. Never use a woosh for a
  graphic or text appearing or moving.
- **Graphics / text movement in AE comps → videogame sounds and jingles:** the retro game motion jingle
  (`ES_User Interface, Motion, Motion, Game, Jingle, Event, Retro`, 4 variations at 0 / 1.23 / 2.45 / 3.66 s, each
  ~0.6 s), video-game UI clicks (`…Click, Video Game, Variations`, variations at 0 / 0.58 / 1.17 s), Musical 18 for
  titles, and the Collect Item / Chime / Fail jingles for values. Rotate the variations (sourceInPoint) so repeats
  don't sound identical.
- **Static text animated in Premiere (G0 cards with the Smooth In/Out presets) → anime sword hit.** Keep the sword
  for these. Don't use it inside AE comps.

| Motion | SFX |
|---|---|
| Big Hagrid title in | Musical 18 jingle |
| Pill / box / slot / list item / table box / brace (AE) | retro game motion jingle (rotate variations) |
| **Main point** (numbered list item, pill, column, checklist item, the points she is listing) | **video-game jingle** (Retro "Motion Game Jingle" variations, rotate 0 / 1.23 / 2.45 / 3.66 s), NOT a click. User: clicks "get lost" on main points |
| Small info (sub-line, caption, recap line, example, table row) and OUT animations | video-game UI click (rotate variations) |
| Positive value (€0, ZERO, COBERTA, TOTAL…) | Collect Item jingle / synth major chord |
| Neutral value | Chime Positive 01 / Musical 08 |
| Negative value (OBRIGATÓRIO, NÃO É CUSTO ZERO…) | Collect Item Fail / error.wav |
| Animated value swap | the jingle matching the new value (or UI click) |
| G0 card (static text, Premiere preset) | **IN: ONE SFX only** (user rule): the **anime sword hit** at the clip start; for a **negative point** (e.g. "DIFÍCIL ACESSAR O VALOR") the Collect Item **Fail** jingle instead. No extra jingle. **OUT: one UI click at the START of the out animation** = clip end **− 0.317 s** (the Smooth Out preset is anchored to the clip end; see below). |
| Camera Null move | ONE woosh sized to the move (below) |
| Smooth Zoom In preset | ONE **deep woosh** (only this file), starting at the exact start of the zoomed clip, at **−15 dB** (user rules) |
| CRT TR | glitch (same span) |

### Camera wooshes: ONE long woosh per move, sized to it
Never chain or stack short wooshes to fill a long move. Three whips in a row under a 1.67 s zoom sounds wrong.
Pick a single woosh whose **loud body** (the part within 10 dB of its peak) roughly matches the move's length, and
put its peak on the fastest part of the motion.

| Use | Woosh | Peak | Loud body | Audible end |
|---|---|---|---|---|
| Null move ≥ 1.2 s (ease in/out → peak at the MIDDLE of the move) | low woosh (+10 dB) | 0.85 | 0.45–2.00 | 2.45 |
| Null move 0.5–1.2 s | `683096…woosh` / car pass woosh | 0.80 | 0.45–1.20 | 1.60 |
| Null move < 0.5 s | swoosh_low | 0.15 | 0.10–0.35 | 0.65 |
| Smooth Zoom In (100→110 % over ~1.67 s) | **`deep woosh.wav` ONLY** (transition woosh folder), placed **exactly at the start of the V1 clip that gets the Smooth Zoom In** (same timestamp, no offset) | 0.55 | 0.30–0.80 | 2.35 |

- **Zoom applied mid-clip:** when the Smooth Zoom In keys start after the clip start (read the Motion Scale keys),
  the deep woosh goes at the FIRST zoom key, where the zoom actually starts. Every visible zoom needs one (the Itália
  reviewer flagged a zoom without a woosh). Skip zooms hidden under a graphic.
- **SFX level stays −10 dB** (user, Itália: kept −10 even though a reviewer suggested −4 to −8 dB).
- **NEVER use synth woosh for a Smooth Zoom In** (user: "the one woosh you shouldn't use"); zooms get only deep woosh.
- **Alternatives** for variety on long camera moves (not zooms): ethereal woosh (peak 0.90, body 0.45–1.35), classic deep woosh
  (peak 0.60, body 0.35–0.95), `245936 quick-woosh` (body 0.70–3.45, for very long moves).
- **The whip-zoom file builds to its peak at 1.75 s.** Cutting it at 0.8 s (the old setting) removed the whip
  itself. It is no longer in the default mapping.
- **A camera woosh owns its span:** drop any other woosh that starts inside its loud body. The planner does this.

### EVERY SFX plays to its end (hard rule, all sounds)
Every sound plays until it ends, or at least until it can no longer be heard (tail under ~−60 dB). A cut tail sounds
broken. The rule applies to every SFX: hits, wooshes, whips, jingles, risers, impacts…
**Only exception: the glitch under a CRT TR.** It stays cut to the TR's span (user's call).
- **Origin:** in "paises baratos" the planner cut sword hits to 0.5–0.6 s (the tail is still at −37 dB there) and
  the user extended them by hand. The old fixed trim table was wrong for most sounds: whip 0.8 vs 2.1 audible, fail 1.3 vs 2.8, chord 1.5 vs 2.75, chime 1.1 vs 1.7.
- **Length = the audible end of the sound**, read from `sfx-lengths.tsv` (this folder). It covers all 77 library
  files. Columns: `file_len`, `first_sound_end`, `last_audible`, and `MULTI` when the file holds several sounds in a
  row.
  - Single-sound file: use `last_audible` (or simply the whole file).
  - MULTI file (quick swishes, Collect Item, chimes, glitch packs, click variations…): use `first_sound_end`. This
    stops before the next variation starts, so you never hear half of a second sound.
- **New or unknown SFX:** run `python Documents\ae-mcp-bridge\scripts\sfx_tails.py "<folder>"` and add the rows to
  the TSV.
- **Never shorten a sound to fit.** If the next clip on the same track would cut a tail, put the sound on another
  track: A4–A6, then add A7+ (`add_track` position "above"). The planner (`TAIL` dict in `plan_v2.py`) does this.
- **Verify after placement:** list every SFX clip and check that its duration ≥ its TSV length (or ≥ the file
  length if that is shorter). Fix any clip that falls short before reporting.

Planner values in use (s): sword hit 1.6 · whip-zoom 2.13 · quick swish 0.45 · low woosh 2.45 · swoosh_low 0.65 ·
Collect Item 1.4 · Collect Item Fail 2.8 · synth chord 2.75 · Chime 01 1.7 ·
click 0.5 · error 0.35.

**During camera moves:** the move's woosh replaces sounds only for EXITS / leftovers fading out. Anything that
APPEARS during a move (a step card, a title) still gets its own sound. In entrevista the step cards in G2 land
mid-move: retro jingle + woosh.

**Dedupe and stacking:**
- Within 0.15 s, keep the more specific sound (value > title > hit > caption).
- **The same sound repeated within 0.35 s collapses to one** (staggered cascades).
- Stack greedily on A4–A6 (A7+ when needed). Use each SFX's **full audible length** (above), so long tails get their
  own track instead of being cut by the next sound.

## Premiere presets (user's, in `Effect Presets and Custom Items.prfpset`)
- **Preset timing:** Smooth In is anchored to the clip START (0 → 0.867 s). **Smooth Out (Up) is anchored to the clip
  END** (last 0.317 s: end − 0.317 → end). So the card can be as long as the speech needs. Sync the SFX to where
  each animation actually starts: sword at the clip start, out click at end − 0.317. Read the keyframes in Premiere
  to confirm. If you trim a card after the presets are applied, move the out keys with the new end (Premiere
  ExtendScript: getKeys / removeKey / addKey / setValueAtKey on the Transform props).
- "Smooth In Text" / "Smooth Out Text": static G0 cards. Opacity plus a ~45 px rise over 0.867 s in; a short fade
  out at the end.
- "Smooth Zoom In": host clips, Scale 100→110 % over ~1.67 s (fast start, long soft landing).
- "Fast Smooth In/Out" variants exist.
- No MCP tool applies user presets, so mark the spots. Never imitate a preset with hand keyframes.

## SFX for THE STANDARD comps (art builder), planner `plan_oa_art.py` (2026-10-14)
- Built from the ART configs, not from a keyframe dump: title → Musical 18; subtitle → click; each card flip → retro
  game jingle (rotating variations); card sub-lines arriving later → click; lone pin pops and ripples → click; ticks
  and globe whips land on the card cue and are covered by its jingle.
- **Camera: one woosh per move.** With THE STANDARD camera that is usually ONE car-pass woosh per comp (the 0.7 s move from the title to the full composition, peak at mid-move); a quick ≤ 0.65 s move → swoosh_low.
  Jumps hidden between visits get none. Wooshes never merge with jingles in the dedupe.
- **Always re-plan SFX AFTER the camera/animation is final** (user: "do that before you change the sfx so you can
  reflect the changes").
- Replacing: delete only the graphic-visit SFX (skip glitch, deep woosh, vinheta) and watch the window: a ±0.9 s
  window caught a G0 card out-click once; restore anything outside the visits.
