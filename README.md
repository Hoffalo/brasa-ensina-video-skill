# BRASA Ensina — Claude Code skill

A [Claude Code](https://claude.com/claude-code) skill that produces a **BRASA Ensina** YouTube episode end to end in
Adobe Premiere Pro + After Effects. It covers the rough cut from raw talking-head footage, the house-style motion
graphics in AE, and the SFX, CRT transitions and preset markers in Premiere. Claude stops at a checkpoint after each
step so you can review.

- `SKILL.md`: the workflow, checkpoints and fundamental rules (what Claude reads first)
- `references/`: detailed rules per step (rough cut, graphics style = **THE STANDARD**, graphics build, SFX, tooling)
- `tools/ae-mcp-bridge/`: the After Effects bridge panel and the scripts the skill runs
- `docs/patterns-log.md`: the running log of every rule and correction

---

## Install

### Option A: let Claude Code do it
Open Claude Code and paste:

> Install the skill from https://github.com/Hoffalo/brasa-ensina-video. Clone it into
> `~/.claude/skills/brasa-ensina-video`, copy `tools/ae-mcp-bridge` to `~/Documents/ae-mcp-bridge`, install
> `tools/ae-mcp-bridge/mcp-bridge-auto.jsx` into After Effects' `Scripts/ScriptUI Panels` folder, and tell me what
> else I need to set up from the README.

### Option B: by hand
```bash
git clone https://github.com/Hoffalo/brasa-ensina-video ~/.claude/skills/brasa-ensina-video
```
```bash
cp -r ~/.claude/skills/brasa-ensina-video/tools/ae-mcp-bridge ~/Documents/ae-mcp-bridge
```
Then copy `tools/ae-mcp-bridge/mcp-bridge-auto.jsx` to
`C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels\` and restart AE.

### What else the machine needs
| Need | Why |
|---|---|
| Premiere Pro with the **Premiere MCP server** + its MCP Bridge panel connected to Claude Code | Claude edits the timeline |
| After Effects with **Window → mcp-bridge-auto.jsx** open and "Auto-run commands" ticked; Preferences → Scripting & Expressions → "Allow Scripts to Write Files and Access Network" | Claude runs scripts in AE |
| Python 3.12 with `faster-whisper` (GPU optional, CPU works), `Pillow`; `ffmpeg` on PATH | transcription, cut points, contact sheets |
| Fonts **Hagrid** (Extrabold) and **Lato** (Regular/Bold) | house typography |
| SFX library at `Documents\Assets Gerais\Sound Effects\` and CRT transitions at `Documents\Assets Gerais\THE MASTER BUNDLE\THE MASTER BUNDLE\CRT TRANSITION\NN TR.mp4` (01–15) | step 3 |
| Your Premiere effect presets "Smooth In Text", "Smooth Out Text", "Smooth Zoom In" | you apply them at Claude's markers |

Some scripts contain absolute Windows paths (`C:/Users/lolo/...`) and per-episode paths. On another machine, ask
Claude to adjust them before the first run.

---

## How to use it

Start a Claude Code session and say something like *"let's make the BRASA Ensina video about X"*. The skill
loads automatically. Each step ends at a **checkpoint**: Claude stops, you review, then you tell it to continue.

### Before step 1: rough cut
Hand the chat:
- the **episode folder** (`Documents\Projetos\BRASA\BRASA Ensina\<episode>\`) with the raw footage;
- the **script** (PDF);
- the **Premiere project** open, with the raw files imported (a transcript or stringout transcript is optional;
  Claude transcribes everything anyway).

Claude builds a new sequence `<episode> - CORTE v1` (it never touches your raw sequence) plus a notes file.
**Checkpoint 1, your turn:** fix any takes or cuts, add the **vinheta** and the **music**, then say it's done.

### Before step 2: motion graphics
- Open the episode's After Effects project (its own `Motions.aep`, with a comp that has the house background,
  Null + camera rig) and make sure the **mcp-bridge-auto panel** is open and auto-running.
- Tell Claude when your final cut is ready (it reads the cut from the Premiere project).

Claude plans host time vs graphics, builds every comp in THE STANDARD style (left column + flip-in cards + a synced
globe or checklist, title shot then one camera move), checks frames, and gives you an **import list**.
**Checkpoint 2, your turn:** review the comps in AE, then **import them into Premiere** (Claude can't import AE
comps) and say "imported".

### Step 3: placement, SFX and transitions
Claude places the graphics, CRT transitions (TR 01–15, Screen), every SFX (−10 dB) and **markers** where a Premiere
preset is needed.
**Final checkpoint, your turn:** apply the presets at the markers (**Smooth Zoom In** on host clips, **Smooth
In/Out Text** on the G0 cards), watch the video and give feedback.

### Things that are always on you
- Keep Premiere and AE open with their bridge panels running. If AE restarts, reopen the panel (commands sitting at
  "pending" mean the panel isn't running). Close any AE dialog (missing fonts/footage) that blocks the bridge.
- Import AE comps into Premiere and apply effect presets. Claude places markers for those.
- After a reboot or an AE restart, don't save an old AE window over Claude's work.
- **Give feedback freely.** Every correction becomes a rule in this skill (`references/` + `docs/patterns-log.md`)
  in the same turn, so you shouldn't have to repeat yourself.

---

## Updating
Rules are added to the skill while you work. To publish them, ask Claude to *"commit and push the skill"*, or run
`git add -A && git commit -m "..." && git push` in `~/.claude/skills/brasa-ensina-video`. To refresh `tools/`
from your working copy, ask Claude to sync `~/Documents/ae-mcp-bridge` into it first.
