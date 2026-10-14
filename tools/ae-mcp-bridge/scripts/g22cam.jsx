// Centre the "COERÊNCIA" block (title + box) horizontally on the camera rests from 3.38s on.
(function () {
    var c; for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === "G22") c = it; }
    function L(n) { for (var j = 1; j <= c.numLayers; j++) if (c.layer(j).name === n) return c.layer(j); }
    var title = null; for (var j = 1; j <= c.numLayers; j++) if (/^\s+coer/.test(c.layer(j).name)) title = c.layer(j);
    var box = L("Box"), nul = L("Null 1");
    var tmp = c.layers.addText("x"), sp = tmp.property("ADBE Text Properties").property("ADBE Text Document");
    sp.expression = "var ids=[" + title.index + "," + box.index + "];var o=[1e9,-1e9,1e9,-1e9];for(var i=0;i<2;i++){var L=thisComp.layer(ids[i]);var r=L.sourceRectAtTime(time,false);" +
        "var a=L.toComp([r.left,r.top]),b=L.toComp([r.left+r.width,r.top+r.height]);var wa=L.toWorld([r.left,r.top]),wb=L.toWorld([r.left+r.width,r.top]);" +
        "o[0]=Math.min(o[0],a[0]);o[1]=Math.max(o[1],b[0]);o[2]=(wb[0]-wa[0])/(b[0]-a[0]);}JSON.stringify(o);";
    var b = eval(sp.valueAtTime(9.8, false).text); tmp.remove();
    var dW = ((b[0] + b[1]) / 2 - c.width / 2) * b[2];
    var p = nul.property("ADBE Transform Group").property("ADBE Position"), n = 0;
    for (var k = 1; k <= p.numKeys; k++) { if (p.keyTime(k) < 3.3) continue; var v = p.keyValue(k); v[0] += dW; p.setValueAtKey(k, v); n++; }
    return JSON.stringify({ status: "success", log: ["block screen x " + Math.round(b[0]) + "-" + Math.round(b[1]) + ", camera keys shifted " + Math.round(dW) + " (" + n + " keys)"] });
})();
