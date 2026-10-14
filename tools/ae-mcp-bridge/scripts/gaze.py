# usage: gaze.py out.png "label|file|t" ...  -> face crops tiled 6 per row with labels (for on-camera checks)
import sys, os, subprocess, tempfile
from PIL import Image, ImageDraw
SRC = r"C:/Users/lolo/Documents/Projetos/BRASA/BRASA Ensina/paises baratos/paises baratos/"
out, items = sys.argv[1], sys.argv[2:]
W, H, cols = 316, 240, 6
tiles = []
for it in items:
    lab, f, t = it.split("|"); tmp = os.path.join(tempfile.gettempdir(), "gz_%s_%s.png" % (f, t))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", t, "-i", SRC + f + ".MOV", "-frames:v", "1", "-vf", "crop=1000:760:460:0,scale=%d:%d" % (W, H), tmp], check=True)
    tiles.append((lab, tmp))
rows = (len(tiles) + cols - 1) // cols
S = Image.new("RGB", (W * cols, (H + 18) * rows), (30, 30, 30)); d = ImageDraw.Draw(S)
for i, (lab, p) in enumerate(tiles):
    x, y = (i % cols) * W, (i // cols) * (H + 18)
    S.paste(Image.open(p), (x, y + 18)); d.text((x + 4, y + 3), lab, fill=(255, 255, 0))
S.save(out); print("ok", len(tiles))
