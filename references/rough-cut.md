# Step 1: rough cut

Goal: one clean jump-cut stringout on V1/A1 that follows the script, using only real takes.

## Process
1. **Script → lines.** PDF → text (pypdf) → numbered narration lines (one per sentence/clause, grouped by BLOCO)
   saved as `<ep>_lines.json`.
2. **Transcribe EVERY raw file** with `scripts/transcribe.py <video> <out.json>`. It runs faster-whisper large-v3
   on the GPU with word_timestamps, vad_filter=True and condition_on_previous_text=False; without that last setting,
   retake loops hallucinate repeated lines. Audio is fed as a 16 kHz numpy array because the bundled PyAV is broken.
   A user-supplied transcript usually covers only one file, so always transcribe all footage.
3. **Identify the episode's files by content.** Several episodes may be recorded the same day.
4. **Align** transcript segments to script lines (`align.py`, difflib over normalised words). The result is a list of
   candidate takes per line.
5. **Choose the take per line:**
   - **Loudness first.** Run ffmpeg `volumedetect` on every candidate. Real projected takes are ≈ −18.5 dB mean with
     peaks ≈ 0 dB; practice / half-voice takes are −21…−25 dB mean with peaks −4…−8. Discard anything more than
     ~2 dB quieter than the loudest takes of that line.
   - Then voice confidence, looking at the camera, and the full sentence delivered.
   - **Prefer the LAST complete loud take.** Always look a few seconds around a candidate; a later, better, complete
     version usually exists. A take that starts well and fails halfway is not a take.
   - Check whether the host is on camera with face crop sheets (`gaze.py`). Practice looks like leaning toward the
     computer, head low in frame, eyes down. Also reject takes with long internal pauses (ffmpeg silencedetect),
     odd delivery, or distracting gestures.
6. **Cut points.** Whisper word timings drift 0.3–1 s; use them only to find the region, then snap to the energy
   envelope (`edges.py`).
   - IN at voice onset (0–0.05 s before).
   - OUT 0.10–0.25 s after the last voiced sound. Never clip the end of a word.
   - **Keep sentences whole (user rule):** each clip carries a complete sentence. Never cut it short because the
     next clip covers the rest, and never build a sentence from 3–6 fragments; that hurts clarity and fluidity
     (the user had to extend many clips on Onde aplicar). Prefer one complete take with a small stumble over a
     stitched one.
   - Split a line only to remove a long pause (> ~0.8 s) or a restart, never mid-phrase.
   - Drop throat-clearing lead-ins ("Agora,", "Ok,") when the line works without them.
   - Keep extra natural lines that strengthen the script.
7. **Verify.** Assemble the cut audio with ffmpeg, re-transcribe it and read it against the script clip by clip.
   This catches clipped words, leftover stumbles and duplicates.
8. **Build the sequence.** `make_xml.py cuts.json out.xml "<ep> - CORTE v1"` (cuts.json: `[{file, in, out, label}]`)
   → `import_fcp_xml` → `check_offline_media` → `set_active_sequence`.
9. **CHECKPOINT 1.** Leave the vinheta and music to the user. Hand over a notes file listing each line's source take
   and the weakest choices.

## After the user's re-edit
Read their sequence with `pp_seq.py <prproj or autosave> "<seq name>"` and compare it with yours (`edges.py`). Log
every systematic difference as a rule.

## Premiere layout the user ends up with
- V1 interview (jump cuts every 2–7 s).
- V2 adjustment layer (grade) and the Vinheta ("Vinheta BRASA Ensina.mov") after the cold-open hook (~0:26–0:30)
  and at the very end.
- A1 voice. A2 vinheta audio (−10 dB). A3 music: a calmer intro under the cold open (~−25 dB), then the main bed
  "ES_Radar Focus - Blue Saga" (~−22 dB).
