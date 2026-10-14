// Screen + world bounds of layers at given times (through the 3D camera).
// $.global.BB = {comp, t:[...], layers:[names or "#idx"] (omit = all visible content)}
// returns {t: {name: {s:[l,t,r,b] screen px, w:[l,t,r,b] world, z, k: world units per screen px, op, o:[x,y] screen of layer origin (text baseline)}}}
(function () {
    var cfg = $.global.BB, c = null;
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) c = it; }
    if (!c) return JSON.stringify({ status: "error", message: "no comp" });
    function find(n) { if (n.charAt(0) === "#") return c.layer(parseInt(n.substr(1), 10)); for (var j = 1; j <= c.numLayers; j++) if (c.layer(j).name === n) return c.layer(j); return null; }
    var L = [];
    if (cfg.layers) { for (var a = 0; a < cfg.layers.length; a++) { var x = find(cfg.layers[a]); if (x) L.push(x); } }
    else for (var j = 1; j <= c.numLayers; j++) {
        var y = c.layer(j);
        if (!y.enabled || y instanceof CameraLayer || y.nullLayer || /^(Deep Royal Blue|Adjustment)/.test(y.name)) continue;
        if (y instanceof TextLayer && /^\s*$/.test(y.property("ADBE Text Properties").property("ADBE Text Document").value.text)) continue;
        L.push(y);
    }
    var ids = []; for (var b = 0; b < L.length; b++) ids.push(L[b].index + 1);
    var names = []; for (var b2 = 0; b2 < L.length; b2++) names.push(L[b2].name);
    var tmp = c.layers.addText("x"), sp = tmp.property("ADBE Text Properties").property("ADBE Text Document");
    sp.expression = "var ids=[" + ids.join(",") + "];var o=[];for(var i=0;i<ids.length;i++){var L=thisComp.layer(ids[i]);var r=L.sourceRectAtTime(time,false);" +
        "var c=[[r.left,r.top],[r.left+r.width,r.top],[r.left,r.top+r.height],[r.left+r.width,r.top+r.height]];var q=[];" +
        "for(var j=0;j<4;j++){var w=L.toWorld(c[j]);var s=L.toComp(c[j]);q.push([w[0],w[1],(w.length>2?w[2]:0),s[0],s[1]]);}" +
        "var op=1;try{op=L.opacity.value;}catch(e){}var og=L.toComp([0,0]);o.push([q,op,[og[0],og[1]]]);}JSON.stringify(o);";
    var out = {};
    for (var k = 0; k < cfg.t.length; k++) {
        var res = eval(sp.valueAtTime(cfg.t[k], false).text), m = {};
        for (var n = 0; n < res.length; n++) {
            var q = res[n][0], s = [1e9, 1e9, -1e9, -1e9], w = [1e9, 1e9, -1e9, -1e9], z = 0;
            for (var u = 0; u < 4; u++) {
                s[0] = Math.min(s[0], q[u][3]); s[2] = Math.max(s[2], q[u][3]); s[1] = Math.min(s[1], q[u][4]); s[3] = Math.max(s[3], q[u][4]);
                w[0] = Math.min(w[0], q[u][0]); w[2] = Math.max(w[2], q[u][0]); w[1] = Math.min(w[1], q[u][1]); w[3] = Math.max(w[3], q[u][1]); z += q[u][2] / 4;
            }
            var sw = s[2] - s[0];
            for (var r = 0; r < 4; r++) { s[r] = Math.round(s[r]); w[r] = Math.round(w[r] * 10) / 10; }
            m[names[n]] = { s: s, w: w, z: Math.round(z), k: sw > 0.5 ? Math.round((w[2] - w[0]) / sw * 1000) / 1000 : 0, op: Math.round(res[n][1]), o: [Math.round(res[n][2][0] * 10) / 10, Math.round(res[n][2][1] * 10) / 10] };
        }
        out[String(cfg.t[k])] = m;
    }
    tmp.remove();
    return JSON.stringify({ status: "success", r: out });
})();
