// Speed up slow fade-in entrances: move the END key of the entrance (Position key 2 + the Opacity key that finishes
// the fade) closer to the start key. Only when it makes sense:
//   - duration > cfg.maxd (already-quick entrances are left alone)
//   - the entrance does not overlap a camera (Null) move in the same comp (those are paced with the move)
// $.global.SP = {comps:[...], maxd:0.5, d:0.4, dry:true}
(function () {
    var cfg = $.global.SP, out = [], MAXD = cfg.maxd || 0.5, D = cfg.d || 0.4;
    function comp(n) { for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === n) return it; } return null; }
    function moveKey(p, k, nt) {
        var v = p.keyValue(k), ie = p.keyInTemporalEase(k), oe = p.keyOutTemporalEase(k), ii = p.keyInInterpolationType(k), oi = p.keyOutInterpolationType(k);
        var si = null, so = null; try { if (p.isSpatial) { si = p.keyInSpatialTangent(k); so = p.keyOutSpatialTangent(k); } } catch (e) {}
        p.removeKey(k); var n = p.addKey(nt); p.setValueAtKey(n, v);
        try { p.setInterpolationTypeAtKey(n, ii, oi); p.setTemporalEaseAtKey(n, ie, oe); if (si) p.setSpatialTangentsAtKey(n, si, so); } catch (e) {}
    }
    for (var ci = 0; ci < cfg.comps.length; ci++) {
        var c = comp(cfg.comps[ci]); if (!c) continue;
        var moves = [];
        for (var j = 1; j <= c.numLayers; j++) {
            var N = c.layer(j); if (!N.nullLayer) continue;
            var np = N.property("ADBE Transform Group").property("ADBE Position");
            for (var q = 1; q < np.numKeys; q++) if (np.keyValue(q).toString() !== np.keyValue(q + 1).toString()) moves.push([np.keyTime(q), np.keyTime(q + 1)]);
        }
        for (var j2 = 1; j2 <= c.numLayers; j2++) {
            var L = c.layer(j2); if (L.nullLayer || L instanceof CameraLayer) continue;
            var tg = L.property("ADBE Transform Group"), ps = tg.property("ADBE Position"), op = tg.property("ADBE Opacity");
            if (ps.dimensionsSeparated || ps.numKeys < 2 || op.numKeys < 2) continue;
            var t1 = ps.keyTime(1), t2 = ps.keyTime(2), ko = op.nearestKeyIndex(t1);
            if (Math.abs(op.keyTime(ko) - t1) > 0.1 || op.keyValue(ko) > 10) continue;            // not a fade-in
            var d = t2 - t1, tag = c.name.substr(0, 6) + " | " + L.name.substr(0, 28) + " | " + Math.round(d * 100) / 100 + "s";
            if (d <= MAXD + 0.01) { out.push(tag + " ok (already quick)"); continue; }
            var inMove = false; for (var m = 0; m < moves.length; m++) if (t1 < moves[m][1] && t2 > moves[m][0]) inMove = true;
            if (inMove) { out.push(tag + " kept (paced with a camera move)"); continue; }
            // opacity key that ends the fade: first key after ko that reaches >= 99
            var ke = -1; for (var k = ko + 1; k <= op.numKeys; k++) if (op.keyValue(k) >= 99) { ke = k; break; }
            if (!cfg.dry) {
                var nt = t1 + D;
                if (ps.numKeys >= 3 && ps.keyTime(3) <= nt + 0.02) { out.push(tag + " kept (next key too close)"); continue; }
                moveKey(ps, 2, nt);
                if (ke > 0 && op.keyTime(ke) > nt) {
                    var ot = Math.max(op.keyTime(ko) + 0.05, nt);
                    if (!(ke < op.numKeys && op.keyTime(ke + 1) <= ot + 0.02)) moveKey(op, ke, ot);
                }
            }
            out.push(tag + " -> " + D + "s");
        }
    }
    if (!cfg.dry) app.project.save();
    return JSON.stringify({ status: "success", o: out });
})();
