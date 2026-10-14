// Shrink entrance rises: for every layer whose first Position key coincides with an Opacity key near 0 (a fade-in),
// pull that first key toward the second so the on-screen travel is at most cfg.px (final position untouched).
// $.global.RS = {comps:[...], px:50, dry:false}
(function () {
    var cfg = $.global.RS, out = [], PX = cfg.px || 50;
    function comp(n) { for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === n) return it; } return null; }
    for (var ci = 0; ci < cfg.comps.length; ci++) {
        var c = comp(cfg.comps[ci]); if (!c) { out.push("missing " + cfg.comps[ci]); continue; }
        var moves = [];
        for (var jn = 1; jn <= c.numLayers; jn++) {
            var NL = c.layer(jn); if (!NL.nullLayer) continue;
            var np = NL.property("ADBE Transform Group").property("ADBE Position");
            for (var q = 1; q < np.numKeys; q++) if (np.keyValue(q).toString() !== np.keyValue(q + 1).toString()) moves.push([np.keyTime(q), np.keyTime(q + 1)]);
        }
        var cand = [];
        for (var j = 1; j <= c.numLayers; j++) {
            var L = c.layer(j); if (L.nullLayer || L instanceof CameraLayer) continue;
            var tg = L.property("ADBE Transform Group"), ps = tg.property("ADBE Position"), op = tg.property("ADBE Opacity");
            if (ps.dimensionsSeparated || ps.numKeys < 2 || op.numKeys < 1) continue;
            var t1 = ps.keyTime(1), t2 = ps.keyTime(2), k = op.nearestKeyIndex(t1);
            if (Math.abs(op.keyTime(k) - t1) > 0.1 || op.keyValue(k) > 10) continue;      // not a fade-in start
            var paced = false; for (var mm = 0; mm < moves.length; mm++) if (t1 < moves[mm][1] && t2 > moves[mm][0]) paced = true;
            if (paced) { out.push(c.name.substr(0, 6) + " | " + L.name.substr(0, 28) + " | kept (paced with a camera move)"); continue; }
            cand.push({ L: L, t1: t1, t2: t2 });
        }
        if (!cand.length) continue;
        var tmp = c.layers.addText("x"), sp = tmp.property("ADBE Text Properties").property("ADBE Text Document");
        for (var n = 0; n < cand.length; n++) {
            var o = cand[n], idx = o.L.index;
            sp.expression = "var L=thisComp.layer(" + idx + ");var a=L.transform.anchorPoint;var p=L.toComp(a);p[0]+','+p[1];";
            var s1 = sp.valueAtTime(o.t1, false).text.split(","), s2 = sp.valueAtTime(o.t2, false).text.split(",");
            var dx = parseFloat(s1[0]) - parseFloat(s2[0]), dy = parseFloat(s1[1]) - parseFloat(s2[1]), d = Math.sqrt(dx * dx + dy * dy);
            var ps2 = o.L.property("ADBE Transform Group").property("ADBE Position");
            if (d <= PX + 1) { out.push(c.name.substr(0, 6) + " | " + o.L.name.substr(0, 28) + " | " + Math.round(d) + "px ok"); continue; }
            var f = PX / d, v1 = ps2.keyValue(1), v2 = ps2.keyValue(2), nv = [];
            for (var z = 0; z < v1.length; z++) nv.push(v2[z] + (v1[z] - v2[z]) * f);
            if (!cfg.dry) ps2.setValueAtKey(1, nv);
            out.push(c.name.substr(0, 6) + " | " + o.L.name.substr(0, 28) + " | " + Math.round(d) + "px -> " + PX);
        }
        tmp.remove();
    }
    if (!cfg.dry) app.project.save();
    return JSON.stringify({ status: "success", o: out });
})();
