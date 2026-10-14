// $.global.MCP_PFX = { comp, items: [[layerIndex, "1. "], ...], removeLayer: idx } -> prepend yellow numbers to item texts
(function () {
    var cfg = $.global.MCP_PFX, c = null, out = [], YEL = [1, 0.8, 0.01];
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) c = it; }
    var Ls = []; for (var a = 0; a < cfg.items.length; a++) Ls.push([c.layer(cfg.items[a][0]), cfg.items[a][1]]);
    var rm = cfg.removeLayer ? c.layer(cfg.removeLayer) : null;
    for (var b = 0; b < Ls.length; b++) {
        var L = Ls[b][0], pf = Ls[b][1], p = L.property("ADBE Text Properties").property("ADBE Text Document"), d = p.value;
        var cr0 = d.characterRange(0, 1), f = cr0.font, fs = cr0.fontSize, fc = cr0.fillColor, n = d.text.length;
        var st = []; for (var q = 0; q < n; q++) { var r = d.characterRange(q, q + 1); st.push([r.font, r.fontSize, r.fillColor]); }
        d.text = pf + d.text; p.setValue(d); d = p.value;
        var r0 = d.characterRange(0, pf.length); r0.font = f.replace(/-?Italic$/, "-Regular"); r0.fontSize = fs; r0.fillColor = YEL;
        for (var q2 = 0; q2 < n; q2++) { var r2 = d.characterRange(q2 + pf.length, q2 + pf.length + 1); r2.font = st[q2][0]; r2.fontSize = st[q2][1]; r2.fillColor = st[q2][2]; }
        p.setValue(d); L.name = p.value.text.substr(0, 30); out.push(L.name);
    }
    if (rm) { out.push("removed " + rm.name); rm.remove(); }
    return JSON.stringify({ status: "success", o: out });
})();
