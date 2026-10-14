# Dump a Premiere sequence's video clips (timeline start/end + source file in/out) from the gzipped .prproj.
import gzip, sys, xml.etree.ElementTree as ET
TPS = 254016000000
proj, seqname = sys.argv[1], sys.argv[2]
root = ET.fromstring(gzip.open(proj).read())
byid, byuid = {}, {}
for el in root:
    if el.get("ObjectID"): byid[el.get("ObjectID")] = el
    if el.get("ObjectUID"): byuid[el.get("ObjectUID")] = el
def ref(e):
    if e is None: return None
    if e.get("ObjectRef"): return byid.get(e.get("ObjectRef"))
    if e.get("ObjectURef"): return byuid.get(e.get("ObjectURef"))
    return None
def find(el, path):
    for p in path.split("/"):
        if el is None: return None
        el = el.find(p)
    return el
seq = [e for e in byuid.values() if e.tag == "Sequence" and (e.findtext("Name") == seqname)][0]
out = []
for tg in seq.iter("TrackGroup"):
    g = ref(tg.find("Second"))
    if g is None or g.tag != "VideoTrackGroup": continue
    for tr in find(g, "TrackGroup/Tracks").findall("Track"):
        t = ref(tr); ti = int(t.findtext("ClipTrack/Track/Index") or 0)
        items = find(t, "ClipTrack/ClipItems/TrackItems")
        if items is None: continue
        for it in items.findall("TrackItem"):
            ti_el = ref(it)
            start = int(ti_el.findtext("ClipTrackItem/TrackItem/Start") or 0); end = int(ti_el.findtext("ClipTrackItem/TrackItem/End") or 0)
            sub = ref(find(ti_el, "ClipTrackItem/SubClip")); clip = ref(sub.find("Clip")) if sub is not None else None
            vc = clip.find("Clip") if clip is not None else None
            inp = int(vc.findtext("InPoint") or 0) if vc is not None else 0
            src = ref(vc.find("Source")) if vc is not None else None
            media = ref(find(src, "MediaSource/Media")) if src is not None else None
            name = sub.findtext("Name") if sub is not None else "?"
            path = media.findtext("FilePath") if media is not None else ""
            out.append((ti, start / TPS, end / TPS, inp / TPS, name, path))
for r in sorted(out, key=lambda r: (r[0], r[1])):
    print("V%d %8.3f-%8.3f  in=%8.3f out=%8.3f  %s" % (r[0] + 1, r[1], r[2], r[3], r[3] + r[2] - r[1], r[4]))
