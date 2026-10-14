# usage: sheet.py TAG COMP t1 t2 ... -> frames/sheet_TAG_COMP.png (waits for the PNGs)
import sys, os, time
from PIL import Image, ImageDraw
tag, comp, ts = sys.argv[1], sys.argv[2], sys.argv[3:]
D = os.path.expanduser("~/Documents/ae-mcp-bridge/frames/")
files = [D + "%s_%s_%s.png" % (tag, comp.replace(" ", "_"), t) for t in ts]
for _ in range(240):
    if all(os.path.exists(f) and os.path.getsize(f) > 0 for f in files): break
    time.sleep(0.5)
time.sleep(1)
W, H, cols = 384, 216, 5
rows = (len(files) + cols - 1) // cols
S = Image.new("RGB", (W * cols, H * rows))
d = ImageDraw.Draw(S)
for i, (f, t) in enumerate(zip(files, ts)):
    try: im = Image.open(f).convert("RGB").resize((W, H))
    except Exception: continue
    x, y = (i % cols) * W, (i // cols) * H
    S.paste(im, (x, y))
    d.rectangle([x + 20, y + 16, x + W - 20, y + H - 16], outline=(255, 0, 0))  # ~96/80px margins
    d.text((x + 4, y + 2), "%s %ss" % (comp, t), fill=(255, 255, 255))
S.save(D + "sheet_%s_%s.png" % (tag, comp.replace(" ", "_")))
print("ok", len(files))
