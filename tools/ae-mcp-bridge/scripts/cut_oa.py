# Rough cut for "Onde aplicar": chosen spans (stringout-sequence word times from the user's Premiere transcript),
# mapped to source files, snapped to the speech-energy envelope. Writes oa_cuts.json (+ notes).
import json, subprocess, array, math, sys, os
EP = r"C:\Users\lolo\Documents\Projetos\BRASA\BRASA Ensina\4-onde aplicar" + "\\"
D = "C:/Users/lolo/Documents/ae-mcp-bridge/"
CLIPS = [("T19A5771", 0.0), ("T19A0027-002", 498.63), ("T19A0028", 1283.62), ("T19A0029", 1387.39), ("T19A0031", 1473.37),
         ("T19A0032", 1603.40), ("T19A0033", 1732.43), ("T19A0034", 1808.41), ("T19A0035", 1869.37), ("T19A0037", 2125.52),
         ("T19A5742", 2221.52), ("T19A5743", 2458.06)]
words = []
for s in json.load(open(EP + "T19A5771.json", encoding="utf-8"))["segments"]:
    for w in s["words"]: words.append((w["start"], w["start"] + w["duration"], w["text"]))
words.sort()
def wi(t):  # index of the word starting nearest t
    return min(range(len(words)), key=lambda i: abs(words[i][0] - t))
# (label, first-word start, last-word start)   [stringout seconds]
SPANS = [
 ("B0 quantas vezes", 9.80, 15.96), ("B0 se isso ja aconteceu", 26.36, 35.48), ("B0 cada regiao", 53.32, 56.76),
 ("B0 a boa noticia", 76.88, 81.80), ("B0 explorar hoje a", 228.08, 233.52), ("B0 explorar hoje b", 233.96, 235.20),
 ("B1 antes de falar", 309.20, 314.48), ("B1 criterios idioma", 354.12, 359.16), ("B1 ingles ou", 362.08, 366.28),
 ("B1 orcamento a", 375.88, 380.08), ("B1 orcamento b", 382.92, 384.32), ("B1 alemanha", 530.92, 539.28),
 ("B1 calendario", 553.84, 566.32), ("B1 vamos por partes", 593.40, 594.52),
 ("B2 EUA procurado", 652.68, 663.76), ("B2 EUA ivy", 670.56, 675.96), ("B2 EUA 1000", 701.04, 705.40),
 ("B2 EUA perfil", 706.32, 707.60), ("B2 EUA historico", 747.12, 748.92), ("B2 EUA extracurric", 750.08, 753.56),
 ("B2 EUA base comum", 768.32, 775.92), ("B2 EUA suplementares", 795.56, 799.36), ("B2 EUA nem todas", 817.00, 829.56),
 ("B2 EUA percurso", 835.76, 843.16), ("B2 EUA documentos", 885.00, 888.48), ("B2 EUA no geral a", 917.00, 921.40),
 ("B2 EUA no geral b", 928.96, 930.32), ("B2 EUA SAT ACT", 961.92, 966.08), ("B2 EUA test optional", 985.48, 998.08),
 ("B2 CA otimo exemplo", 1031.92, 1035.88), ("B2 CA diferente", 1043.88, 1047.60), ("B2 CA provincias", 1048.16, 1053.60),
 ("B2 CA OUAC", 1098.40, 1101.28), ("B2 CA ontario", 1109.64, 1116.76), ("B2 CA outras prov a", 1128.68, 1131.92),
 ("B2 CA basicamente", 1158.00, 1160.96), ("B2 CA vale conferir", 1162.36, 1163.08),
 ("B2 CA verificar", 1189.84, 1194.84),
 ("B3 saindo americas", 1214.40, 1227.56),
 ("B3 UK parecido", 1442.24, 1443.92), ("B3 UK ucas", 1467.68, 1470.16), ("B3 UK conta", 1489.64, 1491.24),
 ("B3 UK dados", 1495.60, 1496.60), ("B3 UK statement", 1497.56, 1498.84), ("B3 UK cinco cursos", 1504.40, 1507.24),
 ("B3 UK pos", 1518.64, 1530.76),
 ("B3 FR classico", 1267.36, 1280.60), ("B3 FR dossie", 1346.36, 1354.04), ("B3 FR processo", 1366.84, 1371.92),
 ("B3 FR nucleos", 1380.84, 1383.84), ("B3 FR pre consular", 1404.24, 1407.20), ("B3 FR visto", 1411.52, 1416.04),
 ("B3 IT diferente", 1560.80, 1565.88), ("B3 IT estudante", 1580.64, 1585.44),
 ("B3 IT obrigatoria", 1592.32, 1594.64), ("B3 IT graduacao", 1610.88, 1612.72), ("B3 IT analisa", 1619.24, 1622.24),
 ("B3 IT etapas", 1630.28, 1635.08), ("B3 IT diploma", 1641.96, 1646.88),
 ("B3 EU resto", 1666.72, 1668.16), ("B3 EU espanha", 1738.32, 1751.24), ("B3 EU regra", 1762.44, 1771.48),
 ("B3 EU consulado", 1783.84, 1787.40),
 ("B4 asia", 1811.68, 1813.00), ("B4 regra geral", 1823.48, 1832.32), ("B4 continente", 1836.76, 1839.52),
 ("B4 JP direto", 1854.12, 1857.64), ("B4 JP EJU", 1865.56, 1868.72), ("B4 JP exame", 1891.56, 1898.60),
 ("B4 JP JASSO", 1914.48, 1919.64),
 ("B4 CN unico", 1927.80, 1932.64), ("B4 CN cucas", 1995.76, 1999.08), ("B4 CN taxa", 2031.44, 2036.36),
 ("B4 CN CSC", 2085.12, 2094.52),
 ("B5 primeiro", 2187.44, 2199.88), ("B5 procure saber", 2200.44, 2205.56), ("B5 fluido", 2208.24, 2211.28),
 ("B5 segundo", 2223.12, 2226.36), ("B5 quais", 2232.12, 2234.44), ("B5 semanas", 2243.20, 2245.28),
 ("B5 terceiro", 2276.20, 2280.20), ("B5 cobram", 2284.32, 2287.76),
 ("B5 quarto", 2292.36, 2294.76), ("B5 acompanhe", 2314.68, 2321.64), ("B5 basico", 2328.08, 2333.56),
 ("B6 chegou ate aqui", 2369.00, 2375.20), ("B6 identificar", 2381.72, 2388.32), ("B6 continue", 2463.56, 2470.16),
]
def src_of(t):
    f, o = CLIPS[0]
    for name, st in CLIPS:
        if t >= st - 1e-6: f, o = name, st
    return f, o
def env(path, t0, dur):
    p = subprocess.run(["ffmpeg", "-v", "error", "-ss", "%.3f" % max(0, t0), "-t", "%.3f" % dur, "-i", path, "-ac", "1", "-ar", "8000", "-f", "s16le", "-"], capture_output=True).stdout
    s = array.array('h', p); n = 80   # 10 ms frames
    return [20 * math.log10(max(1, (sum(x * x for x in s[i:i + n]) / n) ** 0.5) / 32768) for i in range(0, len(s) - n, n)]
def vol(path, a, b):
    r = subprocess.run(["ffmpeg", "-v", "info", "-ss", "%.3f" % a, "-t", "%.3f" % (b - a), "-i", path, "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    mv = [l for l in r.splitlines() if "mean_volume" in l]; pk = [l for l in r.splitlines() if "max_volume" in l]
    return float(mv[0].split(":")[1].split()[0]) if mv else 0, float(pk[0].split(":")[1].split()[0]) if pk else 0
cuts = []
for lab, a, b in SPANS:
    i0, i1 = wi(a), wi(b)
    f, off = src_of(a)
    path = EP + f + ".MOV"
    w0s, w1s, w1e = words[i0][0] - off, words[i1][0] - off, words[i1][1] - off
    prev_end = (words[i0 - 1][1] - off) if i0 > 0 else 0
    next_start = (words[i1 + 1][0] - off) if i1 + 1 < len(words) else w1e + 1
    # IN: first frame above threshold in [max(prev_end, w0s-0.4), w0s+0.3]
    lo = max(prev_end + 0.02, w0s - 0.4); h = env(path, lo, (w0s + 0.3) - lo)
    floor = sorted(h)[len(h) // 10] if h else -60; thr = max(-42, floor + 14)
    on = next((k * 0.01 for k, v in enumerate(h) if v > thr), None)
    tin = (lo + on - 0.04) if on is not None else w0s - 0.05
    # OUT: last frame above threshold in [w1s, min(next_start, w1e+0.6)]
    hi = min(next_start - 0.03, w1e + 0.6); t = env(path, w1s, hi - w1s)
    floor2 = sorted(t)[len(t) // 10] if t else -60; thr2 = max(-42, floor2 + 12)
    offv = next((k * 0.01 for k in range(len(t) - 1, -1, -1) if t[k] > thr2), None)
    tout = min(hi, (w1s + offv + 0.15)) if offv is not None else w1e + 0.1
    mv, pk = vol(path, tin, tout)
    cuts.append({"file": f, "in": round(tin, 3), "out": round(tout, 3), "label": lab, "mean": mv, "peak": pk,
                 "text": " ".join(w[2] for w in words[i0:i1 + 1])})
json.dump(cuts, open(D + "oa_cuts.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
sys.stdout.reconfigure(encoding="utf-8")
tot = sum(c["out"] - c["in"] for c in cuts)
print(len(cuts), "cuts", round(tot, 1), "s")
for c in cuts: print("%-22s %-13s %8.2f-%8.2f %5.1fdB pk%5.1f | %s" % (c["label"], c["file"], c["in"], c["out"], c["mean"], c["peak"], c["text"][:70]))
