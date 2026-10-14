// Rebuild G29's camera rests so each rest frames one whole "Pergunta" section (title + box) inside the safe margins.
// Keys keep their timing; each section keeps its original 3-step pull-back (A closest -> C widest), all inside margins.
(function () {
    var MX = 120, MY = 90, STEP = [1.0, 1.06, 1.12];
    var comp = null;
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === "G29") comp = it; }
    function L(n) { for (var j = 1; j <= comp.numLayers; j++) if (comp.layer(j).name === n) return comp.layer(j); return null; }
    function worldBox(layers) {
        var tmp = comp.layers.addText("x"), idx = [];
        for (var k = 0; k < layers.length; k++) idx.push(layers[k].index);
        var sp = tmp.property("ADBE Text Properties").property("ADBE Text Document");
        sp.expression = "var ids=[" + idx.join(",") + "];var o=[];for(var i=0;i<ids.length;i++){var Ly=thisComp.layer(ids[i]);var r=Ly.sourceRectAtTime(time,false);" +
            "var c=[[r.left,r.top],[r.left+r.width,r.top+r.height]];for(var j=0;j<2;j++){var w=Ly.toWorld(c[j]);o.push([w[0],w[1],w[2]]);}}JSON.stringify(o);";
        var pts = eval(sp.valueAtTime(20, false).text); tmp.remove();
        var b = { minX: 1e9, maxX: -1e9, minY: 1e9, maxY: -1e9, z: 0 };
        for (var q = 0; q < pts.length; q++) { b.minX = Math.min(b.minX, pts[q][0]); b.maxX = Math.max(b.maxX, pts[q][0]); b.minY = Math.min(b.minY, pts[q][1]); b.maxY = Math.max(b.maxY, pts[q][1]); b.z += pts[q][2] / pts.length; }
        return b;
    }
    var cam = L("Camera"), nul = L("Null 1");
    var zoom = cam.property("ADBE Camera Options Group").property("ADBE Camera Zoom").value;
    var camLocal = cam.property("ADBE Transform Group").property("ADBE Position").value;
    var frames = [], log = [];
    for (var s = 1; s <= 3; s++) {
        var b = worldBox([L("Pergunta " + s), L("Box " + s)]);
        var w = b.maxX - b.minX, h = b.maxY - b.minY;
        var r = Math.max(w / (comp.width - 2 * MX), h / (comp.height - 2 * MY));
        var d = r * zoom;
        frames.push({ cx: (b.minX + b.maxX) / 2, cy: (b.minY + b.maxY) / 2, z: b.z, d: d, w: w });
        log.push("section " + s + " block " + Math.round(w) + "x" + Math.round(h) + " centre " + Math.round(frames[s - 1].cx) + "," + Math.round(frames[s - 1].cy) + " dist " + Math.round(d));
    }
    // identical framing for every section (same distance and height) so the three Perguntas match exactly
    var dMax = 0, cyAvg = 0;
    for (var e = 0; e < 3; e++) { dMax = Math.max(dMax, frames[e].d); cyAvg += frames[e].cy / 3; }
    for (var e2 = 0; e2 < 3; e2++) { frames[e2].d = dMax; frames[e2].cy = cyAvg; }
    // neighbours must stay out of view at the widest rest
    for (var n = 0; n < 2; n++) {
        var vis = comp.width * frames[n].d * STEP[2] / zoom, gap = frames[n + 1].cx - frames[n].cx;
        log.push("spacing " + (n + 1) + "->" + (n + 2) + ": " + Math.round(gap) + " (needs > " + Math.round((vis + frames[n + 1].w) / 2) + ")");
    }
    var pos = nul.property("ADBE Transform Group").property("ADBE Position");
    // original key layout (by index): section per key and framing step A/B/C (0/1/2) -- fixed so re-runs are stable
    var SEC = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2], STP = [0, 1, 1, 2, 2, 0, 0, 1, 1, 2, 2, 0, 0, 1, 1, 2, 2, 2];
    for (var k2 = 1; k2 <= pos.numKeys; k2++) {
        var si = SEC[k2 - 1], fi = STP[k2 - 1];
        var F = frames[si], dd = F.d * STEP[fi];
        pos.setValueAtKey(k2, [F.cx - camLocal[0], F.cy - camLocal[1], (F.z - dd) - camLocal[2]]);
    }
    log.push("updated " + pos.numKeys + " camera keys");
    return JSON.stringify({ status: "success", log: log });
})();
