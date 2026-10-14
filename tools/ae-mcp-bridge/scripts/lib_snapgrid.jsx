// Snap four cards (number + text) to a clean 2x2 grid on one depth plane.
// $.global.MCP_SNAP = { comp: name, cards: [[numIdx, textIdx] x4 in order TL, TR, BL, BR], equalGap: bool }
(function () {
    var cfg = $.global.MCP_SNAP, log = [];
    var comp = null;
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) { comp = it; break; } }
    // remove boxes first so the configured indices are valid
    for (var xi = comp.numLayers; xi >= 1; xi--) { var X = comp.layer(xi); if (X instanceof ShapeLayer && /^Box( \d+)?$/.test(X.name)) X.remove(); }

    function worldRects(layers) {
        var tmp = comp.layers.addText("x"), ids = [];
        for (var i = 0; i < layers.length; i++) ids.push(layers[i].index);
        var sp = tmp.property("ADBE Text Properties").property("ADBE Text Document");
        sp.expression = "var ids=[" + ids.join(",") + "];var o=[];for(var i=0;i<ids.length;i++){var L=thisComp.layer(ids[i]);var r=L.sourceRectAtTime(time,false);" +
            "var a=L.toWorld([r.left,r.top]),b=L.toWorld([r.left+r.width,r.top+r.height]);o.push([a[0],a[1],b[0],b[1],a[2]]);}JSON.stringify(o);";
        var res = eval(sp.valueAtTime(0, false).text);
        tmp.remove();
        var out = [];
        for (var k = 0; k < res.length; k++) out.push({ l: Math.min(res[k][0], res[k][2]), t: Math.min(res[k][1], res[k][3]), r: Math.max(res[k][0], res[k][2]), b: Math.max(res[k][1], res[k][3]), z: res[k][4] });
        return out;
    }
    function move(L, dx, dy, dz) {
        var p = L.property("ADBE Transform Group").property("ADBE Position");
        function sh(v) { return [v[0] + dx, v[1] + dy, v[2] + dz]; }
        if (p.numKeys) { for (var k = 1; k <= p.numKeys; k++) p.setValueAtKey(k, sh(p.keyValue(k))); } else p.setValue(sh(p.value));
    }

    var nums = [], texts = [];
    for (var c = 0; c < 4; c++) { nums.push(comp.layer(cfg.cards[c][0])); texts.push(comp.layer(cfg.cards[c][1])); }
    var nr = worldRects(nums), tr = worldRects(texts);

    // shared internal card layout
    var maxNumH = 0, gapNT = 0, cw = 0, chText = 0, zs = 0;
    for (c = 0; c < 4; c++) {
        maxNumH = Math.max(maxNumH, nr[c].b - nr[c].t);
        gapNT += (tr[c].t - nr[c].b) / 4;
        cw = Math.max(cw, nr[c].r - nr[c].l, tr[c].r - tr[c].l);
        chText = Math.max(chText, tr[c].b - tr[c].t);
        zs += (nr[c].z + tr[c].z) / 8;
    }
    var ch = maxNumH + gapNT + chText;
    var O = [], cx = 0, cy = 0;
    for (c = 0; c < 4; c++) { O.push({ x: Math.min(nr[c].l, tr[c].l), y: nr[c].t }); cx += (O[c].x + cw / 2) / 4; cy += (O[c].y + ch / 2) / 4; }
    var gx = ((O[1].x + O[3].x) - (O[0].x + O[2].x)) / 2 - cw;
    var gy = ((O[2].y + O[3].y) - (O[0].y + O[1].y)) / 2 - ch;
    if (cfg.equalGap) { gx = gy = (gx + gy) / 2; }
    var colX = [cx - gx / 2 - cw, cx + gx / 2], rowY = [cy - gy / 2 - ch, cy + gy / 2];

    for (c = 0; c < 4; c++) {
        var tx = colX[c % 2], ty = rowY[c < 2 ? 0 : 1];
        var dnx = tx - nr[c].l, dny = ty - nr[c].t, dnz = zs - nr[c].z;
        var dtx = tx - tr[c].l, dty = (ty + maxNumH + gapNT) - tr[c].t, dtz = zs - tr[c].z;
        move(nums[c], dnx, dny, dnz); move(texts[c], dtx, dty, dtz);
        log.push("card " + (c + 1) + " num d=" + [Math.round(dnx), Math.round(dny), Math.round(dnz)].join(",") + " text d=" + [Math.round(dtx), Math.round(dty), Math.round(dtz)].join(","));
    }
    log.push("gaps x=" + Math.round(gx) + " y=" + Math.round(gy) + " z=" + Math.round(zs));
    return JSON.stringify({ status: "success", log: log });
})();
