// Read-only dump of target comps: layers, text styling, transforms, keyframes, shapes.
(function () {
    var TARGETS = $.global.MCP_INSPECT || ["G1 Copy 4", "G1 Copy 5", "G1 Copy 6", "G5 Copy 2", "G5 Copy 3", "G5 Copy 4", "G5 Copy 5",
                   "G12", "G17", "G18", "G20", "g16 copy 2", "g16 copy 3"];

    function r(n) { return Math.round(n * 100) / 100; }
    function rv(v) { if (v instanceof Array) { var o = []; for (var i = 0; i < v.length; i++) o.push(r(v[i])); return o; } return (typeof v === "number") ? r(v) : v; }
    function justName(j) {
        var m = {}; m[ParagraphJustification.LEFT_JUSTIFY] = "LEFT"; m[ParagraphJustification.CENTER_JUSTIFY] = "CENTER";
        m[ParagraphJustification.RIGHT_JUSTIFY] = "RIGHT"; m[ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT] = "FULL_LAST_LEFT";
        m[ParagraphJustification.FULL_JUSTIFY_LASTLINE_RIGHT] = "FULL_LAST_RIGHT"; m[ParagraphJustification.FULL_JUSTIFY_LASTLINE_CENTER] = "FULL_LAST_CENTER";
        m[ParagraphJustification.FULL_JUSTIFY_LASTLINE_FULL] = "FULL_ALL";
        return m[j] || String(j);
    }
    function propKeys(p) {
        if (!p || !p.numKeys) return null;
        var ks = [];
        for (var k = 1; k <= p.numKeys; k++) {
            var e = { t: r(p.keyTime(k)), v: rv(p.keyValue(k)) };
            try { e.inI = p.keyInInterpolationType(k); e.outI = p.keyOutInterpolationType(k); var ie = p.keyInTemporalEase(k)[0], oe = p.keyOutTemporalEase(k)[0]; e.ease = [r(ie.influence), r(oe.influence)]; } catch (x) {}
            ks.push(e);
        }
        return ks;
    }
    function walkShapes(grp, out, depth) {
        for (var i = 1; i <= grp.numProperties; i++) {
            var p = grp.property(i);
            var e = { n: p.name, m: p.matchName };
            if (p.matchName === "ADBE Vector Shape - Rect") { e.size = rv(p.property("ADBE Vector Rect Size").value); e.round = r(p.property("ADBE Vector Rect Roundness").value); var sk = propKeys(p.property("ADBE Vector Rect Size")); if (sk) e.sizeKeys = sk; }
            if (p.matchName === "ADBE Vector Graphic - Stroke") { e.color = rv(p.property("ADBE Vector Stroke Color").value); e.width = r(p.property("ADBE Vector Stroke Width").value); e.opacity = r(p.property("ADBE Vector Stroke Opacity").value); }
            if (p.matchName === "ADBE Vector Graphic - Fill") { e.color = rv(p.property("ADBE Vector Fill Color").value); e.opacity = r(p.property("ADBE Vector Fill Opacity").value); }
            if (p.matchName === "ADBE Vector Filter - Trim") { e.endKeys = propKeys(p.property("ADBE Vector Trim End")); e.startKeys = propKeys(p.property("ADBE Vector Trim Start")); }
            if (p.propertyType !== PropertyType.PROPERTY && depth < 6 && p.matchName !== "ADBE Vector Transform Group") {
                e.c = []; walkShapes(p, e.c, depth + 1); if (!e.c.length) delete e.c;
            }
            out.push(e);
        }
    }
    function textInfo(layer, comp) {
        var doc = layer.property("ADBE Text Properties").property("ADBE Text Document").value;
        var t = { text: doc.text, font: doc.font, style: doc.fontStyle, size: r(doc.fontSize), fauxItalic: doc.fauxItalic, fauxBold: doc.fauxBold,
                  just: justName(doc.justification), box: doc.boxText, fill: (function(){ try { return doc.applyFill ? rv(doc.fillColor) : "none"; } catch (e) { return "none"; } })(), tracking: doc.tracking, leading: doc.autoLeading ? "auto" : r(doc.leading) };
        if (doc.boxText) { t.boxSize = rv(doc.boxTextSize); try { t.boxPos = rv(doc.boxTextPos); } catch (x) {} }
        // style runs (AE 24.3+)
        try {
            var runs = [], prev = null, start = 0, len = doc.text.length;
            for (var c = 0; c <= len; c++) {
                var key = null;
                if (c < len) { var cr = doc.characterRange(c, c + 1); key = cr.font + "|" + cr.fontStyle + "|" + cr.fauxItalic + "|" + r(cr.fontSize); }
                if (key !== prev) { if (prev !== null) runs.push({ s: start, e: c, k: prev, txt: doc.text.substring(start, c) }); prev = key; start = c; }
            }
            if (runs.length > 1) t.runs = runs;
        } catch (x) { t.runsErr = String(x); }
        var src = layer.property("ADBE Text Properties").property("ADBE Text Document");
        if (src.numKeys) t.srcKeys = src.numKeys;
        if (src.expressionEnabled) t.srcExpr = src.expression;
        var anim = layer.property("ADBE Text Properties").property("ADBE Text Animators");
        if (anim && anim.numProperties) { t.animators = []; for (var a = 1; a <= anim.numProperties; a++) t.animators.push(anim.property(a).name); }
        var rect = layer.sourceRectAtTime(layer.inPoint + 2, false);
        t.rectAt = { l: r(rect.left), t: r(rect.top), w: r(rect.width), h: r(rect.height) };
        return t;
    }

    var out = { comps: [] };
    for (var ti = 0; ti < TARGETS.length; ti++) {
        var comp = null;
        for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === TARGETS[ti]) { comp = it; break; } }
        if (!comp) { out.comps.push({ name: TARGETS[ti], missing: true }); continue; }
        var c = { name: comp.name, id: comp.id, dur: r(comp.duration), layers: [] };
        for (var li = 1; li <= comp.numLayers; li++) {
            var L = comp.layer(li);
            var e = { i: li, name: L.name, inP: r(L.inPoint), outP: r(L.outPoint), on: L.enabled };
            if (L.parent) e.parent = L.parent.index;
            if (L.hasTrackMatte) e.matte = String(L.trackMatteType);
            try { if (L.isTrackMatte) e.isMatte = true; } catch (x) {}
            if (L instanceof TextLayer) e.type = "text";
            else if (L instanceof ShapeLayer) e.type = "shape";
            else if (L instanceof AVLayer) e.type = L.source ? (L.source instanceof CompItem ? "precomp:" + L.source.name : "av:" + L.source.name) : "av";
            else e.type = "other";
            if (L.adjustmentLayer) e.adj = true;
            var tr = L.property("ADBE Transform Group");
            e.tf = {};
            var names = [["ADBE Anchor Point", "anc"], ["ADBE Position", "pos"], ["ADBE Scale", "scl"], ["ADBE Rotate Z", "rot"], ["ADBE Opacity", "op"]];
            for (var n = 0; n < names.length; n++) {
                var p = tr.property(names[n][0]);
                if (!p) continue;
                if (p.numKeys) e.tf[names[n][1] + "K"] = propKeys(p); else e.tf[names[n][1]] = rv(p.value);
                if (p.expressionEnabled) e.tf[names[n][1] + "X"] = p.expression;
            }
            if (tr.property("ADBE Position").dimensionsSeparated) {
                e.tf.posSep = { x: propKeys(tr.property("ADBE Position_0")) || r(tr.property("ADBE Position_0").value), y: propKeys(tr.property("ADBE Position_1")) || r(tr.property("ADBE Position_1").value) };
            }
            var fx = L.property("ADBE Effect Parade");
            if (fx && fx.numProperties) { e.fx = []; for (var f = 1; f <= fx.numProperties; f++) e.fx.push(fx.property(f).matchName); }
            var masks = L.property("ADBE Mask Parade");
            if (masks && masks.numProperties) e.masks = masks.numProperties;
            if (e.type === "text") e.text = textInfo(L, comp);
            if (e.type === "shape") { e.shapes = []; walkShapes(L.property("ADBE Root Vectors Group"), e.shapes, 0); }
            c.layers.push(e);
        }
        out.comps.push(c);
    }
    var f = new File(Folder.myDocuments.fsName + "/ae-mcp-bridge/inspect_out.json");
    f.encoding = "UTF-8"; f.open("w"); f.write(JSON.stringify(out, null, 1)); f.close();
    return JSON.stringify({ status: "success", wrote: f.fsName, comps: out.comps.length });
})();
