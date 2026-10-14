// Re-pad the continuation layer so "confiar" starts right after "para " now that both are Lato.
(function () {
    var c; for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === "G25") c = it; }
    var A = null, B = null;
    for (var j = 1; j <= c.numLayers; j++) { var L = c.layer(j); if (!(L instanceof TextLayer)) continue; var t = L.property("ADBE Text Properties").property("ADBE Text Document").value.text;
        if (/^O que essa pessoa/.test(t)) A = L; if (/confiar/i.test(t) && /^\s*[\r\u0003]?\s*confiar/i.test(t)) B = L; }
    var da = A.property("ADBE Text Properties").property("ADBE Text Document").value, db0 = B.property("ADBE Text Properties").property("ADBE Text Document").value;
    var tmp = c.layers.addText("x"), tp = tmp.property("ADBE Text Properties").property("ADBE Text Document");
    function right(str) { var d = tp.value; d.text = str; d.font = "Lato-Regular"; d.fontSize = da.fontSize; d.tracking = da.tracking; d.justification = ParagraphJustification.LEFT_JUSTIFY; tp.setValue(d); var r = tmp.sourceRectAtTime(0, false); return r.left + r.width; }
    var target = right("para x"), best = 0, bd = 1e9;
    for (var n = 1; n < 40; n++) { var sp = ""; for (var k = 0; k < n; k++) sp += " "; var dd = Math.abs(right(sp + "x") - target); if (dd < bd) { bd = dd; best = n; } }
    tmp.remove();
    var prop = B.property("ADBE Text Properties").property("ADBE Text Document"), d2 = prop.value, old = d2.text;
    var m = old.match(/^([\r\u0003]?)( *)(.*)$/);
    var pad = ""; for (var q = 0; q < best; q++) pad += " ";
    // rebuild run styles: keep per-character attributes by re-applying the first non-space char's style to the new spaces
    var nt = m[1] + pad + m[3];
    var cr0 = d2.characterRange(m[1].length + m[2].length, m[1].length + m[2].length + 1);
    var st = { font: cr0.font, fontSize: cr0.fontSize, fillColor: cr0.fillColor };
    var runs = []; for (var z = m[1].length + m[2].length; z < old.length; z++) { var cz = d2.characterRange(z, z + 1); runs.push({ font: cz.font, fillColor: cz.fillColor, fontSize: cz.fontSize }); }
    var just = d2.justification, box = d2.boxText ? d2.boxTextSize : null;
    d2.text = nt; d2.justification = just; if (box) d2.boxTextSize = box;
    var off = m[1].length + pad.length;
    for (var u = 0; u < runs.length; u++) { var cu = d2.characterRange(off + u, off + u + 1); cu.font = runs[u].font; cu.fillColor = runs[u].fillColor; cu.fontSize = runs[u].fontSize; }
    prop.setValue(d2);
    return JSON.stringify({ status: "success", log: ["spaces " + m[2].length + " -> " + best + " (err " + Math.round(bd) + "px)"] });
})();
