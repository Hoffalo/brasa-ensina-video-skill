import subprocess, sys, os, math, array
root = sys.argv[1]
for d, _, fs in sorted(os.walk(root)):
    for f in sorted(fs):
        if not f.lower().endswith((".wav", ".mp3", ".aif", ".aiff", ".ogg")): continue
        p = os.path.join(d, f)
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
        a = array.array("f"); a.frombytes(raw[:len(raw)//4*4]); n = 800
        db = []
        for i in range(0, len(a), n):
            w = a[i:i+n]; r = math.sqrt(sum(x*x for x in w)/max(len(w),1)); db.append(20*math.log10(r) if r > 0 else -120)
        dur = len(a)/16000; pk = max(db); thr = max(-60, pk - 45)
        last = max([i for i, v in enumerate(db) if v > thr], default=0)
        full_end = min(dur, (last+1)*0.05 + 0.05)
        # first event: from first window above thr, until a >=0.3 s run below thr
        on = next((i for i, v in enumerate(db) if v > thr), 0); i = on; e1 = None
        while i < len(db):
            if db[i] <= thr and all(v <= thr for v in db[i:i+6]): e1 = i; break
            i += 1
        first_end = full_end if e1 is None else min(dur, e1*0.05 + 0.05)
        multi = "MULTI" if first_end < full_end - 0.3 else ""
        print("%s\t%.2f\t%.2f\t%.2f\t%s" % (os.path.relpath(p, root).replace("\\", "/"), dur, first_end, full_end, multi))
