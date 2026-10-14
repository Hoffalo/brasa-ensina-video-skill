(function () {
    function C(n) { for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === n) return it; } }
    function r(v) { return Math.round(v * 10) / 10; }
    var o = {};
    var g = C("G29"), nul = g.layer("Null 1"), p = nul.property("ADBE Transform Group").property("ADBE Position"), ks = [];
    for (var k = 1; k <= p.numKeys; k++) { var v = p.keyValue(k); ks.push(r(p.keyTime(k)) + " : " + r(v[0]) + ", " + r(v[1]) + ", " + r(v[2])); }
    o.g29null = ks;
    o.g29nullScale = String(nul.property("ADBE Transform Group").property("ADBE Scale").value);
    var cam = g.layer("Camera");
    o.g29cam = "zoom=" + cam.property("ADBE Camera Options Group").property("ADBE Camera Zoom").value + " pos=" + String(cam.property("ADBE Transform Group").property("ADBE Position").value) + " autoOrient=" + cam.autoOrient;
    o.g29layers = [];
    for (var j = 1; j <= g.numLayers; j++) { var L = g.layer(j); var pv = L.property("ADBE Transform Group").property("ADBE Position"); var vv = pv.numKeys ? pv.keyValue(pv.numKeys) : pv.value; o.g29layers.push(j + " " + L.name.substr(0, 22) + " pos=" + r(vv[0]) + "," + r(vv[1]) + "," + r(vv[2] || 0) + (pv.numKeys ? " (keyed)" : "")); }
    var c = C("G35"), sh = null;
    for (var q = 1; q <= c.numLayers; q++) if (c.layer(q) instanceof ShapeLayer && c.layer(q).name === "Shape Layer 1") sh = c.layer(q);
    o.g35pos = String(sh.property("ADBE Transform Group").property("ADBE Position").value) + " sc=" + String(sh.property("ADBE Transform Group").property("ADBE Scale").value) + " 3d=" + sh.threeDLayer;
    var out = [];
    function walk(gp, d) {
        for (var i = 1; i <= gp.numProperties; i++) {
            var qq = gp.property(i), pad = ""; for (var z = 0; z < d; z++) pad += "  ";
            var s = pad + qq.name + " [" + qq.matchName + "]";
            try { if (qq.propertyType === PropertyType.PROPERTY && qq.propertyValueType !== PropertyValueType.NO_VALUE && qq.propertyValueType !== PropertyValueType.CUSTOM_VALUE && qq.propertyValueType !== PropertyValueType.SHAPE) s += " = " + String(qq.value).substr(0, 60); } catch (e) {}
            out.push(s);
            if (qq.propertyType !== PropertyType.PROPERTY && d < 6 && qq.matchName !== "ADBE Vector Transform Group") walk(qq, d + 1);
        }
    }
    walk(sh.property("ADBE Root Vectors Group"), 0);
    o.g35shape = out;
    o.g35masks = sh.property("ADBE Mask Parade").numProperties;
    return JSON.stringify(o);
})();
