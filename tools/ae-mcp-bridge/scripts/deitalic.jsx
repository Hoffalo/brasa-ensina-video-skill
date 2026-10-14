// Swap Italic fonts for their upright cut in every text layer of a comp, in place (positions/justification untouched).
// $.global.MCP_DEIT = "comp name"
(function () {
    var c = null, out = [];
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === $.global.MCP_DEIT) c = it; }
    function up(f) { var cands = [f.replace(/-?Italic$/i, "-Regular"), f.replace(/Italic$/i, ""), f.replace(/Italic/i, "")]; for (var k = 0; k < cands.length; k++) { var x = cands[k].replace(/-$/, ""); try { if (app.fonts.getFontsByPostScriptName(x).length) return x; } catch (e) {} } return f; }
    for (var j = 1; j <= c.numLayers; j++) {
        var L = c.layer(j); if (!(L instanceof TextLayer)) continue;
        var p = L.property("ADBE Text Properties").property("ADBE Text Document");
        if (p.numKeys > 0) { for (var kk = 1; kk <= p.numKeys; kk++) { var dk = p.keyValue(kk), ch = false; for (var q = 0; q < dk.text.length; q++) { var r = dk.characterRange(q, q + 1); if (/Italic/i.test(r.font)) { r.font = up(r.font); ch = true; } } if (ch) { p.setValueAtKey(kk, dk); out.push(L.name + " key" + kk); } } continue; }
        var d = p.value, changed = false;
        for (var q2 = 0; q2 < d.text.length; q2++) { var r2 = d.characterRange(q2, q2 + 1); if (/Italic/i.test(r2.font)) { r2.font = up(r2.font); changed = true; } }
        if (changed) { p.setValue(d); out.push(L.name); }
    }
    return JSON.stringify({ status: "success", o: out });
})();
