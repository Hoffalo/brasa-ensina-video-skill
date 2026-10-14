// Static boxed cards: Hagrid title ALL CAPS, yellow card style (yellow text + yellow stroke), box resized to keep the
// original padding around the (wider) uppercase text; empty Lato Italic leftovers removed.
// $.global.MCP_CARDS = ["G17", ...]
(function () {
    var YEL = [1, 0.8, 0.0078431372549], log = [];
    var names = "|" + $.global.MCP_CARDS.join("|") + "|";
    for (var i = 1; i <= app.project.numItems; i++) {
        var c = app.project.item(i); if (!(c instanceof CompItem) || names.indexOf("|" + c.name + "|") < 0) continue;
        var title = null, shape = null;
        for (var j = c.numLayers; j >= 1; j--) {
            var L = c.layer(j);
            if (L instanceof TextLayer) {
                var d = L.property("ADBE Text Properties").property("ADBE Text Document").value;
                if (/^\s*$/.test(d.text)) { L.remove(); continue; } // empty leftover layers
                if (/^Hagrid/i.test(d.font)) title = L;
            } else if (L instanceof ShapeLayer) shape = L;
        }
        if (!title || !shape) { log.push(c.name + ": skipped (no title/box)"); continue; }
        var t = c.duration / 2;
        var tp = title.property("ADBE Text Properties").property("ADBE Text Document"), td = tp.value;
        var before = title.sourceRectAtTime(t, false);
        td.fontCapsOption = FontCapsOption.FONT_ALL_CAPS;
        td.applyFill = true; td.fillColor = YEL;
        tp.setValue(td);
        var after = title.sourceRectAtTime(t, false);
        // resize the rect(s) by the change in text width/height, keep stroke yellow
        var dw = after.width - before.width, dh = after.height - before.height;
        (function walk(g) {
            for (var k = 1; k <= g.numProperties; k++) {
                var p = g.property(k);
                if (p.matchName === "ADBE Vector Shape - Rect") { var sz = p.property("ADBE Vector Rect Size"), v = sz.value; sz.setValue([v[0] + dw, v[1] + dh]); }
                else if (p.matchName === "ADBE Vector Graphic - Stroke") p.property("ADBE Vector Stroke Color").setValue(YEL);
                else if (p.matchName === "ADBE Vector Graphic - Fill") { /* keep */ }
                if (p.propertyType !== PropertyType.PROPERTY && p.numProperties) walk(p);
            }
        })(shape.property("ADBE Root Vectors Group"));
        // keep the title centred in the box: centre-justified point text grows symmetrically; re-centre vertically
        var a2 = title.sourceRectAtTime(t, false), an = title.property("ADBE Transform Group").property("ADBE Anchor Point"), av = an.value;
        av[1] += (a2.top + a2.height / 2) - (before.top + before.height / 2); an.setValue(av);
        log.push(c.name + ": '" + td.text.replace(/[\r\u0003]/g, " ") + "' caps+yellow, box +" + Math.round(dw) + "x" + Math.round(dh));
    }
    return JSON.stringify({ status: "success", log: log });
})();
