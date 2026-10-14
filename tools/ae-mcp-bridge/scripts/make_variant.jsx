// Duplicate a template comp and re-purpose it: new texts, each layer's animation shifted rigidly to its own cue,
// camera Null/zoom keys remapped explicitly.
// $.global.MCP_VAR = { src: "G46", name: "G49 - ...", dur: s, layers: [{p: "prefix", text: "...", start: s}], keyMap: [[curT,newT],...] }
(function () {
    var cfg = $.global.MCP_VAR, src = null, log = [];
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && (it.name === cfg.src || (!src && it.name.indexOf(cfg.src) === 0))) src = it; }
    var c;
    if (cfg.inPlace) { c = src; if (cfg.dur) c.duration = cfg.dur; }
    else {
        for (var i2 = app.project.numItems; i2 >= 1; i2--) { var o = app.project.item(i2); if (o instanceof CompItem && o.name === cfg.name) { o.remove(); log.push("removed old " + cfg.name); } }
        c = src.duplicate(); c.name = cfg.name; c.duration = cfg.dur;
    }
    function keysOf(p, arr) { var K = []; for (var k = 1; k <= p.numKeys; k++) { var o = { t: p.keyTime(k), v: p.keyValue(k), ii: p.keyInInterpolationType(k), oi: p.keyOutInterpolationType(k) }; try { o.ie = p.keyInTemporalEase(k); o.oe = p.keyOutTemporalEase(k); } catch (e) {} if (p.isSpatial) { try { o.ist = p.keyInSpatialTangent(k); o.ost = p.keyOutSpatialTangent(k); } catch (e) {} } K.push(o); } return K; }
    function rewrite(p, K) {
        for (var r = p.numKeys; r >= 1; r--) p.removeKey(r);
        K.sort(function (a, b) { return a.nt - b.nt; });
        for (var q = 1; q < K.length; q++) if (K[q].nt <= K[q - 1].nt + 0.001) K[q].nt = K[q - 1].nt + 0.02;
        for (var w = 0; w < K.length; w++) p.setValueAtTime(Math.max(0, K[w].nt), K[w].v);
        for (var x = 0; x < K.length; x++) { try { if (K[x].ie) p.setTemporalEaseAtKey(x + 1, K[x].ie, K[x].oe); } catch (e) {} try { p.setInterpolationTypeAtKey(x + 1, K[x].ii, K[x].oi); } catch (e) {} if (K[x].ist) { try { p.setSpatialTangentsAtKey(x + 1, K[x].ist, K[x].ost); } catch (e) {} } }
    }
    function eachKeyed(L, fn) { (function walk(g) { for (var q = 1; q <= g.numProperties; q++) { var p; try { p = g.property(q); } catch (e) { continue; } if (p.propertyType === PropertyType.PROPERTY) { try { if (p.numKeys > 0) fn(p); } catch (e) {} } else { try { if (p.numProperties) walk(p); } catch (e) {} } } })(L); }
    function isSrcText(p) { return p.matchName === "ADBE Text Document"; }
    var done = {};
    function layerByPrefix(pfx) { var j; for (j = 1; j <= c.numLayers; j++) if (!done[c.layer(j).id] && c.layer(j).name === pfx) return c.layer(j); for (j = 1; j <= c.numLayers; j++) if (!done[c.layer(j).id] && c.layer(j).name.indexOf(pfx) === 0) return c.layer(j); return null; }
    for (var a = 0; a < cfg.layers.length; a++) {
        var D = cfg.layers[a], L = layerByPrefix(D.p);
        if (!L) { log.push("MISSING " + D.p); continue; }
        if (D.text !== undefined && L instanceof TextLayer) {
            var tp = L.property("ADBE Text Properties").property("ADBE Text Document"), doc = tp.numKeys ? tp.keyValue(tp.numKeys) : tp.value;
            while (tp.numKeys) tp.removeKey(1);
            doc.text = D.text; tp.setValue(doc);
        }
        if (D.start !== undefined) {
            var first = 1e9; eachKeyed(L, function (p) { if (!isSrcText(p)) first = Math.min(first, p.keyTime(1)); });
            if (first < 1e9) { var dt = D.start - first; eachKeyed(L, function (p) { if (isSrcText(p)) return; var K = keysOf(p); for (var z = 0; z < K.length; z++) K[z].nt = K[z].t + dt; rewrite(p, K); }); }
        }
        if (D.text !== undefined) L.name = D.text.substr(0, 30);
        if (D.show) { L.enabled = true; L.name = L.name.replace(/^\[off\] /, ''); }
        if (D.hide) { L.enabled = false; L.name = (L.name.indexOf('[off] ')===0?'':'[off] ') + L.name; }
        done[L.id] = 1;
    }
    // camera rig keys: explicit time map
    var M = cfg.keyMap || [[0, 0]];
    if (cfg.inPlace && !cfg.keyMap) M = null;
    function mapT(t) { var best = M[0], bd = 1e9; for (var m = 0; m < M.length; m++) { var d = Math.abs(M[m][0] - t); if (d < bd) { bd = d; best = M[m]; } } return best[1] + (t - best[0]); }
    for (var j2 = 1; j2 <= c.numLayers; j2++) {
        var L2 = c.layer(j2);
        if (M && (L2.nullLayer || L2 instanceof CameraLayer)) eachKeyed(L2, function (p) { var K = keysOf(p); for (var z = 0; z < K.length; z++) K[z].nt = mapT(K[z].t); rewrite(p, K); });
        if (!/^(Deep Royal Blue|BG)/.test(L2.name)) { L2.inPoint = 0; } L2.outPoint = c.duration;
    }
    return JSON.stringify({ status: "success", comp: c.name, log: log });
})();
