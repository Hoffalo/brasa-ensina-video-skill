// Pull the camera back (lower zoom) so all visible content stays inside safe margins at the given times.
// Perspective projection scales every 3D layer's screen offset from the frame centre by the zoom factor, so one
// factor k fits everything; 2D layers in the comp are scaled about the centre by the same k to stay in sync.
// $.global.MCP_FIT = { comp, times: [...], mx: 100, my: 80 }
(function () {
    var cfg = $.global.MCP_FIT, MX = cfg.mx || 100, MY = cfg.my || 80;
    var c = null;
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) c = it; }
    function isContent(L) {
        if (!L.enabled || L instanceof CameraLayer || L instanceof LightLayer) return false;
        if (/^(Null|Deep Royal Blue|Adjustment)/.test(L.name) || L.adjustmentLayer || L.nullLayer) return false;
        if (L instanceof TextLayer && /^\s*$/.test(L.property("ADBE Text Properties").property("ADBE Text Document").value.text)) return false;
        return true;
    }
    var idx = [];
    for (var j = 1; j <= c.numLayers; j++) if (isContent(c.layer(j))) idx.push(j);
    var tmp = c.layers.addText("x");
    var sp = tmp.property("ADBE Text Properties").property("ADBE Text Document");
    sp.expression = "var ids=[" + idx.join(",").replace(/\d+/g, function (n) { return String(parseInt(n, 10) + 1); }) + "];var o=[1e9,1e9,-1e9,-1e9];" +
        "for(var i=0;i<ids.length;i++){var L=thisComp.layer(ids[i]);if(L.opacity<1)continue;var r=L.sourceRectAtTime(time,false);if(r.width<1)continue;" +
        "var c=[[r.left,r.top],[r.left+r.width,r.top],[r.left,r.top+r.height],[r.left+r.width,r.top+r.height]];var q=[1e9,1e9,-1e9,-1e9];" +
        "for(var j=0;j<4;j++){var p=L.toComp(c[j]);q[0]=Math.min(q[0],p[0]);q[1]=Math.min(q[1],p[1]);q[2]=Math.max(q[2],p[0]);q[3]=Math.max(q[3],p[1]);}" +
        "var vis=Math.max(0,Math.min(q[2],thisComp.width)-Math.max(q[0],0))*Math.max(0,Math.min(q[3],thisComp.height)-Math.max(q[1],0));var area=(q[2]-q[0])*(q[3]-q[1]);" +
        "if(area<=0||vis/area<0.5)continue;" +
        "o[0]=Math.min(o[0],q[0]);o[1]=Math.min(o[1],q[1]);o[2]=Math.max(o[2],q[2]);o[3]=Math.max(o[3],q[3]);}JSON.stringify(o);";
    var cx = c.width / 2, cy = c.height / 2, k = 1, log = [];
    for (var t = 0; t < cfg.times.length; t++) {
        var b = eval(sp.valueAtTime(cfg.times[t], false).text);
        var fx = (cx - MX) / Math.max(cx - b[0], b[2] - cx, 1), fy = (cy - MY) / Math.max(cy - b[1], b[3] - cy, 1);
        k = Math.min(k, fx, fy);
        log.push("t=" + cfg.times[t] + " bounds " + [Math.round(b[0]), Math.round(b[1]), Math.round(b[2]), Math.round(b[3])].join(","));
    }
    tmp.remove();
    if (k < 0.999) {
        var cams = 0;
        for (var j2 = 1; j2 <= c.numLayers; j2++) {
            var L2 = c.layer(j2);
            if (L2 instanceof CameraLayer) {
                var z = L2.property("ADBE Camera Options Group").property("ADBE Camera Zoom");
                if (cfg.keyFrom) { // animate the zoom only from this camera move on: [startTime, endTime]
                    var z0 = z.numKeys ? z.valueAtTime(cfg.keyFrom[0], false) : z.value, z1 = z.numKeys ? z.valueAtTime(cfg.keyFrom[1], false) : z.value;
                    var hold = cfg.holdTo || cfg.keyFrom[1];
                    z.setValueAtTime(cfg.keyFrom[0], z0);
                    if (z.nearestKeyIndex(cfg.keyFrom[1]) < 1 || Math.abs(z.keyTime(z.nearestKeyIndex(cfg.keyFrom[1])) - cfg.keyFrom[1]) > 0.01) z.setValueAtTime(cfg.keyFrom[1], z1);
                    // the whole rest (keyFrom[1] .. holdTo) gets the new zoom
                    for (var hk = 1; hk <= z.numKeys; hk++) if (z.keyTime(hk) > cfg.keyFrom[1] - 0.01 && z.keyTime(hk) < hold + 0.01) z.setValueAtKey(hk, z.keyValue(hk) * k);
                    var a1 = z.nearestKeyIndex(cfg.keyFrom[0]), a2 = z.nearestKeyIndex(cfg.keyFrom[1]);
                    z.setTemporalEaseAtKey(a1, [new KeyframeEase(0, 33.33)], [new KeyframeEase(0, 33.33)]);
                    z.setTemporalEaseAtKey(a2, [new KeyframeEase(0, 100)], [new KeyframeEase(0, 16.67)]);
                    cams++; continue;
                }
                if (z.numKeys) { for (var kk = 1; kk <= z.numKeys; kk++) z.setValueAtKey(kk, z.keyValue(kk) * k); } else z.setValue(z.value * k);
                cams++;
            } else if (!L2.threeDLayer && isContent(L2) && !L2.parent) {
                // 2D content: scale about the frame centre
                var tg = L2.property("ADBE Transform Group"), pp = tg.property("ADBE Position"), sc = tg.property("ADBE Scale");
                function sp2(v) { return [cx + (v[0] - cx) * k, cy + (v[1] - cy) * k].concat(v.length > 2 ? [v[2]] : []); }
                if (pp.numKeys) { for (var a = 1; a <= pp.numKeys; a++) pp.setValueAtKey(a, sp2(pp.keyValue(a))); } else pp.setValue(sp2(pp.value));
                function ss(v) { return [v[0] * k, v[1] * k].concat(v.length > 2 ? [v[2]] : []); }
                if (sc.numKeys) { for (var b2 = 1; b2 <= sc.numKeys; b2++) sc.setValueAtKey(b2, ss(sc.keyValue(b2))); } else sc.setValue(ss(sc.value));
                log.push("2D layer scaled: " + L2.name);
            }
        }
        log.push("zoom x" + Math.round(k * 1000) / 1000 + " on " + cams + " camera(s)");
    } else log.push("already inside margins");
    return JSON.stringify({ status: "success", log: log });
})();
