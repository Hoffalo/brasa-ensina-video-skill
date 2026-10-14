# Step 2: the house style (what graphics must look like)

# THE STANDARD (approved 2026-10-14, Onde aplicar: "beautiful, make this the standard"; "beautiful" again after the camera fix)
Every BRASA Ensina graphic is built like the final Onde aplicar comps (`art.jsx` + `build_art_oa.py`, derived from
paises baratos G45 Abertura). Reference renders (in this folder): `standard_layout.png` (layout; its checklist panels show the old clipping, since fixed) and
`standard_camera.png` (rows = comps; columns = title shot, mid-move, built frame). **This section overrides every older note in this file**
(sections marked LEGACY below are history only). Text rules (capitalisation, italics only on foreign terms,
no Hagrid in sentences), margins and SFX rules still apply.

## 1. Layout (all numbers in screen px at the final camera rest, 1920x1080)
- **Two zones.** LEFT column starts at x = 150: title, subtitle, then the stack of cards, all on ONE left edge.
  RIGHT zone: one visual, centred in the space between the column's right edge + 90 px and x = 1770.
- The whole left block is centred vertically (top never above 130). Design air: 150 px sides / 100 px top-bottom,
  so nothing ever gets near the 100/80 safe margin.
- Vertical rhythm: title cap height (~75 px) → subtitle baseline 62 px under the title baseline → stack starts
  54 px below the subtitle (64 px if there is no subtitle). Cards 76 px tall (label cards 74, header+lines ~130–175),
  gaps 16 px (20 px for header cards). Never spread cards apart.
- Card width: ONE width for every card of the comp = widest text + 2 × 30 px padding, min 520 (420 for short
  labels), max 820. If the widest text doesn't fit, shrink the font for the whole class, not one card.
- Visual: globe Ø 560 or checklist panel ≤ 600 wide, centred at y 560.

## 2. Type
| Element | Font | Size | Colour | Other |
|---|---|---|---|---|
| Title | Hagrid Extrabold | ~104 px (shrink if > 1620 px wide) | yellow #FFCC03 | tracking 10, the ONLY layer with glow |
| Subtitle | Lato Regular | 46 px | off-white [0.95] | no glow (glow made 3D Lato vanish) |
| Card sentence | Lato Regular | 36 px | off-white | "N." in yellow Hagrid; key words yellow Lato Bold |
| Card header | Hagrid Extrabold | 34 px | off-white | tracking 15, + Lato 32 px lines under it |
| Short label card | Hagrid Extrabold | 38 px | off-white | tracking 15, CENTRED in its card |
| Panel header | Hagrid Extrabold | 36 px | yellow | "CHECKLIST", never a repeat of the title |
Baselines: everything is aligned by the text layer ORIGIN (baseline), never by glyph boxes (accents shift them).

## 3. Cards
- Fill dark green [0.02, 0.25, 0.07] at **55 %** opacity (grid shows through), yellow 4 px stroke, radius 18.
- Text is parented to its card and sits 20 units in front of it.
- **Flip-in on the spoken cue:** X rotation −80° → 0°, from 90 px above to its place, 0.35 s; opacity 0 → 100 in
  0.2 s (card and its text together). Ease: leave 40 / arrive 90 (right-skewed).
- Header-card lines arriving later: fade + 18 px rise, 0.3–0.35 s, on their own cue.
- Cards appear IN their final place in the stack. The frame builds up; nothing is staged elsewhere and moved later.

## 4. The visual (always synced to the list)
- **Globe** for places: disc Ø 560 (dark green fill, yellow 5 px stroke) pops 0 → 104 → 100 in 0.55 s; 5 parallels
  + 6 meridians (yellow 2.5 px, 55 %, equator 80 %) fade in; pins (26 px yellow, dark-green 5 px stroke,
  auto-oriented to camera) pop 0 → 110 → 100 on their cue; the globe turns to face each place on its cue (signs
  spin −1 / tilt +1 for this rig); optional ripple (all pins 100 → 140 → 100, staggered 0.05 s).
- **Checklist panel** for processes/documents: translucent panel like the cards, Hagrid "CHECKLIST" + 3 px rule,
  one row per item: on the item's cue the box fills yellow and pops (118 %), the check mark draws on, the bar turns
  yellow. The panel flips in like a card and ENDS FLAT (a shape layer left rotated on Y gets clipped by AE).
- Every list event has a matching visual event at the same time. New visuals: shape-built, yellow line art on dark
  green, synced to the speech.

## 5. Camera (the rule the user had to repeat most)
- **The camera moves ONLY to change subject / evolve the argument.** Within a subject it is STATIC and the frame
  builds up. No per-card shots, no zooming into a detail "just because", no slow push-in, no drift.
- **Default choreography for a list comp (two shots):**
  1. **Title shot** from 0 s: framed on title + subtitle, magnification ≤ 1.3, the block's LEFT EDGE on the 150 px
     margin (left-aligned = left-positioned in every frame), centred vertically. Title slides in from the left
     37 px + fades (0.15 → 0.47 s); subtitle slides 40 px (0.5 → 0.82 s). Hold ≥ 1.2 s.
  2. **One move (0.7 s) to the full composition**, starting 0.35 s before the first card/pin cue (never before
     1.2 s). The visual slides in from the right (700 px off-frame → its place) during the same move. Ease: leave 20
     / arrive 100, camera Null keys with LINEAR spatial interpolation and zero tangents (auto-bezier drifts).
  3. **Static** for the rest of the comp while cards flip in, pins pop and rows tick.
- More moves only when the comp genuinely changes topic (a second section, a new argument). Moves between Premiere
  visits happen while the graphic is off screen. Pins/events that would happen before the camera arrives are
  moved to the arrival (never animate off screen).
- **Parallax:** the title sits on z −180 (in front). When the camera is off-centre (title shot), parallax shifts it
  away from the subtitle's left edge, so the builder keys the title's x to share the subtitle's left edge in the
  title shot and slides it back during the move. Anything on another z plane that must share an edge gets the same
  treatment (user: moving things during camera moves "even looks cool").

## 6. Glow and finish
- Glow on the title only: ADBE Glo2, Color Channels, threshold 203, radius 80, intensity 1, composite on top, Add,
  **Glow Colors = A & B** with A [1, 0.97, 0.82] and B [1, 0.9, 0.5] → a light warm bloom. Never "Original Colors"
  on green (dark olive ring), never on G0 cards, never on the subtitle.
- Background: house green Ramp + Grid, no Turbulent Displace.

## 6b. Stacked boxes that belong together (user, 2026-10-14, G35)
- Two boxes stacked in one column for the same item (a heading box + a table/list box under it, with different widths
  and edges) "look weird": JOIN them into ONE box with the column's full width, and divide the parts with a
  separator line (same yellow, same stroke weight as the box, edge to edge). Table row lines are single lines of the
  same weight, never doubled (a thin rectangle with a stroke draws two lines).
- Animate gracefully: the box first wraps the heading; when the next part is revealed the box GROWS down in step with
  it, and its old bottom edge stays behind as the separator (no pop). Side-by-side boxes share top and bottom edges.

## 7. Verify before showing (every comp)
- Render with throwaway warm-up frames first (the first 1–2 frames of a `shots.sh` run come out black/incomplete),
  then: the title shot (~1.0 s), mid-move, just after the move, and the fully built end frame.
- Check each frame: left edges shared and on the 150 px line, nothing within the margins, nothing peeking from
  off-screen, labels centred in label cards, baselines equal across sibling cards, no empty frame while waiting.
- `audit_layout.py` (ignore the globe's flat-ring bbox false positive). Then plan SFX from the FINAL animation.

## 8. Mistakes made on Onde aplicar: never again
1. Labels positioned by glyph box → accented labels 7–11 px lower (align by origin/baseline).
2. Short labels pinned left in wide boxes; a row of boxes stretched edge to edge with 170 px gaps; boxes 25 px from
   the frame edge.
3. Overview "fixed" only by pulling the camera back: title on the top margin, cards far apart, tiny text (re-arrange
   instead, then frame).
4. Dark olive glow halo (Glow Colors = Original on green); glow on the 3D Lato subtitle made it disappear.
5. Checklist panel left rotated on Y → clipped along a straight line; panel header repeating the title.
6. Slow push-in + drift ("not part of our design system").
7. Per-card camera shots: centred left-aligned cards, zooming into details, neighbours cut at the frame edges,
   staged spacing that looked empty and broke margins ("you just moved the camera for no reason").
8. Title shot centred in the frame; title misaligned with the subtitle by parallax.
9. A framing patch written but never applied, then reported as done: run every patch, and render to confirm.
10. Camera arriving before its content (1.5 s of empty frame); SFX planned before the animation was final;
    transitions other than TR 01–15.

## Choosing what gets a graphic
- Plan HOST vs GRAPHIC beats as a table of sequence ranges before building anything. Graphics run only while their
  key info is being said; target well under half the runtime (paises baratos v2 was still ~60 %, which is too much).
- **Graphic length: each graphic stays on screen ~10–30 s** (slight variation is fine). This is the house norm; it
  does not count as "too long", so don't split a 30 s graphic. Avoid 1–3 s pops of an AE comp; a short beat like
  that is a G0 card or a Smooth Zoom In instead. Over ~30 s → split with host time between.
- **G0 cards are the exception: usually on screen for less than 10 s** (often 1–3 s, a quick emphasis over the host).
- **Point on screen, explanation on the host (user rule):** a list/checklist comp appears in VISITS. Each visit
  starts just before a point is said and holds while she STATES it. Cut back to the host as soon as she starts
  EXPANDING on it (examples, "isso…", "ou seja…", reasons). Points said back-to-back with no explanation in between
  can share one visit (no sub-1.5 s cut-aways). Filling an empty stretch never means wall-to-wall graphics: the
  user flagged 218–270 s of solid graphics in entrevista. Check the transcript sentence by sentence to place the cuts.
- **No long empty stretches:** after a pass, scan the cut for host-only gaps of ~40 s+ where key info is said
  (lists, checklists, recaps). Fill them with G0 cards or new comps in VISITS (see the rule above), still
  alternating with the host; the user flagged an empty second half. A recap
  ("Resumindo") usually deserves a short list graphic.
- One comp per idea (pricing | statement | coverage | spreadsheet). A comp that builds over a long stretch can appear
  in several short visits (same comp, different Premiere source ranges) with host in between. Each visit starts just
  before a NEW element animates in.
- Important term over the host → **G0 card** (see below). Emphasis only → **Smooth Zoom In** preset. Minor detail →
  nothing.

## Visual identity
- **Comps:** 1920x1080, 60 fps. **G0 cards are 3840x2160** (scale 50 % in Premiere).
- **Background:** the house BG solid ("Deep Royal Blue Solid 1", rendered green) = Ramp + Grid, rotated 90°, 3D,
  scale 300–400 %. The result is a dark-to-light green gradient with a faint, straight white grid. **No Turbulent
  Displace** (user: take it off all comps; remove it from old templates with `_rmtd.jsx`). Never use a flat 2D
  "BG Grid" solid.
- **Camera rig:** EVERY comp uses a Null-parented camera with 3D layers on different z depths (BG far, titles
  ~0/−340, body ~−1328) for parallax. No flat 2D comps.
- **Colours** (MIV):
  - Main: yellow #FFCC02/#FFCC03 `[1,0.8,0.01]`, Verde Escuro #03571A, Verde Folha #00863D, Cinza Claro #F4F4F4
    (text on dark green).
  - Icons on dark green: Laranja #FB8C0A, Amarelo, Amarelo Claro #F5D566, Verde Vívido #4BBF4B, Cinza Claro.
  - Yellow titles and yellow Lato highlights are allowed (user override of the MIV).
- **Fonts:**
  - Hagrid Extrabold → titles / display ONLY, always UPPERCASE, never in sentences. "DICA BRASA" stays Hagrid.
  - Lato → everything else (Regular body, Bold H1). Italic ONLY for non-Portuguese terms inside Lato text
    (Lato Italic / Bold Italic run on that word); never on Portuguese words.
  - Acronyms keep their case (B2, EUA, $25).
- **Logo:** no effects, distortion or recolouring.
- **Glow** (ADBE Glo2) on text, boxes and icons as a SLIGHT, LIGHT detail: Glow Colors = **A & B**, Color A
  [1, 0.97, 0.82] (warm white), Color B [1, 0.9, 0.5] (pale yellow), radius 80, intensity 1, Color Channels,
  threshold 203, Add, composite on top (`glowlight.jsx`; `addglow.jsx` default). The halo must be LIGHTER than the
  background. "Original Colors" gave a dark olive/brown ring around yellow on green (user: "weird dark glow").
  **G0 cards: no glow at all.**
- **No source credits** ("Fonte: …") on screen.

## Element vocabulary
- **Yellow outline box:** 4 px stroke, 22 px corner radius, around the CONTENT (not the title). Drawn on with trim
  paths over 0.55 s, same Glow as the text. Padding 56 px horizontal / 44 px vertical (30–40 px for rows of 3 cards).
- **Pill chip:** dark-green fill + 3–4 px yellow stroke + UPPERCASE Hagrid label. A filled-yellow pill with
  dark-green text marks the key item. Stacked pill lists build bottom-up into "slots".
- **Big yellow value callout** (€0, R$ 0, US$ 600–900/mês) next to its pill, with a small Lato caption under it.
- **Two-column comparison** (FRANÇA | POLÔNIA) divided by a thin yellow rule.
- **Bracket "sum"** leading to a result ("= CUSTO REAL").
- **Wireframe globe** with country pins.
- **Statement frame:** big two-line Hagrid (second line yellow) plus a Lato sentence under it.
- **Table / spreadsheet:** yellow box, divider, row lines wiping in, cells staggered, filled-yellow TOTAL row
  (`build_table.jsx`). Cell text centred vertically in its row.
- **Kicker:** small yellow Lato label above a big Hagrid title.
- **Numbered lists:** yellow "1. " merged into each item line.
- **"Bad example" quote:** upright Lato in quotes (italic only on foreign words), struck through with a white
  solid wipe.
- **G0 card:** a YELLOW rounded box + YELLOW Hagrid UPPERCASE term (never green) on a transparent BG. Duplicate G0 with
  `make_card.jsx`; the box widens to the text. The user animates it with Smooth In/Out Text. Never re-layout existing
  single-title boxed cards.
- **"Dica BRASA":** always centred, with the medal centred above it.
- **Real-document walkthrough (user rule, CV Forte):** when the host walks through an actual document (a CV, a
  letter, a form), show THE DOCUMENT ITSELF, never a plain text list of its points. Use the real page (PDF → PNG) as a
  3D layer on the house BG. The camera rests on each section as it is named. A dark-green spotlight dims the rest of
  the page. The section gets a yellow box with a tab pill (numbered Hagrid label) on its top-left edge, and
  key phrases get yellow highlighter wipes. Pull a dense example out into its own card in front, for
  example a formula breakdown with labelled pill rows. Show "bad examples" as struck-through quote pills.

## Layout rules
- **Safe margins:** ~100 px sides, ~80 px top and bottom. A title never sits closer than 40 px to the frame top.
  Prefer backing the camera up (fitcam) over letting things touch the edge.
  Check EVERY camera rest (overview pull-backs included) and every visible element; a neighbouring card's box edge
  peeking 20–60 px into the frame at a focus rest is a violation too (fade it out during the move, back in for the
  overview). OA1 shipped with boxes 25 px from the frame edge, and OA2's overview title 59 px from the top.
- **Re-arrange on every camera change (user: "nothing is truly static"):** when the camera moves to a new rest
  (above all the overview pull-back after card-by-card focus), animate the elements' positions during that same
  move into a layout that fits the new framing: a compact stack/grid with 40–60 px gaps under the title, centred,
  then frame it as big as the margins allow (camera zoom keyed on the same move). OA2's overview only pulled the
  camera back: the title hit the top, the last box hit the bottom, and the cards floated far apart with tiny text.
  Fade in elements that would cross the frame edge mid-move (OA2 title: in over the last half of the move).
- **Text inside boxes (user: "looks randomly positioned in the box"):**
  - Sibling boxes (a row of cards, a grid) are IDENTICAL in size; gaps 40 px (label-only cards) / 60 px (cards with
    lines); the row/grid is centred inside the margins. Never a 170 px gap that stretches a row edge to edge.
  - A box holding a single label centres it horizontally AND vertically (cap height centred). Boxes with a header +
    lines keep text left at a uniform padding (56 px).
  - All siblings share ONE baseline, measured from the text layer ORIGIN. Never align by glyph bounding boxes:
    accents (Á, É, Ã, Ç) make the box taller, so accented labels landed 7–11 px lower than the others.
- **Left-aligned = positioned left.**
  - A left-aligned title sits at the content's left edge, inside the margins.
  - Only TEXT is pushed left; arrows and icons stay centred on their content.
  - Text inside shapes (funnel tiers, table cells, G0) stays centred.
- **Title + subtitle + ONE box = centred block.** Title and subtitle are centred on the frame, the box is centred on
  the frame, and the text inside the box is left-aligned / justified at the box's left padding.
- **A one-column section that will grow** looks centred, then animates to left-positioned when the second column
  arrives (`centerphase.jsx`).
- **Body text** is left-aligned and justified (FULL_JUSTIFY_LASTLINE_LEFT; first half of a split sentence uses
  LASTLINE_FULL). Convert soft returns to paragraph breaks first.
- **Spacing:**
  - Title → box gap: 80 px (big Hagrid), 60 px (kicker), 40 px when the framing is tight.
  - Body ~120 px under its title.
  - Leave breathing room; never crowd a title onto a box.
- **Repeated cards** are identical in size and height, on a symmetrical grid with equal 30–40 px gaps.
> **LEGACY:** superseded by THE STANDARD §5 (camera). Kept for history; do not follow.
- **Camera tours:**
  - Space sections so that at each rest no neighbour is visible.
  - Every rest frames its whole section inside the margins, and no move clips text.
  - Fade out elements left over from the previous section during the move (0.4–0.6 s).
- **Continuity:** if a comp opens on what the previous comp ended on, match that final frame exactly.
- **Inline highlights** built as separate layers sit one space after the sentence, with baselines matched and the
  same scale.
- **Capitalisation:** labels and bullets start with a capital ("Custo de vida", "- Quantas entrevistas"). A
  continuation layer of a split sentence stays lowercase.

## Animation
- **CURVE SHAPE (user rule, stated very clearly): every keyframe curve is RIGHT-SKEWED.** In the speed graph the
  peak comes EARLY and a long tail eases into the next key. Per segment k→k+1: OUT influence of k is LOW
  (16.67 text/elements, 5–33 camera Null), IN influence of k+1 is HIGH (80–100). This applies to every property:
  Position, Opacity (fade-outs too), Scale, Null/camera, mask paths, trim paths. The inverted shape (high out / low
  in = slow start, abrupt stop) is WRONG. It happens when a script alternates ease values by key index, and a camera
  hold then a move flips it. Check with `fixskew.jsx` (FK `{comps, dry}`), which lists and fixes inverted segments.
- **Text / element in:** a SHORT rise, **≤ ~50 px measured on screen**, + opacity 0→100 over ~0.42 s. Eases: out
  16.67 / in 81–100 influence. Big rises (100–350 px, common in older comps) look weird (user feedback): run
  `rise.jsx` on every comp. Layers deep in 3D z need only a small world delta, so always measure in screen px.
- **Entrance speed:** slow entrances (> 0.5 s) get sped up to ~0.4 s by moving the END key closer to the start
  (start time and final position stay). Only when it makes sense (user): leave entrances that are already quick
  (≤ 0.5 s), those paced with a camera move, and those whose next key follows right after. Tool: `speedin.jsx`.
- **Text out / swap:** the old text animates out (0.3 s), the new one animates in (0.42 s). Never use hold-key Source
  Text swaps (`swapanim.jsx`).
- **Line / strike wipe:** scale X 0→N over 0.55 s, ease 49.92 / 100.
- **Camera:** see THE STANDARD §5 (LEGACY notes follow).
- **(LEGACY) What a camera move is FOR (user rule, stated clearly):** a move REVEALS something new (pan/tilt to bring in the
  list or the next section) or carries us INTO A NEW TOPIC. It is not decoration. NO slow zooms, no long or big
  dolly-ins/outs, no "start close on the title and pull back". A push-in is allowed only when SMALL (≈5–8 % scale)
  and QUICK (≈0.3–0.4 s), e.g. as a new item or visit lands. Every list comp still needs a camera move (static comps
  look boring). The default for lists: open with the title centred, then tilt to reveal the list as the box draws.
- **(LEGACY, see THE STANDARD §6: glow on the title only, A&B light colours) Glow on every text, box and pill:** ADBE Glo2, Based On = Color Channels (2),
  Threshold 203, Radius ~120, Intensity ~0.5 (the reference read 300–500 / 30 but the user wants it subtle), Composite On Top (1), Operation 3, **Glow Colors =
  Original (1)**. The new-layer default is A & B (white→black), which gives BLACK halos, so always set it. Tool:
  `addglow.jsx`. Templates may ship without glow; add it.
- **Timing:**
  - Titles appear at 0–0.4 s, body items stagger every ~1–2 s, on their spoken cue.
  - Content is on screen within ~0.3 s of the comp start.
  - No 1–2 s slow fades (run `fixslow.jsx` after any retime).
- **Statement order:** title line 1 → title line 2 → sentence.


## (LEGACY: camera parts superseded by THE STANDARD §5) Motion language: the reference is `10-paises baratos\paises baratos - Claude.aep` (user: "exemplary and truly beautiful")
Study the user's own comps G2–G43 there (keyframes dumped with `_study.jsx`). Static, glowless, flat-depth list comps
were called "super boring". Every comp must use this language. Text rules (left-aligned / justified body,
left = positioned left, centred title+box block) STILL APPLY: weigh them against a pleasing composition and never drop
them for motion.

**1. Lay the comp out in SPACE and let the camera travel.** Sections sit at different places in the 3D world
(stacked vertically in G24, side by side in G37, a 2×2 grid in G16). On each NEW TOPIC the camera (Null 1 + Camera at
[0,0,-1400], zoom 2666.67) travels to the next section: pan/tilt plus a dolly, 0.55–0.75 s, ease out 17–33 / in 100.
After the last section, a dolly-out can show all of them (G16 final move, 1.4 s). A move always goes somewhere: to a
new section, a reveal or a focus. Never a decorative drift.

**2. Opening = big title, then a fast reveal.** The comp opens on the title LARGE (fills ~80 % of the frame width,
centred: "Carta Completa", "BROWN UNIVERSITY" + logo, "PACOTE DE BENEFÍCIOS / PODE INCLUIR:"). It holds ~1–2.5 s
while she says it. Then one quick camera move (0.55–1.0 s; null y +300…+900 and z −700…−2200, often with
Camera Zoom 2666 → ~2170–2550 animated over the same keys) tilts/dollies back. The title becomes a small header and
the content below is revealed. This is fast and decisive, not a slow zoom.

**3. Real depth.** Background solid at z 0. Titles/kickers at z 0 … −340. Body content at z −1150 … −1550 (closer to
the camera, so it parallaxes strongly against the grid when the camera moves). Section kicker labels: small Lato
(~54) at the top-left ("Carta Revisada | Abertura").

**4. Entrances move in 3D.** Body text rises ~65 px AND comes toward the camera (z −1196 → −1328) in 0.35 s.
Position ease out 38 / in 100, opacity 0→100 (out 33 / in 100). Some lists slide in from the left instead
(X +100, 0.58 s). Boxes draw on with trim paths (0.55 s, ease 50/33 → 17/100).

**5. Motion inside the scene, not only the camera.**
- Rows slide together to reveal the next state (G37: the timeline slides left at once to bring in "Hoje").
- Boxes RESIZE to fit new content (Rect Size + Position keyed, 0.5 s).
- Highlight bars scale X 0→N (0.6 s).
- Spreadsheets reveal rows and cells with mask-path wipes (G41).
- A box can move with its text when the layout re-flows.

**6. Background: NO Turbulent Displace** (user: "take off that turbulent displace from all comps"), even though the
reference has it. Plain Ramp + Grid BG.

**7. Glow is a SLIGHT, LIGHT detail** (user) on text, boxes and icons: pale A&B colours, radius 80, intensity 1
(`glowlight.jsx`), never a big bloom and never a dark halo. **G0 cards have NO glow at all.**

**8. Scale and margins.** Content is BIG and fills the frame (body Lato reads ~40–55 px tall) but stays inside the
~100/80 px margins at EVERY rest, including after each camera move. Check the rests with frames before reporting.
The user flagged "not watching out for margins" when list boxes ran to ~30 px from the edge.

## REFERENCE COMP: paises baratos "G45 - Abertura" (user: "this is the stuff I want to see")
Studied 2026-10-13 (deep dump: `scripts/_deep.jsx`, X `{comp}`). 1920x1080, 60 fps, 12 s. Copy this vocabulary.

**Composition: two zones.** A left column (title + subtitle + card stack) left-aligned at x ≈ 155, inside the
margin; a big visual (globe) centred in the right half (x 1420). Balanced, nothing touches the margins, lots of air.

**Type mix (Hagrid + Lato), a clear four-step hierarchy:**
1. Title: Hagrid Extrabold 104 (scale 93 %), YELLOW, tracking 10, on z −180 (closer than the rest → parallax).
2. Subtitle: Lato Regular 52, off-white [0.95], directly under the title, same left edge.
3. Kicker: Lato Regular 36, YELLOW ("No vídeo:"), introducing a list.
4. Card labels: Hagrid Extrabold 38–40, off-white, **tracking 15**, centred in the card.
Glow only on title, subtitle and kicker (a soft wash: Original Colors, radius 500, intensity 30); none on cards or
globe.

**Cards (pills):** rounded rect 500 × 72 (80 for the 2nd list), radius 18, fill dark green [0.02, 0.25, 0.07] at
**55 % opacity** (the grid shows through), yellow stroke 4 px (6 px for the 2nd list). The label is PARENTED to its
card at z −20 (floats just in front → micro-parallax). Stack pitch 86 px (72 + 14 gap); 2nd list 106 (80 + 26).
- **Flip-in (the signature move):** X Rotation −80° → 0° + drop 90 px into place + opacity 0 → 100 in 0.2 s; move
  0.35 s; cards cascade every **0.16 s**. Label opacity follows its card.
- **Flip-out:** X Rotation 0 → +80° + fade (0.2–0.35 s), cascading every 0.06 s, like split-flap / rolodex cards.
  The first list flips away before the second list (with its kicker) arrives on its cues (~1 s apart).
- **Highlight the key card:** fill dark → YELLOW and opacity 55 → 100 (0.18 s), label off-white → dark green (Fill
  effect keyed), and a scale pulse 100 → 105 → 100 (0.15 s + 0.25 s).

**Globe (3D wireframe built from shapes):**
- Disc: ellipse 500, dark green fill, yellow 5 px stroke; scale pop 0 → 104 → 100 over 0.5 s (overshoot).
- Wireframe: 5 parallels (ellipses 250 / 433 / 500 / 433 / 250 at y −167 / −75 / +50 / +175 / +267) + 6
  meridians (500 ellipses rotated around Y); yellow 2.5 px strokes at 55 % (equator 80 %); fade in 0.1 → 0.62 s.
- Rig: all lines and pins parented to a "Globo Spin" null (Y Rotation 45° → −135° over the whole comp = a slow,
  continuous spin), itself parented to a "Globo Tilt" null. Pins ride the rotation and go behind the globe.
- Pins: 26 px yellow dots with a 5 px dark-green stroke at real-ish positions; each pops (0 → 110 → 100, 0.3 + 0.15 s)
  **at the exact moment its country card flips in**. Then all pins pulse together (100 → 140 → 100, staggered
  0.05 s) as a ripple once the list is complete.
- **Sync is the magic:** the list and the visual are linked: every card has a matching event in the visual.

**Camera (as found in G45; do NOT copy, see THE STANDARD §5):** Null dolly push-in at the start (z −1818 → −1149 in 0.57 s), then a barely perceptible drift (to −1034
over the rest), so the scene never feels frozen.

**Timing:** title at 0.15 s (slide in from the LEFT 37 px + fade 0.27 s; horizontal slide, not a rise), subtitle at
0.55 (slides 40 px right), cards from 0.97. Everything is on screen within 1 s, with constant small motion after.
Keyframe eases in this comp are 75/75 (strong, symmetric). Keep the right-skewed rule for camera moves and fades
unless copying these card flips.

**What to reuse:** the left-column + right-visual layout, the 4-level type hierarchy, translucent cards with floating
labels, the flip-in/flip-out cascade, the key-card highlight, a living visual (slow spin/drift) whose events are
synced to the list. (Not the push-in camera opening: see THE STANDARD §5.)
