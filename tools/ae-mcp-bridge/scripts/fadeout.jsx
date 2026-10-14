// $.global.MCP_FADE = { comp, names: [...regex strings], t0, t1 } -> opacity to 0 between t0 and t1 (keeps earlier keys)
(function () {
    var cfg = $.global.MCP_FADE, c = null, log = [];
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) c = it; }
    for (var j = 1; j <= c.numLayers; j++) {
        var L = c.layer(j), hit = false;
        for (var n = 0; n < cfg.names.length; n++) if (new RegExp(cfg.names[n]).test(L.name)) hit = true;
        if (!hit) continue;
        var op = L.property("ADBE Transform Group").property("ADBE Opacity");
        for (var k = op.numKeys; k >= 1; k--) if (op.keyTime(k) > cfg.t0 - 0.001) op.removeKey(k);
        var v0 = op.valueAtTime(cfg.t0, false);
        op.setValueAtTime(cfg.t0, v0); op.setValueAtTime(cfg.t1, 0);
        var a = op.nearestKeyIndex(cfg.t0), b = op.nearestKeyIndex(cfg.t1);
        op.setTemporalEaseAtKey(a, [new KeyframeEase(0, 33.33)], [new KeyframeEase(0, 33.33)]);
        op.setTemporalEaseAtKey(b, [new KeyframeEase(0, 100)], [new KeyframeEase(0, 16.67)]);
        L.outPoint = Math.max(cfg.t1, L.inPoint + 0.01) ;
        log.push(L.name + " fades " + cfg.t0 + "-" + cfg.t1);
    }
    return JSON.stringify({ status: "success", log: log });
})();
