// Replace words in every text layer of the project, keeping per-character styles (inserted chars copy the style of
// the replaced word's first char). $.global.MCP_TYPOS = [[find, repl], ...] (case-sensitive, literal)
(function () {
    var ATTR = ["font", "fontSize", "fillColor", "applyFill", "strokeColor", "applyStroke", "strokeWidth", "tracking", "fauxBold", "fauxItalic", "baselineShift", "horizontalScale", "verticalScale", "autoLeading", "leading"];
    var pairs = $.global.MCP_TYPOS, log = [], comps = {};
    function styleAt(doc, i) { var cr = doc.characterRange(i, i + 1), a = {}; for (var z = 0; z < ATTR.length; z++) { try { var v = cr[ATTR[z]]; if (v !== undefined && v !== null) a[ATTR[z]] = v; } catch (e) {} } return a; }
    for (var i = 1; i <= app.project.numItems; i++) {
        var c = app.project.item(i); if (!(c instanceof CompItem)) continue;
        for (var j = 1; j <= c.numLayers; j++) {
            var L = c.layer(j); if (!(L instanceof TextLayer)) continue;
            var prop = L.property("ADBE Text Properties").property("ADBE Text Document");
            if (prop.numKeys > 0 || prop.expressionEnabled) continue;
            var doc = prop.value, text = doc.text, hit = false;
            for (var p = 0; p < pairs.length; p++) if (text.indexOf(pairs[p][0]) >= 0) hit = true;
            if (!hit) continue;
            var oldStyles = []; for (var q = 0; q < text.length; q++) oldStyles.push(styleAt(doc, q));
            var nt = "", ns = [], k = 0;
            while (k < text.length) {
                var m = null;
                for (var p2 = 0; p2 < pairs.length; p2++) if (text.substr(k, pairs[p2][0].length) === pairs[p2][0]) { m = pairs[p2]; break; }
                if (m) { for (var r = 0; r < m[1].length; r++) { nt += m[1].charAt(r); ns.push(oldStyles[k + Math.min(r, m[0].length - 1)]); } k += m[0].length; }
                else { nt += text.charAt(k); ns.push(oldStyles[k]); k++; }
            }
            var just = doc.justification, box = doc.boxText ? doc.boxTextSize : null, t0 = Math.max(L.inPoint, 0), before = L.sourceRectAtTime(t0, false);
            doc.text = nt; doc.justification = just; if (box) doc.boxTextSize = box;
            var s0 = 0;
            while (s0 < ns.length) {
                var e0 = s0 + 1, sig = ns[s0].toSource(); while (e0 < ns.length && ns[e0].toSource() === sig) e0++;
                var rr = doc.characterRange(s0, e0); for (var at in ns[s0]) { try { if (at === "leading" && ns[s0].autoLeading) continue; rr[at] = ns[s0][at]; } catch (e) {} }
                s0 = e0;
            }
            prop.setValue(doc);
            // keep the text's left/top edge in place (centred point text would otherwise shift)
            var after = L.sourceRectAtTime(t0, false), an = L.property("ADBE Transform Group").property("ADBE Anchor Point"), av = an.value;
            if (box) { av[0] += after.left - before.left; av[1] += after.top - before.top; an.setValue(av); }
            if (/ /.test(L.name) || L.name.length) { for (var p3 = 0; p3 < pairs.length; p3++) L.name = L.name.split(pairs[p3][0]).join(pairs[p3][1]); }
            comps[c.name] = 1;
            log.push(c.name + " #" + j + ": " + JSON.stringify(nt.replace(/[\r\u0003]/g, " | ").substr(0, 60)));
        }
    }
    var cl = []; for (var cn in comps) cl.push(cn);
    return JSON.stringify({ status: "success", comps: cl, log: log });
})();
