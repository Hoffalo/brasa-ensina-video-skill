// Test on a throwaway duplicate: can boxText be set and can per-char styles be kept?
(function () {
    var o = {};
    var comp = null;
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === "G5 Copy 5") { comp = it; break; } }
    var src = comp.layer(5); // "ou já fez os exames..." (has yellow words)
    var dup = src.duplicate();
    try {
        var prop = dup.property("ADBE Text Properties").property("ADBE Text Document");
        var doc = prop.value;
        o.before = { box: doc.boxText, runsColor: String(doc.characterRange(3, 5).fillColor) + "/" + String(doc.characterRange(10, 11).fillColor) };
        try { doc.boxText = true; o.setBox = "ok"; } catch (e) { o.setBox = String(e); }
        try { doc.boxTextSize = [1000, 200]; o.setSize = "ok"; } catch (e) { o.setSize = String(e); }
        try { doc.justification = ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT; o.setJust = "ok"; } catch (e) { o.setJust = String(e); }
        prop.setValue(doc);
        var d2 = prop.value;
        o.after = { box: d2.boxText, size: d2.boxText ? String(d2.boxTextSize) : null, just: d2.justification, runsColor: String(d2.characterRange(3, 5).fillColor) + "/" + String(d2.characterRange(10, 11).fillColor) };
        // writable char range?
        try { var cr = d2.characterRange(0, 2); cr.font = "Lato-Bold"; o.crWrite = "ok:" + d2.characterRange(0, 1).font; } catch (e) { o.crWrite = String(e); }
        o.methods = [];
        for (var k in doc) { if (typeof doc[k] === "function") o.methods.push(k); }
    } catch (e) { o.err = String(e) + " line " + e.line; }
    dup.remove();
    return JSON.stringify(o);
})();
