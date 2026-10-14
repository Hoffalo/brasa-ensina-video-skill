# usage: make_xml.py cuts.json out.xml "Sequence name"
# cuts.json: [{"file": "T19A5745", "in": sec, "out": sec, "label": "L1"}, ...] placed back to back on V1/A1/A2.
import json, sys, os
from xml.sax.saxutils import escape
SRC = r"C:\Users\lolo\Documents\Projetos\BRASA\BRASA Ensina\paises baratos\paises baratos" + "\\"
DUR = {"T19A5745": 556.822933, "T19A5746": 303.536567, "T19A5747": 81.147733, "T19A5748": 747.113033, "T19A5749": 1088.087, "T19A5750": 664.897567}
FPS = 30000 / 1001
def fr(s): return int(round(s * FPS))
cuts, out, name = json.load(open(sys.argv[1], encoding="utf-8")), sys.argv[2], sys.argv[3]
def rate(): return "<rate><timebase>30</timebase><ntsc>TRUE</ntsc></rate>"
def url(f): return "file://localhost/" + (SRC + f + ".MOV").replace("\\", "/").replace(" ", "%20")
files_done = set()
def filexml(f):
    if f in files_done: return '<file id="file-%s"/>' % f
    files_done.add(f)
    return ('<file id="file-{f}"><name>{f}.MOV</name><pathurl>{u}</pathurl>{r}<duration>{d}</duration>'
            '<media><video><samplecharacteristics>{r}<width>1920</width><height>1080</height></samplecharacteristics></video>'
            '<audio><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics><channelcount>2</channelcount></audio></media></file>').format(f=f, u=url(f), r=rate(), d=fr(DUR[f]))
v, a1, a2, t = [], [], [], 0
for i, c in enumerate(cuts):
    s, e = fr(c["in"]), fr(c["out"]); n = e - s
    common = "<name>{f}.MOV</name><enabled>TRUE</enabled><duration>{d}</duration>{r}<start>{st}</start><end>{en}</end><in>{i}</in><out>{o}</out>".format(f=c["file"], d=fr(DUR[c["file"]]), r=rate(), st=t, en=t + n, i=s, o=e)
    links = "".join('<link><linkclipref>{p}-{k}</linkclipref><mediatype>{m}</mediatype><trackindex>{ti}</trackindex><clipindex>{ci}</clipindex></link>'.format(p=p, k=i, m=m, ti=ti, ci=i + 1) for p, m, ti in (("v", "video", 1), ("a1", "audio", 1), ("a2", "audio", 2)))
    v.append('<clipitem id="v-{k}">{c}{fx}{l}<comments><mastercomment1>{lab}</mastercomment1></comments></clipitem>'.format(k=i, c=common, fx=filexml(c["file"]), l=links, lab=escape(c.get("label", ""))))
    for p, arr, ch in (("a1", a1, 1), ("a2", a2, 2)):
        arr.append('<clipitem id="{p}-{k}">{c}<file id="file-{f}"/><sourcetrack><mediatype>audio</mediatype><trackindex>{ch}</trackindex></sourcetrack>{l}</clipitem>'.format(p=p, k=i, c=common, f=c["file"], ch=ch, l=links))
    t += n
xml = ('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE xmeml>\n<xmeml version="4"><sequence id="seq-1"><name>{nm}</name><duration>{d}</duration>{r}'
       '<media><video><format><samplecharacteristics>{r}<width>1920</width><height>1080</height><pixelaspectratio>square</pixelaspectratio><fielddominance>none</fielddominance></samplecharacteristics></format>'
       '<track>{v}</track></video><audio><numOutputChannels>2</numOutputChannels><track>{a1}<outputchannelindex>1</outputchannelindex></track><track>{a2}<outputchannelindex>2</outputchannelindex></track></audio></media></sequence></xmeml>').format(
    nm=escape(name), d=t, r=rate(), v="".join(v), a1="".join(a1), a2="".join(a2))
open(out, "w", encoding="utf-8").write(xml)
print("ok", len(cuts), "clips", round(t / FPS, 1), "s")
