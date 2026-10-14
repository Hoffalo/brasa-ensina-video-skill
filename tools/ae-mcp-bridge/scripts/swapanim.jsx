// Animated text swap (no hard cuts): old layer animates out at t (0.3 s: fade + rise), a duplicate with the new text animates in
// (0.42 s: fade + rise from below). $.global.SW = {comp, layer, oldText, newText, t, dy (px, default 24)}
(function () {
    var cfg = $.global.SW, c = null, out = [];
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) c = it; }
    var L = null; for (var j = 1; j <= c.numLayers; j++) if (c.layer(j).name === cfg.layer) L = c.layer(j);
    if (!L) return JSON.stringify({ status: "error", message: "no layer " + cfg.layer });
    var tp = L.property("ADBE Text Properties").property("ADBE Text Document");
    var doc = tp.numKeys ? tp.keyValue(1) : tp.value; while (tp.numKeys) tp.removeKey(1);
    doc.text = cfg.oldText; tp.setValue(doc);
    var N = L.duplicate(); N.name = cfg.newText.substr(0, 30);
    var np = N.property("ADBE Text Properties").property("ADBE Text Document"), nd = np.value; nd.text = cfg.newText; np.setValue(nd);
    var dy = cfg.dy || 24, t = cfg.t;
    function slide(layer, t0, d, o0, o1, y0, y1) {
        var fx = layer.property("ADBE Effect Parade").addProperty("ADBE Geometry2"); fx.name = "Swap";
        var an = fx.property(1).value, pos = fx.property(2);
        pos.setValueAtTime(t0, [an[0], an[1] + y0]); pos.setValueAtTime(t0 + d, [an[0], an[1] + y1]);
        var op = fx.property(9); op.setValueAtTime(t0, o0); op.setValueAtTime(t0 + d, o1);
        var props = [pos, op];
        for (var q = 0; q < props.length; q++) { var p = props[q]; var dim = p === pos ? 2 : 1, a = [], b = [];
            for (var z = 0; z < dim; z++) { a.push(new KeyframeEase(0, 16.67)); b.push(new KeyframeEase(0, 100)); }
            try { p.setTemporalEaseAtKey(1, a, a); p.setTemporalEaseAtKey(2, b, b); } catch (e) {} }
    }
    // old: hold, then out; hide the rest of the time after the swap via its own opacity key (effect opacity handles it)
    slide(L, t - 0.3, 0.3, 100, 0, 0, -dy);
    slide(N, t, 0.42, 0, 100, dy, 0);
    // the new layer must not show before t: its Swap opacity is 0 until t (first key) -> fine
    out.push(L.name + " -> " + N.name + " @" + t);
    return JSON.stringify({ status: "success", o: out });
})();
