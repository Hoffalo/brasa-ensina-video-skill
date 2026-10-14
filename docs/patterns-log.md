# BRASA Ensina — production patterns (running notes)

## END-TO-END WORKFLOW (dictated by the user — this is the backbone of the skill)
Inputs from the user: raw footage, a transcription of it, and the SCRIPT the video must follow.

1. **Rough cut (Premiere)** — keep only takes where the host recites the script LOOKING AT THE CAMERA, choosing the
   clearest take per line. Beware practice takes: the host often rehearses a line looking at the computer — those
   don't count even if they sound clearest. A real take = projecting the voice + looking at the camera. Only if no
   on-camera take exists for a line, use the best-spoken version that is still a real (projected) reading, not practice.
   → **CHECKPOINT 1**: stop; the user reviews, trims/adjusts cuts, adds music and "vinhetas".
2. **Motion graphics (After Effects)** — after the user's OK. The user opens an empty AE project with only the
   background, camera and null rig. Build the graphics with everything learned (typography, colours, rules in this
   file + the BRASA visual identity manual "Manual de ID Visual BRASA"), replicating the user's keyframe curves and
   glow effects. Ask the user for icons when needed (they can search/download them), or make/find them if possible.
   → **CHECKPOINT 2**: add MARKERS on the Premiere timeline showing where each motion graphic goes (the user places
   them). The user reviews and adjusts or asks for adjustments.
   - Some graphics are static (a box around text on a transparent background, no AE animation); the user imports them
     into Premiere and animates them with installed presets ("smooth in text", "smooth out text" and variations).
   - The user also uses a "smooth zoom in" preset on normal clips to emphasise something without a full graphic.
3. **SFX & transitions** — after the green light. Use the available SFX and transition VFX (wooshes; positive /
   negative / neutral jingles; glitches; CRT transitions "TR <n>"). EVERY on-screen motion (Premiere motion preset
   or AE animation) gets a matching SFX:
   - wooshes for camera movement and zoom-ins;
   - positive jingles for good points (usually text) appearing; neutral jingles for neutral; negative for negative;
   - levels: all SFX at **-10 dB**, except **low woosh at +10 dB**.
   → **FINAL CHECKPOINT**: the user verifies, asks for revisions if needed, done.

Collected while editing the "Portugal" and "Projeto de Pesquisa" videos (2026-10-11). Source material for a future
"make a BRASA Ensina video end-to-end" skill. Facts are observed in the projects; *italic* lines are user preferences
stated during the work.

## Project organisation — THE SYSTEM TO USE (from the user's own "2-carta motivação" project)
- One folder per episode: `Documents\Projetos\BRASA\BRASA Ensina\<episode>\` containing the .prproj, its OWN
  `Motions.aep` (every graphic of that video lives in that one AE project), raw footage, music.
- Premiere bins: `music`, `sfx`, `motion graphics` (all dynamic-linked comps + transition.mov), `transicoes`
  (TR clips), `other sequences` (CLEAN CUT, GRADE versions…). Main sequence named after the episode.
- Extra sequences kept as versions: "<ep> - CLEAN CUT", "<ep> - GRADE v2", "<ep> unfinished".
- AE: comps named G0, G0.1, G0.2… for the boxed title cards (3840x2160, used with the smooth in/out presets),
  G1…Gn for the animated graphics in timeline order (1920x1080, 60 fps); solids in a "Solids" folder.
- TR clips in that project cycle sequentially 01→15 through the video.
- Music there: a calmer intro track under the cold open (-25 dB) then the main bed (-7 dB with a ducking/fade
  component). SFX levels in that older project vary (-15…-7 dB) — the user's stated rule (-10 dB, low woosh +10 dB)
  is what to apply going forward.
- Cold open (before the first vinheta) can also contain boxed cards (G0 + presets) and a "transição.mov" wipe.

## Premiere conventions (studied in "Projeto de Pesquisa BE.prproj", 2026-10-11)
Track layout:
- V1 interview (jump cuts) · V2 adjustment layer over everything · V3 AE graphics + Vinheta · V4 CRT transitions
  ("NN TR.mp4", CRT TRANSITION bin) and overflow graphics · V5 extra overlapping cards.
- A1 interview audio · A2/A4/A5 SFX (stacked when they overlap) · A3 music ("ES_Radar Focus - Blue Saga", one bed
  for the whole video, starts right after the first vinheta).
- Vinheta "Vinheta BRASA Ensina.mov" after the cold-open hook (~0:29) and at the very end, with its own audio.
Audio levels (Premiere "Level" is stored linear, 0.1778 = 0 dB):
- every SFX -10 dB (0.0562) · low woosh +10 dB (0.5623; once +10.9) · deep woosh at the end -15 dB · music -22 dB
  (0.0141) · vinheta audio -10 dB.
CRT transitions:
- one TR clip at the IN and one at the OUT of every AE graphic: starts ~0.15–0.3 s before the cut, 0.3–0.95 s long,
  overlapping the cut; blend mode SCREEN (AE graphics stay Normal).
- every TR clip has a glitch SFX ("glitch 2.mp3" or "glitches 1.mp3") on exactly the same span.
- TR numbers vary (01–15) — mix them, avoid the same number twice in a row.
Premiere motion presets (static boxed cards, e.g. G23–G28 = yellow box around a single title):
- applied as TWO Transform effects on the clip:
  - "smooth in": opacity 0→100 and position y 0.5416→0.5 (rises ~45 px) from the clip start over 0.867 s, eased;
  - "smooth out": opacity 100→0 with a small upward move, over the last ~0.2–0.3 s of the clip.
- cards can stack/overlap on V3/V4/V5 (e.g. 3 cards popping in 1 s apart at 2:15–2:18), each with its own SFX.
- each card pop-in gets a woosh ("whoosh-for-whip-zoom") or a positive jingle.
- "smooth zoom in" on interview clips (e.g. the very first clip): Motion Scale 100 → 110 % from the clip start over
  ~1.67 s, position unchanged; Bezier keys, first key out-influence 33 %, last key in-influence 100 % (fast start,
  long soft landing — same feel as the AE eases). Gets a woosh SFX.
SFX vocabulary (what fires on which motion):
- camera moves inside AE comps → "swoosh_low" (517877…), "classic woosh" (small), "light-wooshes",
  "thick woosh" / "low woosh" (+10 dB) for big moves; "deep woosh" (-15 dB) for the outro.
- list items / points appearing → "anime sword hit" (one per item); positive points → "ES Collect Item Digital
  Jingle", "Chime Positive 01/02"; neutral → "UI Motion Retro jingle", "Alert Musical 08/18";
  negative / mistakes → "error.wav", "Collect Item … Fail".
- transitions (CRT) → glitch SFX as above.
- SFX are placed on the exact frame the motion starts (text pop, camera key), trimmed to the motion length.

## Visual identity manual (MIV, "Manual de ID Visual BRASA", 2025) — relevant rules
- Palette: Verde Escuro #03571A, Verde Folha #00863D, Amarelo #FFCC02, Azul Vívido #065FD8, Azul Escuro #1A2B77,
  Laranja #FB8C0A, Verde Vívido #4BBF4B, Amarelo Claro #F5D566, Verde Claro #009F00 (gradients only),
  Cinza Claro #F4F4F4, Preto #252726, Branco #FFFFFF. Gradients only as backgrounds.
- On dark green backgrounds: text only Cinza Claro #F4F4F4; icons only Laranja, Amarelo, Amarelo Claro, Verde Vívido,
  Cinza Claro. "Don't use visual-element colours as text" — OVERRIDDEN by the user for these videos: yellow (#FFCC02)
  Lato highlights and yellow titles are allowed and expected.
- Fonts: Lato (Light/Regular/Bold/Black) primary; Hagrid (Extrabold/Regular) ONLY for titles, never in running text,
  never in long sentences, never tiny or low-contrast. (The MIV's "titles containing BRASA use Lato" exception was
  abolished — "DICA BRASA" stays Hagrid uppercase.)
- Hierarchy: Display/Hero = Hagrid Extrabold UPPERCASE; H1 Lato Bold; H2 Lato Regular; body Lato Regular,
  line-height 1.4–1.5×.
- Logo: never add effects (glow, shadows), distort, recolour or change perspective; keep 1/2-icon clear space.
- Iconography: geometric shapes derived from the logo/flag (rounded rectangles, diamonds, circles, starbursts,
  triangles, chevrons); filled or outlined.

## Project structure
- Premiere project per episode, e.g. `Documents\Projetos\BRASA\BRASA Ensina\<tema>\<tema>\<Nome> BE.prproj`.
  One sequence (1920x1080, ~29.97/59.94), named after the first camera file or the episode.
- Footage: Canon files `T19A57xx.MOV` (talking-head interview), cut into many short clips on V1 (jump cuts every 2–7 s).
- Shared AE project for all motion graphics: `Documents\Projetos\BRASA\BRASA Ensina\Motions.aep` (comps named G0…G39,
  copies like "G1 Copy 4", "g5 copy 2", "g16 copy 3"). Older copies exist (`Downloads\Motions.aep`, `cv Motions.aep`,
  Mac paths from a previous editor `/Users/laissegura/...`). Premiere often holds duplicate project items for the same
  comp pointing at different .aep files — trace the real source by parsing the gzipped .prproj XML
  (VideoClipTrackItem → … → Media/FilePath).
- AE graphics are dynamic-linked into Premiere on V2/V3 above the interview; CRT transition clips
  (`THE MASTER BUNDLE\CRT TRANSITION\NN TR.mp4`, "CRT Transition NN.mp4") sit on V4 at the in/out of each graphic.
- Adjustment layer spanning the whole sequence on V2 (grade).
- Intro/outro: `Vinheta BRASA Ensina.mov` (horizontal) at the end (and sometimes mid-video); vertical version exists.

## Visual identity (AE)
- 1920x1080, 60 fps comps, typically 10 s (simple cards) up to 40–80 s (camera-tour comps).
- Background: solid named "Deep Royal Blue Solid 1" but rendered GREEN: Ramp + Grid + Turbulent Displace effects
  → dark-to-light green gradient with a faint, slightly wobbly white grid. Rotated 90°, scale 75% (2D) or 300–400% (3D).
- Colours: brand yellow `[1, 0.8, 0.01]` (#FFCC03), off-white `[0.95,0.95,0.95]`, white.
- Fonts: **Hagrid Extrabold** for titles/headings/numbers (ALL CAPS, often mixed white + yellow words);
  **Lato Regular** for body; (previously Lato Italic for list items — *user wants no italics on Portuguese text*).
- Title sizes: 104–137 px (often scaled 62–78%); body 47 px in 3D comps (scaled up 70–156%) or 131–137 px in 2D list cards.
- Yellow highlights inside body sentences (single words coloured yellow: "tem", "já fez").
- Icons: yellow flat icons (binoculars, speech bubble, $, globe, medal SVG with Tint) with Glow.
- Existing boxed-title cards (Downloads\Motions G30–G36 style): yellow 16 px rounded rectangle (roundness 60) around a
  single centred Hagrid title — *user wants these left untouched (stay centred)*.
- Glow (ADBE Glo2) on most 3D text and icons; "Transform" (ADBE Geometry2) effect on many body texts.
- Strikethrough = thin "White Solid" scaled on X across a text (e.g. "Passaporte europeu").

## Layout patterns
- 2D list card: Hagrid title at top-left (~x 145–200), numbered list "1. 2. 3." in yellow (separate text layer)
  left of items, items in large Lato (137 px).
- 3D "camera" comps: Null-parented camera dollies between groups of text placed in 3D (z ≈ -340…-2016);
  title on z≈0/-340, body on z≈-1328.
- "Cenários" map: 4 cards (yellow Hagrid number + Lato text) in a 2x2 layout; camera tours card to card.
- "A + B" layout: two text columns with a yellow "+" between.
- Long sentences are split across two text layers (second starts with blank lines) so halves animate separately.

- (Projeto de Pesquisa video) many graphics are CENTRED compositions: centred Hagrid title (white + yellow word)
  over centred Lato body with Glow ("Teste Rápido", "Objetivo Geral", "Dica BRASA" with medal icon on top).
- "Pergunta 1 / 2 / 3" three-column layout (Hagrid "PERGUNTA\nN" yellow + Lato question under each), camera pans
  between full-screen versions of each (G29) then shows all three side by side (G30).
- Funnel ("Funil de temas"): stacked yellow-outlined trapezoids with centred white Hagrid labels; camera tilts down.
- Timeline table: yellow-outlined 2x2 cells ("Ano 1 | Coleta de dados").
- Yellow arrows (← / ↓) pointing at key statements; arrow + Hagrid caption ("CENÁRIO, POLÍTICA PÚBLICA…").
- "Bad example" quotes: italic Lato in quotes, struck through with white solids ("Esse tema é de extrema relevância…").
- Small yellow Lato kicker above a big Hagrid title ("O cronograma:" / "2 TIPOS DE ERRO", "Metodologia bem escrita
  responde" / "PERGUNTAS CONCRETAS", "O antídoto:").
- Numbered lists with yellow Lato numbers + yellow heading + white description (G1 Copy 10), or Hagrid "1." inline.
- Empty "<empty text layer>" leftovers exist in some comps (ignore).

## Animation patterns
- Text in: position slides up ~100–240 px + opacity 0→100 over ~0.42 s; eases out 16.67/in 81–100 influence.
- Titles appear at t=0–0.4 s; body items stagger every ~1–2 s.
- Line/strike wipe: White Solid scale X 0→N over 0.55 s, ease out 49.92 / in 100.
- Camera moves via Null position keys, 0.5–0.7 s, ease 33/100.

## User preferences (from feedback)
- *Every text left-aligned AND justified* (box/paragraph text, FULL_JUSTIFY_LASTLINE_LEFT); body text reflowed so it is
  visibly justified; titles/number lists keep manual breaks.
- *Split sentences*: first half's last line also justified (LASTLINE_FULL) so the paragraph reads as one block.
- *No italics on Portuguese text* (Lato Italic → Lato Regular).
- *Graphics with several text blocks get a visible box*: yellow #FFCC03 4 px rounded outline (roundness 22 px),
  around the CONTENT only (not the title), drawn on with trim paths over 0.55 s (line-wipe ease), same Glow as text.
- *One box per column* in A + B layouts, "+" centred between, boxes same size and top-aligned.
- *Repeated cards must be identical size and snapped to a symmetrical grid* (equal gaps).
- *Body block sits ~120 px under its title* (tight title→content spacing).
- *Boxed single-title cards stay as they are.*
- *Centred compositions get re-laid-out as LEFT blocks*: each stack (kicker + title + body, or each column) shares one
  left edge; the block keeps its centre position on screen.
- *Text inside shapes (funnel tiers, table cells) stays centred.*
- *Struck-through "bad example" quotes keep their italic quote style* (exception to the no-italics rule).

## Hard rules dictated by the user for the skill
- *Hagrid is ONLY for titles and is ALWAYS fully UPPERCASE.* To highlight words outside titles, use Lato in yellow
  (#FFCC03) — never Hagrid inside body text/captions.
- *Every comp uses the 3D camera setup* (Null-parented camera, 3D layers) with different z-depths for background,
  titles, text and other elements to create parallax. No flat 2D comps going forward.

## More user rules (round 3 feedback)
- *Respect safe margins* (~100 px sides / ~80 px top-bottom at 1080p). Prefer backing the camera up (lower zoom)
  and adjusting spacing over letting boxes/titles touch the frame edge.
- *A left-aligned title sits toward the LEFT of the comp* (aligned with the content's left edge, inside margins) —
  never a left-aligned title floating in the middle.
- *"Dica BRASA" title is always centred* (with the medal centred above it).
- *A box can be centred on the frame while its text stays left-aligned inside.*
- *Camera-tour comps*: space sections far enough apart that, when the camera rests on one, the neighbours are not
  visible; keep "PERGUNTA 1" on one line (number on the same line as the word).
- *Bullets start with a capital letter* ("- Quantas entrevistas"); sentences start capitalised ("Sua justificativa").
- *Tables/shapes next to boxes must match the box style* (same 4 px yellow stroke, same corner rounding).
- *Leave enough breathing room between a title and its box* (G33: lower the box rather than crowd the title).

- *Only TEXT is left-aligned / pushed left.* Arrows, icons and other graphics stay centred on their content.
  Exception accepted for "Pergunta" camera-tour cards (G29): centre the title over the box and centre the box content.
- *Text needs generous padding inside boxes* — top/bottom too, not just the sides.
- *Repeated sections must sit at the same height and size* (Pergunta 1/2/3 boxes aligned, identical).
- *Every camera rest must frame the whole section (title + box) inside the margins*; no rest may show a
  neighbouring section; any intro/zoom move must never clip text. Space sections generously ("don't be shy").
- *When a block is "centred", centre the box AND its title on the frame* (G30 bottom block); text inside stays left.
- *Always verify a change actually happened (render it) before reporting it as done.*

- *VERIFY ON CAMERA, ACROSS THE WHOLE TIMELINE*: render every comp every ~1 s over its full used range (openings,
  camera moves, every rest, the end) — not just one "settled" frame. Most mistakes hid in frames never checked
  (G6 opening, crossfade second lines, numbers still animating).
- *Continuity between adjacent comps*: when a comp opens on the content another comp ends on (G11 → G6 Fulbright
  card), the opening must match that comp's final frame exactly (same layout, box, positions).
- Reference layout approved by the user (G11 "bolsas"): Hagrid title + small subtitle pushed to the LEFT with a shared
  left edge, the content box CENTRED on the frame below them, everything fully on camera.

- *ALIGNMENT RULE (final)*: left-aligned elements must be positioned toward the left. A section of title (+ subtitle)
  + a SINGLE box is centred as a whole: title/subtitle centre-justified and centred on frame, box centred on frame,
  only the text inside the box left-aligned/justified at the box's left padding.

## Layout numbers that worked (approved/settled during edits)
- Box padding 56 px horizontal / 44 px vertical (screen px at 1080p); 30–40 px for rows of 3 cards.
- Title → box gap: 80 px for big Hagrid titles, 60 px for small kickers/headings, 40 px when the camera framing is tight.
  Never push a title closer than 40 px to the frame top.
- Rows of cards: equal-size boxes, 30–40 px gaps, row centred on the frame.
- Justified narrow columns (≤ ~300 px) produce wide word gaps — acceptable per user, but keep columns as wide as the
  layout allows.

## Patterns seen in "2-carta motivação" (user's own, best-organised project)
- Letter-example graphics: small yellow Lato kicker "Carta Original | Abertura" / "Carta Revisada | Abertura" over
  Lato 39 px body in a box; ORIGINAL vs REVISED versions alternate through the video (Abertura, Apresentação,
  Motivação, Fechamento), each followed by a "DICA BRASA" medal card.
- Progressive paragraph reveal = several duplicated text layers crossfading (0.35 s opacity + 65 px rise), each with
  the FULL paragraph but the not-yet-revealed part set to no fill. All versions must keep IDENTICAL text and box
  width, or wrapping/justification shifts between versions.
- Highlight of a phrase = a red/orange solid ("red highlight") behind the words in a close-up comp (G4).
- "CARTA COMPLETA": the whole letter scrolls vertically under a fixed title, then the camera pulls back to show it all.
- Checklist finale: 4 numbered question cards on a 2x2 grid, camera tours card by card, then pulls back to all four.
- Strike-and-replace: struck-through italic wrong term, correct term appears below (G1 "Demonstrar Interesse" →
  "Comprovar Mérito").

## Patterns seen in "bolsas mestrado eua"
- Scholarship cards: Hagrid yellow name ("KNIGHT-HENNESSY SCHOLAR", "ROTARY PEACE FELLOWSHIPS"), small Lato subtitle
  (university / degree), then facts appearing one by one (coverage $, audience, what it pays).
- Premiere clip names can drift from AE comp names (user renamed items "G6u", and "G7u" actually links comp G4):
  identify the real comp by decoding the dynamic-link Media ImporterPrefs (base64 UTF-16 comp GUID = comp
  dynamicLinkGUID), never by the clip name.
- Lists: yellow "1." "2." numbers are a separate layer — keep items to the RIGHT of the numbers when re-aligning.

## "paises baratos" — audit of comps NOT built to the conventions (2026-10-12)
Comps made by another Claude without this training (G44–G48 "(Claude)") deviate in ways the skill must prevent:
- Background: a flat "BG Grid" solid (Ramp + Grid) as a 2D layer — missing the house BG (Ramp + Grid + Turbulent
  Displace, rotated 90°, 3D, scaled 300–400 %) and its slight wobble.
- Camera: camera NOT parented to a Null; camera keyed directly; zoom default; all layers on z=0 → no parallax.
- Layout: everything crammed into the top-left 60 % of the frame, huge empty bottom; tiny type (34–58 px Hagrid in
  pills, 40 px italic captions, ~20 px source credits) — unreadable on a phone.
- Design vocabulary not ours: filled dark-green "pill" chips with Hagrid labels, filled yellow highlight pills, a
  wireframe globe with pins, a right-bracket "sum" symbol. House style = yellow OUTLINE boxes (4 px, 22 px radius),
  Lato content, Hagrid only for UPPERCASE titles.
- Lato Italic used for captions/subtitles (no italics rule), mixed-case Hagrid ("Pádua", "Universitaly", "Como o processo
  funciona:"), source credits ("Fonte: …") burned into the graphics.
- Every comp starts with 1–2 s of empty frame before anything appears.
Hand-made comps in the same project also had: mixed-case Hagrid titles, Lato Italic list items, text running off-frame
(G39 "Valores variando entre…", G37 Brown timeline pushed off the left edge), green-coloured boxed cards (G31–G38)
instead of the yellow card style, flat 2D comps without the camera rig (G20/G24/G25/G26/G41 partially).

- *User likes the Claude-comp "pill" look* (filled dark-green rounded chip, 3–4 px yellow stroke, UPPERCASE Hagrid
  label; filled-yellow pill with dark-green text for the key highlight) — allowed as a house element, but built in our
  system: 3D + camera rig, readable sizes, margins, our eases. No source credits on screen.
  The user also likes the Claude comps' other elements (wireframe globe with country pins, card stacks, pill lists,
  bracket "sum") — KEEP those styles; only adapt them to the house BG + Null/camera rig + depth, readable scale and
  margins. Adapt, don't rebuild, when the user likes a comp's look.
- *STYLE EVOLUTION (user, 2026-10-12)*: the G44–G48 look is an evolution of the house style and belongs in the skill:
  pill chips (dark-green fill + yellow stroke + UPPERCASE Hagrid label), filled-yellow highlight pill for the key
  item, stacked pill lists that build bottom-up into "slots", big yellow value callouts (€0, R$ 0, US$ 600–900/mês)
  next to their pill with a small Lato caption under, two-column comparisons divided by a thin yellow rule
  (FRANÇA | POLÔNIA), a bracket "sum" leading to a result ("= CUSTO REAL"), a wireframe globe with country pins,
  a closing "statement" frame (big two-line Hagrid, second line yellow + Lato sentence). All of it inside the house
  BG + Null/camera rig + depth, readable sizes and margins.

## Tooling notes
- Measure text bounds INCLUDING Transform-effect (ADBE Geometry2) offsets — many layers are shifted by it.
- Soft returns () must become paragraph breaks before full justification, or lines get stretched.
- Tall scrolling content (letters) must not be margin-fitted by zooming — exclude it.

- Margin fit: lowering camera Zoom scales every 3D layer's screen offset from the frame centre uniformly
  (scripts\fitcam.jsx); 2D layers in the same comp must be scaled about the centre by the same factor. Only count
  layers that are mostly on screen, or camera-tour comps zoom out to fit off-screen sections.
- NEVER render through the Render Queue from a script — it crashed AE and lost unsaved work. If saveFrameToPng
  stalls, wait/retry it. Save the project after each verified batch of changes (backup first).
- Scripted Edit>Undo (executeCommand 16) is unreliable; restore damaged comps by copying layers from a backup .aep.
- Split sentences across layers: the continuation layer is NOT a sentence start (keep lowercase), and its leading-space
  padding must be re-measured after any font change; nudge position for sub-space precision.
- Arrow/icon PNGs have off-centre canvases: centre/space them by rendered pixels, not layer bounds.
- Capitalising a word can push a justified line into a wrap: re-check box widths after text edits.
- Premiere duplicates: trace timeline clip → .aep via the gzipped .prproj (scratchpad trace_pp.py).
- Box measurement must handle members on different 3D planes / 2D layers inside 3D comps (project to one plane
  in screen space at the settled camera view). Icon PNGs often have padded canvases — don't use their bounds.
- AE MCP bridge: `Documents\ae-mcp-bridge\` (runScriptFile added to mcp-bridge-auto.jsx; run.sh writes ae_command.json).
  Scripts: inspect.jsx, frames.jsx (saveFrameToPng), lib_textbox.jsx (SPEC table per comp), snap_g16.jsx.
- Premiere MCP: the "readOnly" flag in verify_premiere_connection only describes that check. Timelines can be built by generating an FCP7 XML (scripts/make_xml.py) and calling import_fcp_xml — Premiere creates a new sequence, clips link to the existing media.

### paises baratos — hand-made comps pass (2026-10-12, DONE)
All 10 hand-made comps fixed, verified across their timelines, saved: G20, G23, G24, G25, G26, G37, G39, G40, G41, G43.
Rules / patterns confirmed or learned:
- Hagrid->Lato: acronyms/codes keep typed case (B2, EUA, DSU, $25); words that are proper names (e.g. "Common Data Set") use the keep-case variant.
- Highlight phrases built as separate layers (e.g. "taxa" + "de €140 a €160") are placed inline: one space after the sentence, BASELINES matched (layer origin), same scale as the sentence.
- When a camera move leaves the previous section's elements visible at the new rest, fade them out over the move (0.4–0.6 s) — also used for titles that would peek in at the frame edge.
- Lists whose numbers were a separate layer on another depth plane: merge the numbers into each item line (yellow "1. ") — consistent with G24/G43.
- Icon columns (G26) become house cards: one uniform yellow box per column, icon inside (top padding), columns spread so cards have a visible gap, then camera fit.
- Timeline columns (G37): uniform cards sized to the rest-1 content; the card that gains content later GROWS (rect size + position keys, top fixed) right before the new lines arrive; boxes that belong to a sliding column get the same slide keys.
- A decorative shape on a different depth plane than the text it frames can't line up at two camera rests -> replace it with a house box around the text (G40 search pill).
- Tables (G41): de-italicise in place; if upright text overflows a cell, shrink ~10% and centre in the column.
- Kicker labels (top-left Lato 54 yellow, G39–G43) stay put; content stacks align their text edge to the kicker.
Tool fixes (lib_textbox.jsx and friends):
- Transform effect (ADBE Geometry2) offsets on text/shape layers land in comp PIXELS (continuously rasterized), not scaled layer space -> sampleBounds fixed.
- ExtendScript mis-evaluates chained ternaries like `a !== undefined ? x : b === c ? y : z` -> always use if/else.
- `"text" + errorObject` can itself throw in ExtendScript; reading combined Position on separated-dimension layers throws.
- New: inline, grow, boxCenter, boxPad in uniform boxes, centerX px/like, latoKeepCase; fitcam keyFrom+holdTo (re-runnable); centercam.jsx, fadeout.jsx, prefixnum.jsx, deitalic.jsx, shots.sh/sheet.py.

## PIPELINE TEST RUN — paises baratos (2026-10-12), step 1 (rough cut)
Tools/process that worked (to become the skill's step 1):
1. Script PDF -> text (pypdf) -> numbered narration lines (pb_lines.json), one per sentence/clause, grouped by BLOCO.
2. Transcribe EVERY raw file with faster-whisper large-v3 on the GPU (Python 3.12 + nvidia-cublas/cudnn wheels; feed a 16 kHz numpy array, not a path — the bundled PyAV breaks). word_timestamps=True, vad_filter=True, condition_on_previous_text=False (otherwise long retake loops hallucinate repeated lines / "**").
   The user's own transcript.json covered only the first file — always transcribe all footage.
3. Identify which files belong to the episode by content (5749/5750 were another video recorded the same day).
4. Align each transcript segment to the script lines (difflib over normalised words) -> list of candidate takes per line.
5. Pick per line the LAST complete take that is spoken to camera. On-camera check = contact sheets of face/torso crops (3 frames per candidate + a 6 s posture scan per file): practice/reading = leaning toward the computer, head low in frame, eyes down.
   Also reject takes with long internal pauses (ffmpeg silencedetect) or drawn-out/odd delivery, and takes with distracting gestures mid-line (hands in hair).
6. Cut points from word timings: ~0.1 s before the first word, ~0.15 s after the last; split a take to remove an internal pause > ~0.5 s.
7. VERIFY: assemble the cut's audio with ffmpeg, re-transcribe it and read it against the script per clip (catches clipped words, leftover stumbles, duplicated phrases).
8. Write FCP7 XML -> import_fcp_xml -> new sequence "<ep> - CORTE v1" (never touch the user's raw sequence) -> check_offline_media -> set active.
9. Leave the vinheta/music to the user (CHECKPOINT 1) and hand over a notes file listing each line's source + the weakest choices.

### USER CORRECTIONS to the v1 rough cut (2026-10-12) — HARD RULES for step 1
The user re-edited ~half of my clips. Measured differences (scripts/pp_seq.py reads a sequence from the .prproj/autosave; scripts/edges.py measures speech edges):
- **Real take vs practice = LOUDNESS first.** Real (projected) takes measured mean ≈ -18.5 dB, peaks ≈ 0 dB; the practice/half-voice takes I wrongly chose were -21…-25 dB mean, peaks -4…-8 dB. Compute ffmpeg volumedetect for EVERY candidate; discard anything > ~2 dB quieter than the loudest takes of that line. Then: voice confidence, looking at the camera, full sentence delivered.
- **A take that starts well but fails halfway is not a take.** Look a few seconds around the candidate: there is usually a later, complete, louder version (L3, L17, L20, L28, L30, L38, L43 all had better later takes). "Best available" is almost never the first attempt — prefer the last complete loud take.
- **Whisper word timings are NOT cut points.** They drift 0.3–1 s on drawn-out words and swallow pauses (L26 "gratuito…garantia" spans were wrong; the real line was 32.1–38.2). Always snap cuts to the audio energy envelope.
- **Cut tight:** IN exactly at voice onset (0–0.05 s before); OUT 0.10–0.25 s after the last voiced sound (never cut the end of a word). Remove breaths/silences inside a line by splitting it (user split L7 into 4 pieces and L31 into 2 to drop breaths/pauses).
- Drop throat-clearing lead-ins ("Agora,", "Ok,") when the line works without them.
- User also kept extra natural lines that strengthen the script (L20 "França não é só Paris…", L31 full combination line).

## PIPELINE TEST RUN — step 2 (motion graphics), paises baratos 2026-10-12
- Beat map: transcribe the USER's final cut audio (assembled from the .prproj clip list with ffmpeg adelay/amix, scripts/pp_seq.py + findw.py) -> word times on the sequence timeline.
- Existing comps are retimed to the cut with scripts/retime.jsx: every keyframe moves rigidly with its beat group (region = up to 1 s before the beat), eases/interp kept, BG untouched; comp duration = until the next graphic. Then re-check margins (fitcam with keyFrom/holdTo per rest).
- New graphics = duplicate an approved comp of the same family (G46 layout: title + caption + 3 pill/value/caption rows + 2-line statement) with scripts/make_variant.jsx: new texts (written as ASCII \u escapes — never raw UTF-8 in .jsx), each layer shifted to its spoken cue, camera keys remapped. Layers can be re-ordered in time per layer (not tied to the template's order).
- Every comp must open with content within ~0.3 s (no empty first second). Left-aligned titles share the pills/caption left edge. Values must stay inside the right margin (shorten captions, place the value right after its small prefix).
- Statement frames get centred/fitted per rest (centercam x + fitcam).
- Deliverable at checkpoint 2: comp list with in/out on the user's sequence (+ markers when the Premiere bridge is up).

## PIPELINE TEST RUN — step 3 (SFX + transitions), paises baratos 2026-10-13
Asset locations (user's machine):
- SFX: `Documents\Assets Gerais\Sound Effects\` — Woosh\{movement woosh, transition woosh}, Positive jingles, Neutral, Negative bleeps&bloops, glitches, hit & impact, riser, subwoofer (pair with wooshes, peaks synced), drone.
- CRT transitions: `Documents\Assets Gerais\THE MASTER BUNDLE\THE MASTER BUNDLE\CRT TRANSITION\NN TR.mp4` (01–05 = 0.40 s, 06–10 = 0.72 s, 11–15 = 0.96 s); the bundle also has GLITCH, VHS, FILM BURN, LIGHT LEAKS, PAPER RIP, WIPE & BRIGHT.
Premiere MCP (it CAN edit; "readOnly" in verify is just the check):
- import_media(binName "sfx"/"transicoes"), add_to_timeline / add_to_timeline_batch (sourceIn/Out trims, linkAudio false for overlays), adjust_audio_levels (dB; -10 → 0.0562 linear), set_blend_mode {clipId, blendMode: 22} = SCREEN (18 = Normal; verified by exporting frames), add_keyframe (Motion/Scale, clip-relative time), export_frame for visual checks, save_project.
- add_track(audio, "below") inserts at the TOP (pushes voice down) — use position "above" for audio (appends at the end); delete_track to undo.
Event extraction: every keyed layer's first key + Null camera moves + Source-Text key changes from each comp (scripts/_events.jsx), offset by the clip start on the sequence (minus source in).
Mapping used: CRT TR at every graphic in/out/between (start = cut − 40 % of its length, Screen) + glitch SFX on the same span (alternate glitch 2 / glitches 1); big camera moves = low woosh (+10 dB, peak at move middle) or swoosh_low; titles = whip-zoom woosh; pills/items = anime sword hit; good values = Collect Item jingle / Musical 18 / synth major chord; neutral values = Chime Positive 01 / Musical 08; bad values = Collect Item Fail / error.wav; value text swaps = UI click; first clip = smooth zoom (Scale 100→110 over 1.67 s) + whip woosh. SFX on A4–A6 (greedy stacking), all -10 dB except low woosh +10 dB.
Align wooshes by their measured energy PEAK (not file start); trim jingles to ~0.8–1.6 s.

## !!! FUNDAMENTAL RULES — user review of paises baratos v1 graphics (2026-10-13). NEVER make the user repeat these !!!
1. **A-roll / graphics balance.** The host must stay on screen most of the time. Graphics only for information that really needs one. Long multi-section comps are SPLIT into separate graphics with host screen time between them (G46 should be "pricing" | host | "mensalidade zero…" statement; G51 "custos escondidos" | host | "planilha").
2. **Minor details don't get graphic time.** Small facts (e.g. "taxa administrativa €150–350") are dropped if they cost host screen time. If the TERM is important → a G0-style static card (yellow box around a Hagrid UPPERCASE term, transparent BG) over the host, animated in Premiere with the **smooth in / smooth out PRESETS**. If only a line needs emphasis → the **smooth zoom in PRESET** on the host clip, no text at all.
3. **Use the Premiere presets, never hand-made keyframes** for smooth in/out/zoom (the preset guarantees the house curve).
4. **NO HARD CUTS INSIDE GRAPHICS.** Every element that appears, changes or leaves is ANIMATED. Never swap Source Text with hold keys (e.g. "SIMBÓLICA" → "€178", "US$ 600" → "US$ 600–900", "pro visto…" → "Sperrkonto…" were red flags). A changed value = animate the old one out and the new one in (or a separate layer that animates in).
5. **SFX ON EVERY ANIMATION / MOVEMENT — no exceptions**, captions and subtitles included (e.g. "provavelmente a sua porta de entrada" had none).
6. **Left-aligned = positioned toward the LEFT** (repeated rule, violated again in G47). For a section with a one-line title: build the block left-aligned but position it so it LOOKS centred; when the layout changes (e.g. a second column arrives), animate each element's position keys so they become left-positioned — never leave left-aligned text floating mid-frame.
7. **Every label correctly capitalised** ("Custo de vida", not "custo de vida").
8. **Animation timing = house pattern** (~0.35–0.5 s moves/fades, 16.67/81–100 eases). No slow 1–2 s fades/drifts.
9. **Statement order must make sense:** the full title (both lines) first, then the supporting sentence/graphic — never title line 1 → sentence → title line 2.
10. **Prefer a designed graphic over raw text** when the content has a natural shape: a spreadsheet = a box/table graphic (like the planilha/table graphics in earlier videos), not a paragraph. Raw text where a graphic fits is a mediocre choice.

### How the paises baratos graphics were reworked after the review (template for the skill)
- Plan the whole video as HOST vs GRAPHIC beats first (table of seq ranges). Rough target: the host on screen most of the time; a graphic only while its key info is being said; minor details → host (+ zoom preset) or a G0 card.
- One comp per idea (pricing | statement | coverage | spreadsheet); a comp that builds over a long stretch can appear in several short visits (same comp, Premiere source ranges) with host in between — each visit must start just before a NEW element animates in.
- Tools: scripts/make_variant.jsx (duplicate/edit in place: texts, per-layer starts, hide/show, camera key map), swapanim.jsx (animated value swaps), centerphase.jsx (centred-looking one-column phase → animate to left columns), fixslow.jsx (restore ~0.45 s timing on stretched keys), build_table.jsx (spreadsheet table: box draw-on, row wipes, staggered cells, filled TOTAL row), make_card.jsx (G0 cards: box group scale X = (text width + 320)/2262.5).
- AE comp import into Premiere and the smooth in/out/zoom PRESETS are applied by the user (no MCP tool); I place everything else and mark preset spots.
- Retime pitfall: a beat boundary between an animation's two keys stretches it — always run fixslow after retime.

### Step 3 v2 placement — automated end to end (2026-10-13)
- Planner `scripts/plan_v2.py`. Inputs:
  - Segment table (comp, seqIn, seqOut, srcIn) + cards + zoom spots.
  - Comp events dumped by `_events2.jsx` → `events2.json` (first visible time per layer; disabled layers skipped).
- Outputs:
  - `pb_v2_vbatch.json`: V3 graphics + V4 CRT TRs.
  - `pb_v2_abatch.json`: SFX on A4–A6, greedy track packing, overlaps trimmed.
- SFX mapping by layer category:
  - Box/Peça/Slot → hit.
  - Value texts → positive / neutral / negative jingle.
  - Big titles → whip.
  - Captions → short swish.
  - Table rows → hit; TOTAL → chord.
  - Camera Null moves → low woosh, peak aligned.
  - Cards → whip in, swish out.
  - Zoom-preset spots → whip.
  - TRs → glitch, alternating.
- Dedupe rules:
  - Within 0.15 s keep the more specific sound.
  - **The same sound repeated within 0.35 s collapses to one.** Staggered title cascades (G45 countries every 0.16 s) would otherwise stack 5 whips.
- Premiere facts:
  - `execute_extendscript` exists (wrap the code in an IIFE that returns a string). Use it for bulk ops instead of 185 single calls.
  - Volume = component "Internal Volume Stereo" props[1] (linear: 0 dB = 0.17783, −10 dB = 0.05623, +10 dB = 0.56234).
  - Blend = "AE.ADBE Opacity" props[1], Screen = 22.
  - Markers: `seq.markers.createMarker(t)`, then `.name/.comments/.setColorByIndex`. I mark every spot where the user must apply a preset (Smooth Zoom In = V1 clip, Smooth In/Out Text = G0 cards).
  - export_frame fails with "Illegal Parameter type" when the output folder doesn't exist. Create it first.
  - Premiere keeps the cached dynamic-link render after an AE save. Verify AE fixes in AE (`shots.sh`), not with export_frame.
- **G0 cards are 3840x2160 comps (everything else is 1920x1080).** In the 1080 sequence they must be set to Motion Scale 50 (do it with execute_extendscript right after placing). At 100% the text looked oversized and ran off both edges. Don't "fix" this by shrinking the font: the G0 font size is 170. Before placing any comp, check its width against the sequence.
- Spreadsheet table: cell text baseline must be about row centre + 0 (not +16). Rows looked bottom-heavy, so the cells were raised 19 px.
- **SFX must never be cut inside their audible tail.** The anime sword hit (3.0 s file) was trimmed to 0.5–0.6 s and sounded chopped (it is still at −37 dB at 0.5 s and only drops under −60 dB after ~1.4 s). The user extended the hits by hand in "paises baratos" (1.2–3.0 s). Rule: sword hit = full 3.0 s (never < 1.5 s), and every trim lands where the tail is under ~−60 dB. If the tracks are busy, open A7+ instead of shortening. plan_v2.py was updated (HIT/ROW len 3.0, overflow opens a new track).
- **Generalised (user, 2026-10-13): EVERY SFX must play to its end, or until it's inaudible. This is not only the sword hit.** I measured the whole library (sfx_tails.py → skill references/sfx-lengths.tsv). For multi-sound files I use the end of the first sound. plan_v2.py now sets every length from the `TAIL` dict, and the old fixed trims (whip 0.8, fail 1.3, chord 1.5…) are gone.
- Exception (user, same day): glitches under CRT transitions stay cut to the TR length. They are the only SFX allowed to be trimmed.
- **SFX family by graphic type (user, 2026-10-13):** full AE motion graphics get videogame-like SFX (retro game motion jingle with rotated variations, video-game UI clicks, Collect Item/Chime/Fail). The anime sword hit is reserved for static text animated in Premiere (G0 cards). plan_v2.py: HIT→RETRO, ROW→CLICK, card in→sword.
- **Wooshes = camera movement only (user, 2026-10-13).** Graphics/text movement gets videogame sounds and jingles (retro game motion jingle, UI clicks, Musical 18 for titles, value jingles). Each camera move or Smooth Zoom In gets ONE long woosh sized to the move. Never chain 3 short whips to fill a 1.67 s zoom. Zoom → synth woosh / throw-woosh (front-loaded). Null move ≥1.2 s → low woosh; 0.5–1.2 s → car pass woosh. A move's woosh suppresses other wooshes inside its loud body. Note: the whip-zoom file peaks at 1.75 s, so the old 0.8 s cut removed the whip itself.
- **Graphic length (user, 2026-10-13): graphics are usually 10-30 s each (slight variation OK).** Split only past ~30 s; no 1-3 s AE pops (use G0/zoom).
- **bolsas eua graphics pass (2026-10-13):** common faults in user-built comps: italic kickers/cells, Hagrid inside sentences (→ yellow Lato Bold inline layers, re-flowed with a ~22 px gap), mixed-case Hagrid values, sections never faded before a camera dolly (→ fly-through), margins after camera moves, dark logos invisible on green (→ equal light tiles with names, 4+3 centred grid), logos popping late vs the spoken name (retime to the word).
- **G0 cards (user, 2026-10-13):** always yellow (box + text), usually on screen < 10 s, and each one gets a positive jingle in Premiere (plus the sword hit).
- **Alignment miss (user, 2026-10-13):** I fixed fonts/margins/moves but left centred multi-line body paragraphs; the user caught it. Every comp gets the alignment pass (justified box text, left-positioned, one shared left edge per group). Also: a hidden duplicate AfterFX process held the bridge, so my edits were invisible in the user's window. Check that the bridge answers from the window the user sees before editing.
- **Meta-rule (user, 2026-10-13): every piece of feedback is written into the skill + this log in the same turn; reply names the files updated.**
- **Import list clarity (user, 2026-10-13):** "I only see one G39m". Multi-visit comps must be listed once, with their visits, and the note "import once, place N times". Never show them as separate rows that look like separate comps.
- **bolsas eua step 3 (2026-10-13):** the user had removed the old graphics from the timeline, so I placed the imported comps myself, keeping the user's track layout (graphics V2, vinheta V3, TRs V4). New planner template: scripts/plan_bolsas.py. Gotchas: mono SFX = "Internal Volume Mono"; a batch can report "bridge not running" yet succeed, so count clips before retrying; the camera-move filter must only skip exits/slides, not titles/values that appear during the move.
- **Smooth Zoom In woosh (user, 2026-10-13):** synth woosh is the one woosh NOT to use for zooms; use ONLY deep woosh.wav (peak 0.55 s, start 0.45 s before the zoom). Changed in Premiere (5 zooms) and in plan_bolsas.py / plan_v2.py.
- **Channel volume mistake (user, 2026-10-13):** a loose /Volume/ match also set Channel Volume Left to -10 dB on the deep wooshes. Undone (Left = Right = 0 dB). Rule: set only Internal Volume Stereo/Mono Level by exact matchName; never touch Channel Volume.
- **Entrance rise (user, 2026-10-13):** AE smooth-in animations started far too low (100–350 px on screen). Rule: rise ≤ ~50 px on screen, final position unchanged. rise.jsx applied to all bolsas comps (40 layers).
- **Entrance speed (user, 2026-10-13):** speed up slow entrances by bringing the second key closer to the first, "only when it makes sense": > 0.5 s -> 0.4 s; skip quick, camera-paced or chained ones. speedin.jsx: 14 entrances sped up (G37, G38m).
- **Deep woosh timing (user, 2026-10-13):** the zoom woosh starts EXACTLY at the start of the V1 clip with Smooth Zoom In (no -0.45 s peak offset). Not changed in bolsas (user fixes it by hand); planners and skill updated. ZOOMS must be the zoomed clip start times.
- **entrevista graphics pass (2026-10-13):** same recipe as bolsas (kicker -> Hagrid title + centred yellow box, rise/speed passes, step cards with identical boxes). Self-caught: G1 paired an example with the wrong point ("Oxford & Cambridge" under "presencial no Brasil"; the speech says Campus France). Always check graphic CONTENT against the transcript, not only timing. Transcription crashed silently on GPU; CPU fallback worked.
- **Relink after folder rename (2026-10-13, entrevista):** replaced 12 offline comp clips with the re-imported items at identical times and source ranges.
- **entrevista step 3 (2026-10-13):** plan_entrevista.py (from plan_bolsas). 24 TRs on V3 (Screen), 78 SFX on A4-A6, 5 Smooth Zoom In markers with deep woosh at the exact clip starts, graphics ~34% of runtime. Lesson: the camera-move filter must not swallow elements that APPEAR mid-move (G2 step cards).
- **Deep woosh level (user, 2026-10-13):** deep woosh (Smooth Zoom In) at -15 dB (linear 0.031623), not -10. Applied to the 5 in entrevista.
- **entrevista 2nd half (2026-10-13):** user said the second half (from 3:30) felt empty. Added G0.2 card (5 PERGUNTAS POR CATEGORIA), G7 (PASSO 3 -> COMO TREINAR), G8 (NO DIA DA ENTREVISTA), G9 (RESUMINDO) by duplicating G5 (step card + title + box list) and retiming items to the transcript. Toolkit fix: ops.jsx box op resolved "after" AFTER creating the layer, so failures left empty orphan shape layers with the box name; now it resolves first, and _rmempty_shapes.jsx cleans old orphans.
- **entrevista 2nd-half placement (2026-10-13):** placed G0.2/G7/G8/G9 on V2; 4 TRs on V3 (Screen); 21 SFX (card: sword + positive jingle + out click; titles Musical 18; items clicks; 1 camera woosh in G7). The card replaces the 218.167 Smooth Zoom In (deep woosh + marker removed). Card scale 50 + PRESET Smooth In/Out Text marker.
- **Alternate graphics/host (user, 2026-10-13):** I had filled 218-270 s with solid graphics. User: keep a balance, and cut between graphics and explanations: show each point while it is stated, go back to the host while she expands. Restructured G7/G8 into 5 visits (point on screen, explanation on host); graphics 44% of runtime. Rule written into SKILL.md + graphics-style.md.
- **Italics (user, 2026-10-13):** italics ONLY on non-Portuguese terms (foreign words/names); Portuguese never italic, bad-example quotes included. Replaces the old "no italics except bad-example quotes" rule.
- **CV Forte (2026-10-13):** semi-done episode with 1 graphic in 6.5 min. Planned 15 graphics from the transcript (visits = point stated; host while she expands). New build_list.py builder; fixed G18 (Portuguese italics, inline gaps, margins via fitcam). Shared Downloads/Motions.aep mixes episodes (carta, projeto de pesquisa, CV): identify the episode comps by content first.
- **CV Forte step 3 (2026-10-13):** plan_cv.py; 19 new placements + 26 TRs on V3 (vinheta edge skipped) + 116 SFX on new A4-A5 (A3 left free for music); replaced the old G18 SFX on A2 (sword on an AE comp, wooshes on text) to follow the rules; 7 Smooth Zoom In markers + 6 card markers. G17 project item is offline (stale dynamic link) and needs a re-import.
- **G0 card SFX (user, 2026-10-13):** a G0 card gets ONE SFX only: the anime sword hit (Fail jingle if the card is a negative point). Replaces "sword + positive jingle + out click". Planners patched (NEGCARDS list).
- **G0 card out SFX (user, 2026-10-13):** the Smooth Out Up preset is anchored to the clip END (last 0.317 s), so the out click goes at end - 0.317 (it only looked like start + 2.583 because those clips were 2.9 s long, user correction). Correction of my previous note: "one SFX" applies to the IN (sword, or Fail for negative); the out keeps its own click. CV: out clicks now at end - 0.317 on all cards, card lengths kept as spoken.

- **Correction (user, 2026-10-13):** the Smooth Out preset is tied to the clip end, not to a fixed time; I wrongly trimmed 3 cards to 2.9 s, then restored them (4.4/6.2/5.3 s), moved their out keys to the last 0.317 s and their out clicks to end - 0.317.
- **Real document on screen (user, 2026-10-13, CV Forte CV12):** "change the CV12 clips for something more interactive that shows the CV itself, in our style". Built "CV12 cv da Ana": the real CV page (PDF → PNG) as a 3D page, with a camera tour, a spotlight, boxed sections with numbered tabs, highlighter marks, a pulled-out "A FÓRMULA" card (VERBO/TAREFA/FERRAMENTA/RESULTADO) and a struck "Proficiente em pacote Office" quote. Rule in graphics-style.md; tool cvpage.jsx.
- **Keyframe curves are right-skewed (user, 2026-10-13):** "you inversed the shape of the keyframe curve, dont do that, stick to the right skewed shape we use". The user hand-fixed the CV12 Null: move-start keys out 5-27, arrival keys in 100. Cause: the ease helpers alternated influence by key index, so after a camera hold the move-start key got out=100. Fixed the helpers (in=high/out=low on every key), added fixskew.jsx and fixed 11 inverted segments in CV12 cv da Ana (box fade-outs, spotlight mask and opacity). Scanned the other CV Forte comps: clean. The rule is now in SKILL.md rule 8, graphics-style.md and graphics-build.md.
- **Itália (2026-10-13):** a merge of Motions.aep blocked the bridge on an AE dialog (the user dismissed it). Note added to tooling.md. G20 template Null started at 0.88 s, which broke build_list's probe; _dupcomp now zeroes the in-points. SFX level: the user confirmed −10 dB (the reviewer Lorenzo had suggested −4 to −8). Zoom presets applied mid-clip: deep woosh at the first zoom key.
- **Onde aplicar rough cut (2026-10-13):** the user supplied a Premiere transcript of a STRINGOUT sequence (all raw files back to back). I used it directly: stringout time maps to the file plus offset via the sequence clip starts, so there was no need to re-transcribe the 12 files. A missing Drive part (zip 002) held the whole Américas block; check every script block has takes before cutting. Tool: scripts/cut_oa.py (spans → energy-snapped cuts + loudness check), make_xml_oa.py.
- **Rough-cut feedback (user, Onde aplicar):** I often cut clips too short. The user extended them to recover whole sentences, including sentences I had split because the next clip covered the rest. Rule: keep sentences whole in one clip, never stitch from fragments. Also: put SFX on existing audio tracks with free space (e.g. the track above the music with only the vinheta) instead of always adding tracks. Rules added to SKILL.md, rough-cut.md and sfx-transitions.md.
- **Onde aplicar step 3 (2026-10-13):** first full pipeline episode. Graphics go on V4 (V2 holds the adjustment layer, V3 the vinheta) and CRT TRs on a new V5. SFX use existing tracks first (A4, A2 outside the vinheta), adding A5 only where needed, per the user rule. The SFX/TR files were not in the project yet, so I imported them into an "sfx e transicoes" bin. No camera moves in list comps → no wooshes there; Smooth Zoom In markers + deep wooshes at 8 host emphasis points. Planner: scripts/plan_oa.py.
- **Main points get game jingles (user, Onde aplicar):** "these clicking sfx are nice but they get lost. Use them for smaller pieces of info or out animations, but for main points, like in OA2, more of the video game sfx." Rule: list items, pills and columns → Retro game-jingle variations; clicks only for sub-lines, recaps, small info and out animations. Added to SKILL.md and sfx-transitions.md.
- **Boring motions (user, Onde aplicar):** "no 3d camera movement, no glow on the text". Then on my first camera pass: "i dont like these movements where you zoom in slowly... stick to the style I made: the camera movement is used to reveal something new or move into a new topic. A quick push in is nice, but small and quick, not long and big." Rules + house glow values added to graphics-style.md. The glow default Glow Colors = A&B gave black halos; set Original Colors.
- **"Still super boring + not watching margins" (user, Onde aplicar):** the user opened paises baratos as the motion reference ("exemplary and truly beautiful"). I studied G2–G43 (keyframe dump + frames). The motion-language section is now in graphics-style.md: spatial layout with camera travel per topic, big title then fast reveal, real z depth, 3D entrances, in-scene motion (sliding rows, resizing boxes), a living BG (Turbulent Displace evolution), glow, margins at every rest. User caveat: do NOT let this override the justified/left-aligned text rules; weigh both for a pleasing composition.
- **Revamp feedback (user, Onde aplicar):** "g0 graphics do NOT have glow, and the glow is supposed to be a slight detail"; "take off that turbulent displace from all comps"; "hurry up" (work faster: batch, fewer verification loops). Built build_scene.py (stack/cards + camera travel). Found the auto-bezier spatial drift on camera null holds (fixed in ops nullkeys).
- **Skill consistency (2026-10-13, resumed session):** graphics-style.md Visual identity still listed Turbulent Displace and generic glow. Fixed to match the revamp feedback; added the "Work fast" section to SKILL.md.
- **Positioning + margins (user, 2026-10-13, Onde aplicar OA1, "mentioned it several times"):** text inside OA1's boxes looked randomly placed and the boxes touched the frame edge. Causes in build_scene.py cards: labels aligned by glyph bbox (accents pushed ÁSIA/AMÉRICAS 11 px down), short labels pinned left in wide boxes, fixed 170 px gaps that never shrank → row from x 27 to 1893. Fixed OA1 in place (identical boxes, 40 px gaps, centred row 174–1746, labels centred on one baseline); fixed the builder (origin baselines, centred label-only cards, 40/60 gaps, fit loop, margin check at every rest). New audit_layout.py over all 12 OA comps: also fixed OA2 overview (title 59 px from top → fitcam), OA2/OA12 neighbour boxes peeking into focus rests (fade out/in), OA2 CALENDÁRIO and OA12 TRADUÇÃO headers 7–10 px low (fix_headbase.py), and an empty 1.5 s in OA2 (camera arrived before the card; shiftwin.jsx + woosh moved +0.86 s; builder guard). SKILL.md rule 12, graphics-style.md, graphics-build.md updated.
- **TRs (user, 2026-10-13):** only use "NN TR.mp4" 01–15 for the CRT/glitch transitions. Onde aplicar had "CRT Transition 20–25": replaced all 36 with TR 01–15 (cycled, start = edge − 40 % of length, Screen) and re-placed the glitches on the same spans (in-point 0, −10 dB). plan_oa.py TRV updated; rule in sfx-transitions.md.
- **Meta (user, 2026-10-13):** "always add the things you learn and feedback I give to the skill" — already the standing rule (SKILL.md "Keep learning"); applied to everything above in the same turn.
- **"OA2 is not within margins" + "nothing is truly static" (user, 2026-10-13, said before):** I had only pulled OA2's overview camera back (fitcam). Redid it: removed the zoom-only fix, and during the 0.7 s overview move the title + 3 cards animate into a compact stack (60 px title gap, 40 px between cards, centred) while the camera zoom goes ×1.2: block 127–953 px, text 20 % bigger; the title fades in over the second half of the move so it never crosses the top edge. New posanim.jsx. Rule in SKILL.md rule 12 and graphics-style.md.
- **Dark glow (user, 2026-10-13):** "fix that weird dark glow, it's supposed to be lighter". Glow Colors = Original Colors left an olive/brown ring (R 18 vs 2, G 101 vs 108 next to the title). Now Glow Colors = A&B, A [1,.97,.82], B [1,.9,.5], radius 80, intensity 1 on all 12 OA comps (glowlight.jsx); addglow.jsx default changed. The halo now lightens the BG.
- **Reference study (user, 2026-10-13): paises baratos G45 Abertura is "the stuff I want to see"** (beautiful cards, Lato/Hagrid mix, globe). Full notes in graphics-style.md "REFERENCE COMP" section: two-zone layout, 4-level type hierarchy, 55 %-translucent dark-green cards with labels parented at z −20, X-rotation flip-in/out cascades (0.16 s stagger), key-card yellow highlight + pulse, shape-built 3D wireframe globe on spin/tilt nulls with pins synced to each card, push-in camera then a slow drift. Dump tool: scripts/_deep.jsx. Also: after a PC reboot the bridge panel must be reopened (Window → mcp-bridge-auto.jsx); while it's closed, commands stay "pending".
- **"Make them pretty, follow margins, real art" (user, 2026-10-14, Onde aplicar):** rebuilt all 12 OA comps in place with the new art.jsx builder in the G45 Abertura vocabulary: left column (yellow Hagrid title with light glow, white Lato subtitle, translucent dark-green cards with yellow stroke flipping in on cue), right a living visual synced to the list (wireframe globe whose pins pop and which whips to face each place; or a checklist panel that ticks each item), push-in + drift camera, layout in screen px inside 150/100 margins. Found: a glow on the 3D Lato subtitle made it disappear on some frames → title-only glow. Backup: "Motions (backup antes arte G45).aep".
- **Art pass verified (2026-10-14):** all 12 OA comps rebuilt and audited (margins OK). Checklist panel ended rotated on Y and AE clipped it along a straight line → panels now end flat with a float. OA4 panel label changed to CHECKLIST (it repeated the title). Premiere SFX still match the OLD comps; re-sync after the user approves the look.
- **THE STANDARD (user, 2026-10-14):** "beautiful, make this the standard for our designs moving forwards". The art-builder look (art.jsx) is now the default for every graphic: SKILL.md step 2 + rule 14, graphics-style.md new top section "THE STANDARD", memory updated.
- **Camera (user, 2026-10-14):** "the slight zoom in is not part of our design system": snappy camera element to element (title, visual, each card on cue); only if it makes sense, a final open-up to the full picture with elements rearranging into the overview layout. SFX must be re-planned AFTER the camera change. graphics-style.md THE STANDARD + SKILL.md rule 14.
- **SFX re-sync (2026-10-14):** after the snappy camera rebuild, replaced the Onde aplicar graphic SFX with 128 from plan_oa_art.py (42 camera wooshes, 44 card jingles, titles/subtitles/lines/pins), all -10 dB. User rule: change the animation first, then the SFX.
- **Left = left in every SHOT + stage then group (user, 2026-10-14, angry, '5th time'):** my snappy camera centred left-aligned cards in each shot and neighbours/title showed cut at the edges. Rule: frame left-aligned elements with their left edge at the margin; stage each element (or rapid group) apart so each shot is clean; always end grouped (open-up with staggered fly-in; if no time, the open-up lands as the last card arrives). graphics-style.md THE STANDARD.
- **Camera concept corrected (user, 2026-10-14):** per-card shots were awkward (centred left-aligned cards, zooming into details, staged spacing that looked empty and broke margins, title misaligned by parallax). Rule: camera moves only to change subject; static camera while the frame builds; title shot then ONE move to the full composition; compensate parallax by moving the title during the move. Applies to all comps. graphics-style.md + SKILL.md.
- **Standard locked (user, 2026-10-14):** "beautiful, make sure the skill reflects this kind of animation and layout style, be specific". graphics-style.md THE STANDARD rewritten as an exact spec (layout numbers, type table, cards, visuals, camera choreography, parallax, glow, verification, a 10-item mistakes list); conflicting old camera/glow notes marked LEGACY; graphics-build art-builder notes corrected; SKILL.md rule 14 points to it.
- **Justify (user, 2026-10-14, Bolsas EUA):** "the texts in this video's motion graphics aren't justified". All real paragraphs were already justified boxes; the unjustified ones were sentences built from separate point layers (G38m need/merit descriptions, G39 'US$ 7 mil...' + 'dependendo...'). New mergejust.jsx merges them into one justified box keeping highlights and the speech-synced reveal (word animator), original line breaks and column width/scale. Bridge: commands stuck pending until the file-access preference/panel were reset; AE first had an older .aep copy open. graphics-build.md + tooling.md.
- **G35 join (user, 2026-10-14, BRASA Ensina Motions.aep):** "the two boxes on the left look weird, join them and add a separator gracefully". Box 1 (heading) widened to the table's width and grows with each table row reveal; table outer border off; the old box bottom stays as the separator; doubled row line made single and full width; both columns share top/bottom. Rule in graphics-style.md §6b. Bridge: timer dead after restart -> mcp_poll_start.jsx + mcp_poll.jsx (tooling.md).
