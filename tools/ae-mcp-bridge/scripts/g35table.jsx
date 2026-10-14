// Restyle the G35 "Ano 1 / Ano 2" table so its border matches the content boxes (4 px yellow, 22 px rounding, same glow).
(function () {
    var c; for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === "G35") c = it; }
    var sh = null, box = null;
    for (var j = 1; j <= c.numLayers; j++) { var L = c.layer(j); if (L instanceof ShapeLayer && L.name === "Shape Layer 1") sh = L; if (L instanceof ShapeLayer && L.name === "Box 1") box = L; }
    var root = sh.property("ADBE Root Vectors Group"), log = [];
    for (var g = 1; g <= root.numProperties; g++) {
        var grp = root.property(g), vc = grp.property("ADBE Vectors Group");
        for (var k = 1; k <= vc.numProperties; k++) {
            var p = vc.property(k);
            if (p.matchName === "ADBE Vector Graphic - Stroke") { p.property("ADBE Vector Stroke Width").setValue(4); p.property("ADBE Vector Stroke Color").setValue([1, 0.8, 0.01]); }
            if (p.matchName === "ADBE Vector Shape - Rect") {
                var sz = p.property("ADBE Vector Rect Size").value;
                if (sz[0] > 50 && sz[1] > 50) { p.property("ADBE Vector Rect Roundness").setValue(22); log.push(grp.name + " outer border rounded"); }
            }
        }
    }
    // same glow as the boxes
    var fx = sh.property("ADBE Effect Parade"), has = false;
    for (var f = 1; f <= fx.numProperties; f++) if (fx.property(f).matchName === "ADBE Glo2") has = true;
    if (!has && box) {
        var src = null, bfx = box.property("ADBE Effect Parade");
        for (var f2 = 1; f2 <= bfx.numProperties; f2++) if (bfx.property(f2).matchName === "ADBE Glo2") src = bfx.property(f2);
        if (src) {
            var ng = fx.addProperty("ADBE Glo2"); src = null;
            for (var f3 = 1; f3 <= bfx.numProperties; f3++) if (bfx.property(f3).matchName === "ADBE Glo2") src = bfx.property(f3);
            for (var q = 1; q <= src.numProperties; q++) { try { var sp = src.property(q); if (sp.propertyValueType !== PropertyValueType.NO_VALUE && sp.propertyValueType !== PropertyValueType.CUSTOM_VALUE) fx.property(fx.numProperties).property(q).setValue(sp.value); } catch (e) {} }
            log.push("glow copied from Box 1");
        }
    }
    return JSON.stringify({ status: "success", log: log });
})();
