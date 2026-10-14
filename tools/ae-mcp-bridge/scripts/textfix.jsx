// Small text/camera fixes. $.global.TF = {ops:[{comp, layer ("#idx" or name), do:"upper"|"font"|"text"|"dof"|"remove"|"lower1", font?, text?, keepRuns?}]}
// "font" keeps per-character colours (re-applies them after the font change).
(function () {
    var cfg = $.global.TF, out = [];
    function comp(n) { for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === n) return it; } return null; }
    for (var a = 0; a < cfg.ops.length; a++) {
        var o = cfg.ops[a];
        try {
            var c = comp(o.comp); if (!c) throw new Error("no comp");
            if (o["do"] === "dof") { for (var j = 1; j <= c.numLayers; j++) if (c.layer(j) instanceof CameraLayer) c.layer(j).property("ADBE Camera Options Group").property("ADBE Camera Depth of Field").setValue(0); out.push(o.comp + " dof off"); continue; }
            var L = null; if (o.layer.charAt(0) === "#") L = c.layer(parseInt(o.layer.substr(1), 10)); else for (var j2 = 1; j2 <= c.numLayers; j2++) if (c.layer(j2).name === o.layer) L = c.layer(j2);
            if (!L) throw new Error("no layer " + o.layer);
            if (o["do"] === "remove") { L.remove(); out.push(o.comp + " removed " + o.layer); continue; }
            var tp = L.property("ADBE Text Properties").property("ADBE Text Document"); if (tp.numKeys) throw new Error("keyed text");
            var d = tp.value, txt = d.text, cols = [];
            for (var k = 0; k < txt.length; k++) { try { cols.push(d.characterRange(k, k + 1).fillColor); } catch (e) { cols.push(null); } }
            if (o["do"] === "upper") d.text = txt.toUpperCase();
            if (o["do"] === "text") d.text = o.text;
            if (o.font) d.font = o.font;
            try { d.fontCapsOption = FontCapsOption.FONT_NORMAL_CAPS; } catch (e) {}
            tp.setValue(d);
            if (d.text.length === txt.length) { d = tp.value; for (var k2 = 0; k2 < cols.length; k2++) if (cols[k2]) { try { d.characterRange(k2, k2 + 1).fillColor = cols[k2]; } catch (e) {} } tp.setValue(d); }
            out.push(o.comp + " | " + L.name + " -> " + tp.value.text.replace(/[\r\n]/g, " / ") + " [" + tp.value.font + "]");
        } catch (e) { out.push("ERR " + o.comp + " " + o.layer + " " + e.toString()); }
    }
    app.project.save();
    return JSON.stringify({ status: "success", o: out });
})();
