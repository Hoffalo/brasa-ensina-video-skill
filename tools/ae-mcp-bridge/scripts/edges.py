# Speech-energy edges around clip in/out points. usage: edges.py cutfile.txt
import re, subprocess, array, math, sys
def env(f, t0, dur):
    p = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t0), "-t", str(dur), "-i", f + ".MOV", "-ac", "1", "-ar", "8000", "-f", "s16le", "-"], capture_output=True).stdout
    s = array.array('h', p); n = 160
    return [20 * math.log10(max(1, (sum(x * x for x in s[i:i + n]) / n) ** 0.5) / 32768) for i in range(0, len(s) - n, n)]
for line in open(sys.argv[1]):
    m = re.search(r'in=\s*([\d.]+) out=\s*([\d.]+)\s+(T19A\d+)\.MOV', line)
    if not m: continue
    a, b, f = float(m.group(1)), float(m.group(2)), m.group(3)
    h0 = max(0, a - 0.6); h = env(f, h0, 1.4); t0 = b - 0.8; t = env(f, t0, 1.4)
    on = next((i * 0.02 for i, v in enumerate(h) if v > -38), None)
    off = next((i * 0.02 for i in range(len(t) - 1, -1, -1) if t[i] > -38), None)
    print("%s %8.2f-%8.2f  onset-in=%+.2f  out-lastvoice=%+.2f" % (f, a, b, (h0 + on) - a if on is not None else 99, b - (t0 + off) if off is not None else 99))
