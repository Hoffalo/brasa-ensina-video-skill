// House curve = RIGHT-SKEWED: a key LEAVES with low influence (fast start) and the next key is REACHED with high
// influence (long soft landing). Finds segments k->k+1 (value changes) where out(k) influence > in(k+1) influence
// (the inverted, left-skewed shape) and swaps them. $.global.FK = {comps:[...], dry:true}
(function () {
    var cfg = $.global.FK, out = [], n = 0;
    function comp(nm) { for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === nm) return it; } return null; }
    function same(a, b) { if (a instanceof Array) { for (var i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 1e-3) return false; return true; } if (typeof a === "number") return Math.abs(a - b) < 1e-3; try { return a.vertices.toString() === b.vertices.toString(); } catch (e) { return false; } }
    function walk(g, L, cn) {
        for (var q = 1; q <= g.numProperties; q++) {
            var p; try { p = g.property(q); } catch (e) { continue; }
            if (p.propertyType !== PropertyType.PROPERTY) { walk(p, L, cn); continue; }
            if (p.numKeys < 2) continue;
            for (var k = 1; k < p.numKeys; k++) {
                if (p.keyOutInterpolationType(k) !== KeyframeInterpolationType.BEZIER) continue;
                if (same(p.keyValue(k), p.keyValue(k + 1))) continue;
                var oe = p.keyOutTemporalEase(k), ie = p.keyInTemporalEase(k + 1);
                if (oe[0].influence > ie[0].influence + 0.5) {
                    n++; out.push(cn + " | " + L.name.substr(0, 26) + " | " + p.name + " k" + k + "@" + p.keyTime(k).toFixed(2) + " out " + oe[0].influence.toFixed(1) + " -> in " + ie[0].influence.toFixed(1));
                    if (!cfg.dry) {
                        var lo = ie[0].influence, hi = oe[0].influence, no = [], ni = [];
                        for (var z = 0; z < oe.length; z++) no.push(new KeyframeEase(oe[z].speed, Math.max(0.1, lo)));
                        for (var z2 = 0; z2 < ie.length; z2++) ni.push(new KeyframeEase(ie[z2].speed, hi));
                        p.setTemporalEaseAtKey(k, p.keyInTemporalEase(k), no);
                        p.setTemporalEaseAtKey(k + 1, ni, p.keyOutTemporalEase(k + 1));
                    }
                }
            }
        }
    }
    for (var c = 0; c < cfg.comps.length; c++) { var C = comp(cfg.comps[c]); if (!C) { out.push("missing " + cfg.comps[c]); continue; } for (var j = 1; j <= C.numLayers; j++) walk(C.layer(j), C.layer(j), C.name.substr(0, 8)); }
    if (!cfg.dry) app.project.save();
    return JSON.stringify({ status: "success", n: n, o: out });
})();
