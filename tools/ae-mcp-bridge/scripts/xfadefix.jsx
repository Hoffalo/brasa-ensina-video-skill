// Crossfade reveal groups: give every layer of a group the same canonical text (the longest version), with the
// characters a layer didn't have appended as hidden (no fill/stroke). Identical text => identical wrapping and
// justification, so the visible words never shift between versions.
// $.global.MCP_XF = { "G9": [[4,5,6]], ... }  (layer indices; boxes must already be removed or indices adjusted)
(function () {
    var ATTR = ["font", "fontSize", "fillColor", "applyFill", "strokeColor", "applyStroke", "strokeWidth", "tracking", "fauxBold", "fauxItalic", "baselineShift", "horizontalScale", "verticalScale", "autoLeading", "leading"];
    var cfg = $.global.MCP_XF, log = [];
    function readRuns(doc) { var out = []; for (var q = 0; q < doc.text.length; q++) { var cr = doc.characterRange(q, q + 1), a = {}; for (var z = 0; z < ATTR.length; z++) { try { var v = cr[ATTR[z]]; if (v !== undefined && v !== null) a[ATTR[z]] = v; } catch (e) {} } out.push(a); } return out; }
    function write(L, text, runs) {
        var prop = L.property("ADBE Text Properties").property("ADBE Text Document"), doc = prop.value;
        var just = doc.justification, box = doc.boxText ? doc.boxTextSize : null, t0 = Math.max(L.inPoint, 0), before = L.sourceRectAtTime(t0, false);
        doc.text = text; doc.justification = just; if (box) doc.boxTextSize = box;
        var s0 = 0;
        while (s0 < runs.length) {
            var e0 = s0 + 1, sig = runs[s0].toSource(); while (e0 < runs.length && runs[e0].toSource() === sig) e0++;
            var rr = doc.characterRange(s0, e0); for (var at in runs[s0]) { try { if (at === "leading" && runs[s0].autoLeading) continue; rr[at] = runs[s0][at]; } catch (e) {} }
            s0 = e0;
        }
        prop.setValue(doc);
        var after = L.sourceRectAtTime(t0, false);
        // keep the first visible line where it was (rect may change because hidden chars still occupy space)
        var an = L.property("ADBE Transform Group").property("ADBE Anchor Point"), av = an.value; av[0] += after.left - before.left; av[1] += after.top - before.top; an.setValue(av);
    }
    for (var i = 1; i <= app.project.numItems; i++) {
        var c = app.project.item(i); if (!(c instanceof CompItem) || !cfg[c.name]) continue;
        for (var xi = c.numLayers; xi >= 1; xi--) { var X = c.layer(xi); if (X instanceof ShapeLayer && /^Box( \d+)?$/.test(X.name)) X.remove(); }
        var groups = cfg[c.name];
        for (var g = 0; g < groups.length; g++) {
            var Ls = [], canon = null, canonRuns = null;
            for (var k = 0; k < groups[g].length; k++) Ls.push(c.layer(groups[g][k]));
            for (var k2 = 0; k2 < Ls.length; k2++) { var d = Ls[k2].property("ADBE Text Properties").property("ADBE Text Document").value; if (!canon || d.text.length > canon.length) { canon = d.text; canonRuns = readRuns(d); } }
            for (var k3 = 0; k3 < Ls.length; k3++) {
                var dd = Ls[k3].property("ADBE Text Properties").property("ADBE Text Document").value;
                if (dd.text === canon) continue;
                if (canon.indexOf(dd.text) !== 0) { log.push(c.name + " '" + Ls[k3].name.substr(0, 20) + "' is not a prefix of the canonical text — skipped"); continue; }
                var runs = readRuns(dd);
                for (var q = dd.text.length; q < canon.length; q++) { var r = {}; for (var a in canonRuns[q]) r[a] = canonRuns[q][a]; r.applyFill = false; r.applyStroke = false; runs.push(r); }
                write(Ls[k3], canon, runs);
                log.push(c.name + " '" + Ls[k3].name.substr(0, 20) + "' +" + (canon.length - dd.text.length) + " hidden chars");
            }
        }
    }
    return JSON.stringify({ status: "success", log: log });
})();
