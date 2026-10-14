// During a phase, centre left-aligned text groups on a column axis (so a one-column block looks centred), then animate
// each group back to its left-aligned layout between t0 and t1. Offsets via a "Centrar" Transform effect (comp-pixel space).
// $.global.CP = {comp, ref: "layer whose screen centre x is the axis", groups: [[names...],...], t: measure time, t0, t1}
(function () {
    var cfg = $.global.CP, c = null, out = [];
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) c = it; }
    function L(n) { for (var j = 1; j <= c.numLayers; j++) if (c.layer(j).name === n) return c.layer(j); return null; }
    function cx(lays) {
        var tmp = c.layers.addText("x"), sp = tmp.property("ADBE Text Properties").property("ADBE Text Document"), idx = [];
        for (var k = 0; k < lays.length; k++) idx.push(lays[k].index);
        sp.expression = "var ids=[" + idx.join(",") + "],a=1e9,b=-1e9;for(var i=0;i<ids.length;i++){var L=thisComp.layer(ids[i]);var r=L.sourceRectAtTime(time,false);var p=L.toComp([r.left,r.top]),q=L.toComp([r.left+r.width,r.top]);a=Math.min(a,p[0]);b=Math.max(b,q[0]);}((a+b)/2).toString();";
        var v = parseFloat(sp.valueAtTime(cfg.t, false).text); tmp.remove(); return v;
    }
    var axis = cx([L(cfg.ref)]);
    for (var g = 0; g < cfg.groups.length; g++) {
        var lays = []; for (var n = 0; n < cfg.groups[g].length; n++) { var x = L(cfg.groups[g][n]); if (x) lays.push(x); else out.push("missing " + cfg.groups[g][n]); }
        if (!lays.length) continue;
        var off = axis - cx(lays);
        for (var m = 0; m < lays.length; m++) {
            var fx = lays[m].property("ADBE Effect Parade").addProperty("ADBE Geometry2"); fx.name = "Centrar";
            var an = fx.property(1).value, pos = fx.property(2);
            pos.setValueAtTime(cfg.t0, [an[0] + off, an[1]]); pos.setValueAtTime(cfg.t1, [an[0], an[1]]);
            try { pos.setTemporalEaseAtKey(1, [new KeyframeEase(0, 33.33)], [new KeyframeEase(0, 33.33)]); pos.setTemporalEaseAtKey(2, [new KeyframeEase(0, 100)], [new KeyframeEase(0, 16.67)]); } catch (e) {}
        }
        out.push(cfg.groups[g].join("+") + " off=" + Math.round(off));
    }
    return JSON.stringify({ status: "success", axis: axis, o: out });
})();
