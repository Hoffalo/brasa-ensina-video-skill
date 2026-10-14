# Onde aplicar: rebuild all 12 comps in place with art.jsx (G45 vocabulary). Times = comp-local cue seconds.
import json, subprocess, sys
D = "C:/Users/lolo/Documents/ae-mcp-bridge"
G = {"spin": -1, "tilt": 1}
def globe(pins, face=None, ripple=None):
    return {"type": "globe", "pins": pins, "face": face or [[pins[0]["t"], pins[0]["lon"], pins[0]["lat"]]], "ripple": ripple}
CFG = [
 {"comp": "OA1 regioes", "title": "ONDE APLICAR", "sub": "País por país", "kind": "label",
  "items": [{"text": "AMÉRICAS", "t": 4.14}, {"text": "EUROPA", "t": 4.82}, {"text": "ÁSIA", "t": 5.62}, {"text": "OCEANIA", "t": 7.2}],
  "visual": globe([{"name": "Americas", "lat": 15, "lon": -75, "t": 4.14}, {"name": "Europa", "lat": 50, "lon": 10, "t": 4.82}, {"name": "Asia", "lat": 35, "lon": 100, "t": 5.62}, {"name": "Oceania", "lat": -25, "lon": 135, "t": 7.2}],
                  [[4.14, -75, 15], [4.82, 10, 40], [5.62, 100, 30], [7.2, 135, -20]])},
 {"comp": "OA2 criterios", "title": "COMO ESCOLHER", "sub": "3 critérios", "kind": "head",
  "items": [{"text": "1. IDIOMA", "t": 1.2, "lines": [{"text": "Inglês ou francês, alemão, espanhol?", "t": 1.3, "hl": ["Inglês"]}]},
            {"text": "2. ORÇAMENTO", "t": 10.3, "lines": [{"text": "Mensalidade, custo de vida e bolsas", "t": 10.4, "hl": ["bolsas"]}]},
            {"text": "3. CALENDÁRIO", "t": 25.3, "lines": [{"text": "Setembro ou abril (Japão)", "t": 25.4, "hl": ["abril"]}]}],
  "visual": {"type": "check", "label": "CRITÉRIOS"}},
 {"comp": "OA3 common app", "title": "COMMON APP", "sub": "Estados Unidos", "kind": "card",
  "items": [{"text": "1.000+ instituições pelo mundo", "t": 1.3, "hl": ["1.000+"]}, {"text": "Perfil único", "t": 6.1}, {"text": "Histórico escolar e extracurriculares", "t": 7.5},
            {"text": "Ensaio pessoal", "t": 12.2}, {"text": "Redações suplementares por universidade", "t": 23.0, "hl": ["por universidade"]}],
  "visual": globe([{"name": "EUA", "lat": 39, "lon": -98, "t": 0.9}], ripple=21.0)},
 {"comp": "OA4 documentos", "title": "DOCUMENTOS", "kind": "card",
  "items": [{"text": "1. Histórico escolar", "t": 2.8}, {"text": "2. Cartas de motivação e recomendação", "t": 4.0},
            {"text": "3. Proficiência em inglês: TOEFL, IELTS ou Duolingo", "t": 6.3}, {"text": "4. SAT ou ACT, dependendo da universidade", "t": 10.6}],
  "visual": {"type": "check", "label": "CHECKLIST"}},
 {"comp": "OA5 canada", "title": "CANADÁ", "sub": "Depende da província", "kind": "head",
  "items": [{"text": "ONTÁRIO", "t": 1.6, "lines": [{"text": "Plataforma OUAC", "t": 2.3, "hl": ["OUAC"]}, {"text": "Ex.: University of Toronto", "t": 9.9}]},
            {"text": "OUTRAS PROVÍNCIAS", "t": 11.3, "lines": [{"text": "Alberta, Quebec...", "t": 13.6}, {"text": "Direto na universidade", "t": 16.0, "hl": ["Direto"]}]}],
  "visual": globe([{"name": "Ontario", "lat": 50, "lon": -85, "t": 1.6}, {"name": "Alberta", "lat": 55, "lon": -115, "t": 13.6}, {"name": "Quebec", "lat": 52, "lon": -72, "t": 13.75}],
                  [[1.6, -85, 45], [13.6, -95, 45]])},
 {"comp": "OA6 ucas", "title": "REINO UNIDO", "sub": "Tudo pela UCAS", "kind": "card",
  "items": [{"text": "1. Crie uma conta e preencha seus dados", "t": 2.1}, {"text": "2. Escreva o personal statement", "t": 5.9},
            {"text": "3. Até 5 cursos numa única inscrição", "t": 8.8, "hl": ["5 cursos"]}, {"text": "4. Só graduação: pós é direto na universidade", "t": 11.4, "hl": ["Só graduação"]}],
  "visual": globe([{"name": "UK", "lat": 54, "lon": -2, "t": 1.3}])},
 {"comp": "OA7 campus france", "title": "FRANÇA", "sub": "Campus France", "kind": "card",
  "items": [{"text": "1. Dossiê eletrônico no Études en France", "t": 1.3}, {"text": "2. Envio para várias formações", "t": 4.3}, {"text": "3. Documentos e entrevista no Brasil", "t": 8.5},
            {"text": "4. Procedimento pré-consular", "t": 19.8}, {"text": "5. Pedido de visto", "t": 25.2, "hl": ["visto"]}],
  "visual": globe([{"name": "Franca", "lat": 46.6, "lon": 2.2, "t": 0.9}])},
 {"comp": "OA8 italia", "title": "ITÁLIA", "sub": "Universitaly", "kind": "card",
  "items": [{"text": "1. Pré-inscrição no Universitaly", "t": 7.6}, {"text": "2. Análise da universidade", "t": 13.9}, {"text": "3. Declaração de Valor do diploma", "t": 20.5}, {"text": "4. Visto no consulado", "t": 25.8, "hl": ["Visto"]}],
  "visual": globe([{"name": "Italia", "lat": 42.5, "lon": 12.5, "t": 0.9}], ripple=7.6)},
 {"comp": "OA9 europa", "title": "EUROPA", "sub": "Onde aplicar", "kind": "card",
  "items": [{"text": "Reino Unido: UCAS", "t": 1.3, "hl": ["UCAS"]}, {"text": "França: Campus France", "t": 1.6, "hl": ["Campus France"]}, {"text": "Itália: Universitaly", "t": 1.9, "hl": ["Universitaly"]},
            {"text": "Espanha, Portugal, nórdicos: direto na universidade", "t": 2.5, "hl": ["direto na universidade"]}],
  "visual": globe([{"name": "UK", "lat": 54, "lon": -2, "t": 1.3}, {"name": "Franca", "lat": 46.6, "lon": 2.2, "t": 1.6}, {"name": "Italia", "lat": 42.5, "lon": 12.5, "t": 1.9},
                   {"name": "Espanha", "lat": 40, "lon": -4, "t": 2.5}, {"name": "Portugal", "lat": 39.5, "lon": -8, "t": 2.6}, {"name": "Nordicos", "lat": 62, "lon": 15, "t": 2.7}], [[1.3, 5, 48]], ripple=4.0)},
 {"comp": "OA10 japao", "title": "JAPÃO", "kind": "card",
  "items": [{"text": "1. Sem plataforma nacional", "t": 1.3}, {"text": "2. Direto com cada universidade", "t": 1.7}, {"text": "3. Graduação: exame EJU", "t": 7.0, "hl": ["EJU"]}, {"text": "4. Organizado pela JASSO", "t": 15.9, "hl": ["JASSO"]}],
  "visual": globe([{"name": "Japao", "lat": 36, "lon": 138, "t": 0.9}], ripple=15.4)},
 {"comp": "OA11 china", "title": "CHINA", "sub": "3 caminhos", "kind": "head",
  "items": [{"text": "DIRETO", "t": 2.3, "lines": [{"text": "Na universidade", "t": 3.0}]}, {"text": "CUCAS", "t": 7.8, "lines": [{"text": "Plataforma paga", "t": 8.4, "hl": ["paga"]}]},
            {"text": "BOLSA CSC", "t": 16.1, "lines": [{"text": "Portal anual", "t": 16.6}]}],
  "visual": globe([{"name": "China", "lat": 35, "lon": 104, "t": 0.9}], ripple=14.6)},
 {"comp": "OA12 dicas", "title": "4 DICAS PRÁTICAS", "kind": "head",
  "items": [{"text": "1. PRAZOS", "t": 1.4, "lines": [{"text": "Confirme o prazo de cada curso", "t": 1.7}]}, {"text": "2. TRADUÇÃO", "t": 23.6, "lines": [{"text": "Juramentada: leva semanas", "t": 23.9, "hl": ["semanas"]}]},
            {"text": "3. COMPROVANTES", "t": 33.5, "lines": [{"text": "Guarde cada pagamento de taxa", "t": 33.8}]}, {"text": "4. PLANILHA", "t": 42.3, "lines": [{"text": "Universidade, prazo e status", "t": 42.6, "hl": ["status"]}]}],
  "visual": {"type": "check", "label": "CHECKLIST"}},
]
if "--cam" not in sys.argv:
    only = sys.argv[1:]
    for c in CFG:
        if only and not any(c["comp"].startswith(o) for o in only): continue
        c["signs"] = G
        r = subprocess.run(["python", D + "/aerun.py", "art.jsx", "ART", json.dumps(c, ensure_ascii=False)], capture_output=True, text=True, encoding="utf-8")
        print(c["comp"], r.stdout.strip()[:300])
    json.dump(CFG, open(D + "/art_oa_cfg.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# ---------- snappy camera shots (user 2026-10-14) ----------
def visits_of(comp):
    s = open(D + "/scripts/plan_oa.py", encoding="utf-8").read(); ns = {}
    exec(s[s.index("SEG = ["):s.index("CARDS = [")], ns)
    return sorted([(src, round(src + b - a, 3)) for (c, a, b, src) in ns["SEG"] if c == comp])
def shots_for(c):
    vis = visits_of(c["comp"]); its = c["items"]; V = c.get("visual") or {}
    if c["comp"] in ("OA1 regioes", "OA9 europa"):           # rapid list synced to the globe: title -> full picture
        t = 3.6 if c["comp"] == "OA1 regioes" else 0.9
        return [{"target": "title", "m0": 0, "m1": 0}, {"target": "overview", "m0": t, "m1": t + 0.7}], {"t0": t, "t1": t + 0.7}, 0
    sh = [{"target": "title", "m0": 0, "m1": 0}]
    if V and its[0]["t"] >= 3.0:
        sh.append({"target": "visual", "m0": 1.3, "m1": 1.85})
        if V.get("type") == "globe" and len(V["pins"]) == 1: V["pins"][0]["t"] = 1.75
    groups = []
    for i, it in enumerate(its):
        if groups and it["t"] - groups[-1]["t"] < 1.5: groups[-1]["idx"].append(i)
        else: groups.append({"t": it["t"], "idx": [i]})
    for g in groups:
        m0, m1 = g["t"] - 0.25, g["t"] + 0.3
        for vs, ve in vis:
            if vs > 0 and m0 < vs + 0.7 and m1 > vs - 0.6: m0, m1 = vs - 0.6, vs - 0.05     # jump while off screen
        if m0 < sh[-1]["m1"] + 0.05: m0 = sh[-1]["m1"] + 0.05; m1 = max(m1, m0 + 0.45)
        sh.append({"target": g["idx"], "m0": round(m0, 3), "m1": round(m1, 3)})
    # visit the visual in the first long pause (>= 4 s between card shots, same visit) if it hasn't been shown yet
    if V and not any(x["target"] == "visual" for x in sh):
        for k in range(1, len(sh) - 1):
            a, b = sh[k], sh[k + 1]
            same = any(vs <= a["m1"] and b["m0"] <= ve for vs, ve in vis)
            lines_in = any(a["m1"] < ln["t"] < b["m0"] for it in its for ln in it.get("lines", []))
            if same and not lines_in and b["m0"] - a["m1"] >= 3.5:
                sh.insert(k + 1, {"target": "visual", "m0": round(a["m1"] + 1.3, 3), "m1": round(a["m1"] + 1.85, 3)}); break
    last = max([it["t"] for it in its] + [ln["t"] for it in its for ln in it.get("lines", [])])
    ve = vis[-1][1]; r0 = round(max(last + 1.0, sh[-1]["m1"] + 0.9), 3)
    c["groups"] = [g["idx"] for g in groups]
    if ve - (r0 + 0.7) >= 1.0:                                   # time to hold: individual shots, then group
        sh.append({"target": "overview", "m0": r0, "m1": r0 + 0.7}); return sh, {"t0": r0, "t1": r0 + 0.7}, 0
    # no hold time: the LAST card shot becomes the open-up, landing as that card arrives (it flips in grouped)
    lastcue = groups[-1]["t"]; k = max(i for i, x in enumerate(sh) if not isinstance(x["target"], str) or x["target"] == "visual")
    m0 = max(sh[k - 1]["m1"] + 0.05, lastcue - 0.35); sh[k] = {"target": "overview", "m0": round(m0, 3), "m1": round(m0 + 0.7, 3)}
    del sh[k + 1:]
    return sh, {"t0": sh[k]["m0"], "t1": sh[k]["m1"]}, 0

def shots_subject(c):
    """Camera moves only to change SUBJECT (user): title shot, then one move to the full composition as the content
    starts (first card, or the first pin/visual event if earlier). Static afterwards while the frame builds."""
    its = c["items"]; V = c.get("visual") or {}
    start = min([its[0]["t"]] + [p["t"] for p in V.get("pins", [])])
    m0 = round(max(1.2, start - 0.35), 3)
    for p in V.get("pins", []):
        if p["t"] < m0 + 0.55: p["t"] = round(m0 + 0.55, 3)          # pins pop as the globe lands, never off screen
    return [{"target": "title", "m0": 0, "m1": 0}, {"target": "overview", "m0": m0, "m1": round(m0 + 0.7, 3)}], {"t0": m0, "t1": round(m0 + 0.7, 3)}, 0

if __name__ == "__main__" and "--cam" in sys.argv:
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    for c in CFG:
        if only and not any(c["comp"].startswith(o) for o in only): continue
        c["signs"] = G; c["shots"], c["reveal"], c["spread"] = shots_subject(c); c["pitch"] = 0
        print(c["comp"], "reveal", c["reveal"], [(s["target"], s["m0"]) for s in c["shots"]])
        if "--dry" in sys.argv: continue
        r = subprocess.run(["python", D + "/aerun.py", "art.jsx", "ART", json.dumps(c, ensure_ascii=False)], capture_output=True, text=True, encoding="utf-8")
        print("   ", r.stdout.strip()[:400])
    json.dump(CFG, open(D + "/art_oa_cfg.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
