// Single-line bullets: widen the paragraph box so a capitalised word can't force a wrap.
(function () {
    var c; for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === "G33") c = it; }
    var log = [];
    for (var j = 1; j <= c.numLayers; j++) {
        var L = c.layer(j); if (!(L instanceof TextLayer)) continue;
        var p = L.property("ADBE Text Properties").property("ADBE Text Document"), d = p.value;
        if (!d.boxText || !/^- (Quantas|Com quem|Como você)/.test(d.text)) continue;
        var before = L.sourceRectAtTime(10, false);
        d.boxTextSize = [d.boxTextSize[0] + 200, d.boxTextSize[1]]; p.setValue(d);
        var after = L.sourceRectAtTime(10, false);
        var a = L.property("ADBE Transform Group").property("ADBE Anchor Point"), v = a.value; v[0] += after.left - before.left; v[1] += after.top - before.top; a.setValue(v);
        log.push(L.name + " h " + Math.round(before.height) + " -> " + Math.round(after.height));
    }
    return JSON.stringify({ status: "success", log: log });
})();
