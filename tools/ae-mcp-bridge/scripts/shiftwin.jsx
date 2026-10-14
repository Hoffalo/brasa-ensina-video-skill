// Shift the keys of a layer that fall inside [from, to] by dt (all keyed properties). Keeps temporal eases, interpolation
// types and spatial tangents (camera nulls must stay linear / zero tangents). layer "@null" = the first Null layer.
// $.global.SWN = {comp, layers:[...], from, to, dt}
(function () {
    var cfg = $.global.SWN, c = null, out = [];
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) c = it; }
    function find(n) { for (var j = 1; j <= c.numLayers; j++) { var L = c.layer(j); if (n === "@null" ? L.nullLayer : L.name === n) return L; } return null; }
    for (var a = 0; a < cfg.layers.length; a++) {
        var L = find(cfg.layers[a]); if (!L) { out.push("missing " + cfg.layers[a]); continue; }
        (function walk(g) {
            for (var q = 1; q <= g.numProperties; q++) {
                var p; try { p = g.property(q); } catch (e) { continue; }
                if (p.propertyType !== PropertyType.PROPERTY) { walk(p); continue; }
                if (!p.numKeys) continue;
                var ks = [], sp = p.isSpatial;
                for (var k = 1; k <= p.numKeys; k++) {
                    var o = { t: p.keyTime(k), v: p.keyValue(k), ie: p.keyInTemporalEase(k), oe: p.keyOutTemporalEase(k), ii: p.keyInInterpolationType(k), oi: p.keyOutInterpolationType(k) };
                    if (sp) { o.ti = p.keyInSpatialTangent(k); o.to = p.keyOutSpatialTangent(k); o.ab = p.keySpatialAutoBezier(k); o.cn = p.keySpatialContinuous(k); }
                    if (o.t >= cfg.from - 0.001 && o.t <= cfg.to + 0.001) o.t += cfg.dt;
                    ks.push(o);
                }
                while (p.numKeys) p.removeKey(1);
                for (var m = 0; m < ks.length; m++) {
                    var n = p.addKey(ks[m].t); p.setValueAtKey(n, ks[m].v);
                    try { p.setInterpolationTypeAtKey(n, ks[m].ii, ks[m].oi); p.setTemporalEaseAtKey(n, ks[m].ie, ks[m].oe); } catch (e) {}
                    if (sp) { try { p.setSpatialAutoBezierAtKey(n, ks[m].ab); p.setSpatialContinuousAtKey(n, ks[m].cn); p.setSpatialTangentsAtKey(n, ks[m].ti, ks[m].to); } catch (e) {} }
                }
                out.push(L.name + "/" + p.name + " " + ks.length);
            }
        })(L);
    }
    return JSON.stringify({ status: "success", o: out });
})();
