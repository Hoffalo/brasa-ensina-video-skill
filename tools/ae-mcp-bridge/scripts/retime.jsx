// Rigid per-beat retime of a comp. $.global.MCP_RT = { comp: "prefix", anchors: [[oldT,newT],...] (ascending), dur: newDuration }
// Each keyframe moves by the delta of the beat region it falls in (region starts up to 1 s before the beat), so animation
// durations/eases are preserved and only the holds between beats stretch or shrink. BG layers ("Deep Royal Blue", "BG") are left alone.
(function () {
    var cfg = $.global.MCP_RT, c = null, log = [], A = cfg.anchors;
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name.indexOf(cfg.comp) === 0) c = it; }
    var B = []; for (var a = 0; a < A.length; a++) B.push(a === 0 ? -1e9 : Math.max(A[a][0] - 1.0, (A[a - 1][0] + A[a][0]) / 2));
    function map(t) { var k = 0; for (var a = 0; a < A.length; a++) if (t >= B[a] - 1e-6) k = a; return Math.max(0, t + (A[k][1] - A[k][0])); }
    var moved = 0, warn = [];
    function retimeProp(p, lname) {
        var n = p.numKeys; if (!n) return;
        var K = [];
        for (var k = 1; k <= n; k++) {
            var o = { t: p.keyTime(k), v: p.keyValue(k), ii: p.keyInInterpolationType(k), oi: p.keyOutInterpolationType(k) };
            try { o.ie = p.keyInTemporalEase(k); o.oe = p.keyOutTemporalEase(k); } catch (e) {}
            try { o.tc = p.keyTemporalContinuous(k); o.ab = p.keyTemporalAutoBezier(k); } catch (e) {}
            if (p.isSpatial) { try { o.ist = p.keyInSpatialTangent(k); o.ost = p.keyOutSpatialTangent(k); o.sc = p.keySpatialContinuous(k); o.sab = p.keySpatialAutoBezier(k); o.rv = p.keyRoving(k); } catch (e) {} }
            o.nt = map(o.t); K.push(o);
        }
        for (var q = 1; q < K.length; q++) if (K[q].nt <= K[q - 1].nt + 0.001) { warn.push(lname + "/" + p.name + " order@" + K[q].t); K[q].nt = K[q - 1].nt + 0.02; }
        var same = true; for (var s = 0; s < K.length; s++) if (Math.abs(K[s].nt - K[s].t) > 0.0005) same = false;
        if (same) return;
        for (var r = n; r >= 1; r--) p.removeKey(r);
        for (var w = 0; w < K.length; w++) p.setValueAtTime(K[w].nt, K[w].v);
        for (var x = 0; x < K.length; x++) {
            var ki = x + 1, o2 = K[x];
            try { if (o2.ie) p.setTemporalEaseAtKey(ki, o2.ie, o2.oe); } catch (e) {}
            try { p.setInterpolationTypeAtKey(ki, o2.ii, o2.oi); } catch (e) {}
            try { if (o2.tc !== undefined) { p.setTemporalContinuousAtKey(ki, o2.tc); p.setTemporalAutoBezierAtKey(ki, o2.ab); } } catch (e) {}
            if (o2.ist) { try { p.setSpatialTangentsAtKey(ki, o2.ist, o2.ost); p.setSpatialContinuousAtKey(ki, o2.sc); p.setSpatialAutoBezierAtKey(ki, o2.sab); if (o2.rv) p.setRovingAtKey(ki, true); } catch (e) {} }
        }
        moved += K.length;
    }
    function walk(g, lname) { for (var q = 1; q <= g.numProperties; q++) { var p; try { p = g.property(q); } catch (e) { continue; } if (p.propertyType === PropertyType.PROPERTY) { try { if (p.numKeys > 0) retimeProp(p, lname); } catch (e) { warn.push(lname + " " + e.toString()); } } else { try { if (p.numProperties) walk(p, lname); } catch (e) {} } } }
    c.duration = Math.max(cfg.dur, 1);
    for (var j = 1; j <= c.numLayers; j++) {
        var L = c.layer(j);
        if (/^(Deep Royal Blue|BG)/.test(L.name)) { L.outPoint = c.duration; continue; }
        walk(L, L.name);
        L.inPoint = Math.min(L.inPoint, 0); L.outPoint = c.duration;
    }
    return JSON.stringify({ status: "success", comp: c.name, dur: c.duration, keysMoved: moved, warn: warn.slice(0, 20) });
})();
