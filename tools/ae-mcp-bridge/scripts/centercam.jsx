// Centre the visible content vertically (and optionally horizontally) at a camera rest by moving the Null's key(s).
// $.global.MCP_CC = { comp, t, keys: [keyTime, ...] (Null position keys of that rest), x: false }
(function () {
    var cfg = $.global.MCP_CC, c = null;
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) c = it; }
    function isContent(L) {
        if (!L.enabled || L instanceof CameraLayer || L instanceof LightLayer) return false;
        if (/^(Null|Deep Royal Blue|Adjustment)/.test(L.name) || L.adjustmentLayer || L.nullLayer) return false;
        if (L instanceof TextLayer && /^\s*$/.test(L.property("ADBE Text Properties").property("ADBE Text Document").value.text)) return false;
        return true;
    }
    var nul = null; for (var n = 1; n <= c.numLayers; n++) if (c.layer(n).nullLayer && /^Null 1/.test(c.layer(n).name)) nul = c.layer(n);
    var idx = []; for (var j = 1; j <= c.numLayers; j++) if (isContent(c.layer(j))) idx.push(j);
    var tmp = c.layers.addText("x"), sp = tmp.property("ADBE Text Properties").property("ADBE Text Document");
    sp.expression = "var ids=[" + idx.join(",").replace(/\d+/g, function (n) { return String(parseInt(n, 10) + 1); }) + "];var o=[1e9,1e9,-1e9,-1e9];" +
        "for(var i=0;i<ids.length;i++){var L=thisComp.layer(ids[i]);if(L.opacity<1)continue;var r=L.sourceRectAtTime(time,false);if(r.width<1)continue;" +
        "var c=[[r.left,r.top],[r.left+r.width,r.top],[r.left,r.top+r.height],[r.left+r.width,r.top+r.height]];var q=[1e9,1e9,-1e9,-1e9];" +
        "for(var j=0;j<4;j++){var p=L.toComp(c[j]);q[0]=Math.min(q[0],p[0]);q[1]=Math.min(q[1],p[1]);q[2]=Math.max(q[2],p[0]);q[3]=Math.max(q[3],p[1]);}" +
        "var vis=Math.max(0,Math.min(q[2],thisComp.width)-Math.max(q[0],0))*Math.max(0,Math.min(q[3],thisComp.height)-Math.max(q[1],0));var area=(q[2]-q[0])*(q[3]-q[1]);" +
        "if(area<=0||vis/area<0.3)continue;" +
        "o[0]=Math.min(o[0],q[0]);o[1]=Math.min(o[1],q[1]);o[2]=Math.max(o[2],q[2]);o[3]=Math.max(o[3],q[3]);}JSON.stringify(o);";
    var pos = nul.property("ADBE Transform Group").property("ADBE Position");
    function shift(dx, dy) { for (var a = 0; a < cfg.keys.length; a++) { var k = pos.nearestKeyIndex(cfg.keys[a]); var v = pos.keyValue(k); v[0] += dx; v[1] += dy; pos.setValueAtKey(k, v); } }
    var b0 = eval(sp.valueAtTime(cfg.t, false).text);
    shift(100, 100); var b1 = eval(sp.valueAtTime(cfg.t, false).text); shift(-100, -100);
    var sy = ((b0[1] + b0[3]) - (b1[1] + b1[3])) / 2 / 100, sx = ((b0[0] + b0[2]) - (b1[0] + b1[2])) / 2 / 100; // px per world unit
    var dyPx = (b0[1] + b0[3]) / 2 - c.height / 2, dxPx = cfg.x ? (b0[0] + b0[2]) / 2 - c.width / 2 : 0;
    shift(sx ? dxPx / sx : 0, dyPx / sy);
    var b2 = eval(sp.valueAtTime(cfg.t, false).text);
    tmp.remove();
    return JSON.stringify({ status: "success", before: b0, after: b2, moved: [Math.round(dxPx / (sx || 1)), Math.round(dyPx / sy)] });
})();
