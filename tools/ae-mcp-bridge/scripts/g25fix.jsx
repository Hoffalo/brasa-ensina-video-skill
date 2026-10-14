(function () {
    var c; for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === "G25") c = it; }
    var B = null; for (var j = 1; j <= c.numLayers; j++) { var L = c.layer(j); if (L instanceof TextLayer && /onfiar no meu/.test(L.property("ADBE Text Properties").property("ADBE Text Document").value.text)) B = L; }
    var prop = B.property("ADBE Text Properties").property("ADBE Text Document"), d = prop.value, old = d.text;
    var m = old.match(/^([\r\u0003]?)( *)(.*)$/), drop = $.global.MCP_DROP || 0;
    var runs = []; for (var z = m[1].length + m[2].length; z < old.length; z++) { var cz = d.characterRange(z, z + 1); runs.push({ font: cz.font, fillColor: cz.fillColor, fontSize: cz.fontSize }); }
    var pad = drop >= 0 ? m[2].substr(0, Math.max(1, m[2].length - drop)) : m[2] + "          ".substr(0, -drop);
    var body = m[3].charAt(0).toLowerCase() + m[3].substr(1);
    var just = d.justification, box = d.boxTextSize;
    d.text = m[1] + pad + body; d.justification = just; d.boxTextSize = box;
    var off = m[1].length + pad.length;
    for (var u = 0; u < runs.length; u++) { var cu = d.characterRange(off + u, off + u + 1); cu.font = runs[u].font; cu.fillColor = runs[u].fillColor; cu.fontSize = runs[u].fontSize; }
    prop.setValue(d);
    return JSON.stringify({ status: "success", log: ["spaces " + m[2].length + " -> " + pad.length + ", text '" + body.substr(0, 12) + "'"] });
})();
