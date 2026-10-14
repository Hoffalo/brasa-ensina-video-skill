import json
hide = ["Box MENSALIDADE", "MENSALIDADE", "€0", "[off] só uma taxa", "Box CUSTO DE VIDA", "CUSTO DE VIDA", "US$ 600–900/mês",
        "Slot detalhe", "Box CONTA BLOQUEADA", "CONTA BLOQUEADA", "Mais ou menos", "€11.900/ano", "Sperrkonto · exigida pro visto",
        "MENSALIDADE ZERO", "NÃO É CUSTO ZERO", "Significa ter dinheiro"]
cfg = {"src": "G46 - Alemanha (Claude)", "name": "G51b - Planilha (Claude)", "dur": 14.24,
       "layers": [{"p": h, "hide": True} for h in hide] + [
           {"p": "ALEMANHA", "text": "PLANILHA", "start": 0.3},
           {"p": "Referência em ensino público d", "text": "Com 4 blocos, pra você se organizar", "start": 1.2}],
       "keyMap": [[0.06, 0.06], [0.71, 0.71], [39.44, 30], [40.14, 30.7], [48.78, 31]]}
json.dump(cfg, open("var_G51b.json", "w", encoding="utf-8"), ensure_ascii=False)
S = 280.6
t = lambda x: round(x - S, 2)
tb = {"comp": "G51b - Planilha (Claude)", "base": "Sem contar aluguel", "x": 240, "y": 420, "w": 1240, "rh": 88, "split": 620, "tBox": t(283.5),
      "rows": [{"label": "Matrícula", "value": "R$ ______", "t": t(284.44)},
               {"label": "Custo de vida", "value": "R$ ______", "t": t(285.08)},
               {"label": "Custo de instalação", "value": "R$ ______", "t": t(286.02)},
               {"label": "Moradia", "value": "R$ ______", "t": t(287.68)},
               {"label": "× Câmbio atual", "value": "Cotação do dia", "t": t(288.6), "yellow": True, "thick": True},
               {"label": "= TOTAL", "value": "COMPARE ESTE", "t": t(291.6), "fill": True, "font": "Hagrid-Extrabold", "vfont": "Hagrid-Extrabold"}],
      "note": {"text": "Não só o valor isolado da mensalidade", "t": t(292.5)}}
open("_tb.jsx", "w", encoding="ascii").write("$.global.TB=" + json.dumps(tb, ensure_ascii=True) + ";$.evalFile(new File($.fileName).parent.fsName+\"/build_table.jsx\");")
print("ok")
