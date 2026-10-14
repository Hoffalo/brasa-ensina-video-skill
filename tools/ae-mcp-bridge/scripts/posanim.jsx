// Re-arrange elements DURING a camera move (user: "nothing is truly static"): each layer's Position animates by d
// (world units) from t0 to t1, right-skewed ease (leave: out 33, arrive: in 100), linear spatial (no drift).
// Optional camera zoom keys: zoom:{t0v, t1v} (absolute zoom values; null = keep).
// $.global.PA = {comp, t0, t1, items:[{layer, d:[dx,dy,dz]}], zoom?:{from, to}, clearZoom?:true, zoomValue?}
(function () {
    var cfg = $.global.PA, c = null, out = [];
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) c = it; }
    function find(n) { for (var j = 1; j <= c.numLayers; j++) if (c.layer(j).name === n) return c.layer(j); return null; }
    function ease(p, k0, k1) {
        var dim = 1; try { if (p.propertyValueType !== PropertyValueType.ThreeD_SPATIAL && p.propertyValueType !== PropertyValueType.TwoD_SPATIAL && p.value instanceof Array) dim = p.value.length; } catch (e) {}
        var lo = [], hi = []; for (var z = 0; z < dim; z++) { lo.push(new KeyframeEase(0, 33)); hi.push(new KeyframeEase(0, 100)); }
        p.setTemporalEaseAtKey(k0, p.keyInTemporalEase(k0), lo); p.setTemporalEaseAtKey(k1, hi, p.keyOutTemporalEase(k1));
        if (p.isSpatial) { var zt = p.value.length === 3 ? [0, 0, 0] : [0, 0]; for (var q = 0; q < 2; q++) { var kk = q ? k1 : k0; p.setSpatialAutoBezierAtKey(kk, false); p.setSpatialContinuousAtKey(kk, false); p.setSpatialTangentsAtKey(kk, zt, zt); } }
    }
    for (var a = 0; a < (cfg.items || []).length; a++) {
        var L = find(cfg.items[a].layer); if (!L) { out.push("missing " + cfg.items[a].layer); continue; }
        var p = L.property("ADBE Transform Group").property("ADBE Position"), d = cfg.items[a].d;
        var v0 = p.valueAtTime(cfg.t0, false), v1 = [v0[0] + d[0], v0[1] + d[1], (v0.length > 2 ? v0[2] + (d[2] || 0) : 0)];
        if (v0.length < 3) v1 = [v1[0], v1[1]];
        for (var k = p.numKeys; k >= 1; k--) if (p.keyTime(k) > cfg.t0 - 0.001) p.removeKey(k);
        p.setValueAtTime(cfg.t0, v0); p.setValueAtTime(cfg.t1, v1);
        ease(p, p.nearestKeyIndex(cfg.t0), p.nearestKeyIndex(cfg.t1)); out.push(L.name);
    }
    var cam = null; for (var j2 = 1; j2 <= c.numLayers; j2++) if (c.layer(j2) instanceof CameraLayer) cam = c.layer(j2);
    if (cam && (cfg.clearZoom || cfg.zoom)) {
        var zp = cam.property("ADBE Camera Options Group").property("ADBE Camera Zoom");
        if (cfg.clearZoom) { while (zp.numKeys) zp.removeKey(1); zp.setValue(cfg.zoomValue); out.push("zoom cleared"); }
        if (cfg.zoom) { zp.setValueAtTime(cfg.t0, cfg.zoom.from); zp.setValueAtTime(cfg.t1, cfg.zoom.to); ease(zp, zp.nearestKeyIndex(cfg.t0), zp.nearestKeyIndex(cfg.t1)); out.push("zoom keyed"); }
    }
    return JSON.stringify({ status: "success", o: out });
})();
