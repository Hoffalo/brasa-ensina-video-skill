// Crossfade reveals keep the full paragraph in every layer and hide the unrevealed part with "no fill".
// Trailing text that is invisible in EVERY layer of a group never shows, but it inflates bounds/boxes: remove it.
// $.global.MCP_TRIM = ["G11", ...]
(function () {
    var ATTR = ["font", "fontSize", "fillColor", "applyFill", "strokeColor", "applyStroke", "strokeWidth", "tracking", "fauxBold", "fauxItalic", "baselineShift", "horizontalScale", "verticalScale", "autoLeading", "leading"];
    var log = [], names = $.global.MCP_TRIM || [];
    function visible(cr) { var f = false, s = false; try { f = cr.applyFill; } catch (e) {} try { s = cr.applyStroke; } catch (e) {} return f || s; }
    for (var i = 1; i <= app.project.numItems; i++) {
        var c = app.project.item(i);
        if (!(c instanceof CompItem) || ("|" + names.join("|") + "|").indexOf("|" + c.name + "|") < 0) continue;
        var groups = {};
        for (var j = 1; j <= c.numLayers; j++) {
            var L = c.layer(j); if (!(L instanceof TextLayer)) continue;
            var t = L.property("ADBE Text Properties").property("ADBE Text Document").value.text;
            groups[j + "" + t] = [L]; // per layer: trimming trailing invisible text never changes the visible layout
        }
        for (var gk in groups) {
            var key = gk.substr(gk.indexOf("") + 1), G = groups[gk], last = -1;
            for (var g = 0; g < G.length; g++) {
                var d = G[g].property("ADBE Text Properties").property("ADBE Text Document").value;
                for (var k = d.text.length - 1; k > last; k--) if (!/\s/.test(d.text.charAt(k)) && visible(d.characterRange(k, k + 1))) { last = k; break; }
            }
            if (last < 0 || last >= key.length - 1) continue;
            for (var g2 = 0; g2 < G.length; g2++) {
                var prop = G[g2].property("ADBE Text Properties").property("ADBE Text Document"), doc = prop.value;
                var runs = [];
                for (var q = 0; q <= last; q++) { var cr = doc.characterRange(q, q + 1), a = {}; for (var z = 0; z < ATTR.length; z++) { try { var v = cr[ATTR[z]]; if (v !== undefined && v !== null) a[ATTR[z]] = v; } catch (e) {} } runs.push(a); }
                var just = doc.justification, box = doc.boxText ? doc.boxTextSize : null, t0 = Math.max(G[g2].inPoint, 0), before = G[g2].sourceRectAtTime(t0, false);
                doc.text = key.substr(0, last + 1); doc.justification = just; if (box) doc.boxTextSize = box;
                var s0 = 0;
                while (s0 < runs.length) {
                    var e0 = s0 + 1, sig = runs[s0].toSource(); while (e0 < runs.length && runs[e0].toSource() === sig) e0++;
                    var rr = doc.characterRange(s0, e0); for (var at in runs[s0]) { try { if (at === "leading" && runs[s0].autoLeading) continue; rr[at] = runs[s0][at]; } catch (e) {} }
                    s0 = e0;
                }
                prop.setValue(doc);
                var after = G[g2].sourceRectAtTime(t0, false);
                if (Math.abs(after.top - before.top) > 0.5 || Math.abs(after.left - before.left) > 0.5) {
                    var an = G[g2].property("ADBE Transform Group").property("ADBE Anchor Point"), av = an.value; av[0] += after.left - before.left; av[1] += after.top - before.top; an.setValue(av);
                }
            }
            log.push(c.name + ": removed " + (key.length - last - 1) + " hidden trailing chars from " + G.length + " layer(s): " + JSON.stringify(key.substr(last + 1, 50)));
        }
    }
    return JSON.stringify({ status: "success", log: log });
})();
