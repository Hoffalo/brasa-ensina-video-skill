// G6 opens on the Fulbright card that G11 ends on. Replace G6's stale copies (FULBRIGHT / Mestrado / Pode cobrir)
// with G11's layers (title, subtitle, body, box) frozen at G11's final frame, so the two clips match exactly.
(function () {
    function C(n) { for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === n) return it; } }
    var g11 = C("G11"), g6 = C("G6"), T = g11.duration - 0.05, log = [];
    var keep = [];
    for (var j = 1; j <= g11.numLayers; j++) { var L = g11.layer(j); if (L instanceof TextLayer || (L instanceof ShapeLayer && /^Box/.test(L.name))) keep.push(L); }
    // old G6 layers to replace
    var old = [];
    for (var k = 1; k <= g6.numLayers; k++) { var O = g6.layer(k); if (/^(FULBRIGHT|Mestrado\/Doutora|Pode cobrir)/.test(O.name)) old.push(O); }
    var oIn = 1e9, oOut = -1e9;
    for (var a = 0; a < old.length; a++) { oIn = Math.min(oIn, old[a].inPoint); oOut = Math.max(oOut, old[a].outPoint); }
    // copy in reverse so stacking order is preserved (copyToComp puts the copy on top)
    for (var b = keep.length - 1; b >= 0; b--) {
        keep[b].copyToComp(g6);
        var N = g6.layer(1);
        // freeze every keyframed property at G11's final time
        function freeze(grp) {
            for (var q = 1; q <= grp.numProperties; q++) {
                var p = grp.property(q);
                if (p.propertyType === PropertyType.PROPERTY) {
                    if (p.numKeys > 0) { var v = p.valueAtTime(T, false); while (p.numKeys) p.removeKey(1); try { p.setValue(v); } catch (e) {} }
                } else freeze(p);
            }
        }
        freeze(N);
        N.startTime = 0; N.inPoint = Math.min(oIn, 0); N.outPoint = Math.max(oOut, g6.duration);
        log.push("copied " + N.name.substr(0, 20));
    }
    for (var c = 0; c < old.length; c++) { log.push("removed old " + old[c].name.substr(0, 20)); old[c].remove(); }
    // the background must stay at the bottom
    for (var d = 1; d <= g6.numLayers; d++) if (/^Deep Royal Blue/.test(g6.layer(d).name)) g6.layer(d).moveToEnd();
    return JSON.stringify({ status: "success", log: log });
})();
