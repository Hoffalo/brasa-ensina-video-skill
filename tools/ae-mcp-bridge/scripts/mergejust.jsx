// Merge a sentence built from separate point-text fragments into ONE justified box-text paragraph (FULL_JUSTIFY_
// LASTLINE_LEFT), keeping the speech-synced reveal with a word-index Opacity animator, the highlight runs, the
// reference fragment's motion/opacity keys, scale and effects. Fragments are switched off ("[off] ").
// $.global.MJ = {comp, groups:[{name, text, runs:[{s,e,font,color}], cues:[[wordsVisible, t],...], ref, frags:[...],
//   widthFrags:[...] | width (layer units), scale?, leftFrom?, style?:{font,size,fill,tracking,leading}, fxFrom?}]}
(function () {
    var cfg = $.global.MJ, c = null, out = [];
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) c = it; }
    if (!c) return JSON.stringify({ status: "error", message: "no comp" });
    function L(n) { var t = function (x) { return x.replace(/^\s+|\s+$/g, ""); }; for (var j = 1; j <= c.numLayers; j++) if (t(c.layer(j).name) === t(n)) return c.layer(j); return null; }
    function tg(l) { return l.property("ADBE Transform Group"); }
    function settle(l) { var o = tg(l).property("ADBE Opacity"); return o.numKeys ? o.keyTime(o.numKeys) : 1; }
    function worldRect(l, t) {   // world-space left/top/right of the glyphs (layer has no parent, no rotation)
        var r = l.sourceRectAtTime(t, false), p = tg(l).property("ADBE Position").valueAtTime(t, false), s = tg(l).property("ADBE Scale").valueAtTime(t, false)[0] / 100,
            a = tg(l).property("ADBE Anchor Point").valueAtTime(t, false);
        return [p[0] + (r.left - a[0]) * s, p[1] + (r.top - a[1]) * s, p[0] + (r.left + r.width - a[0]) * s];
    }
    function copyKeys(src, dst, dx, dy) {
        var mk = ["ADBE Position", "ADBE Opacity"];
        for (var m = 0; m < mk.length; m++) {
            var ps = tg(src).property(mk[m]), pd = tg(dst).property(mk[m]);
            while (pd.numKeys) pd.removeKey(1);
            if (!ps.numKeys) { var v = ps.value; pd.setValue(mk[m] === "ADBE Position" ? [v[0] + dx, v[1] + dy, v[2]] : v); continue; }
            for (var k = 1; k <= ps.numKeys; k++) {
                var kv = ps.keyValue(k), nk = pd.addKey(ps.keyTime(k));
                pd.setValueAtKey(nk, mk[m] === "ADBE Position" ? [kv[0] + dx, kv[1] + dy, kv[2]] : kv);
                try { pd.setInterpolationTypeAtKey(nk, ps.keyInInterpolationType(k), ps.keyOutInterpolationType(k)); pd.setTemporalEaseAtKey(nk, ps.keyInTemporalEase(k), ps.keyOutTemporalEase(k)); } catch (e) {}
                if (pd.isSpatial) { try { pd.setSpatialAutoBezierAtKey(nk, false); pd.setSpatialTangentsAtKey(nk, [0, 0, 0], [0, 0, 0]); } catch (e) {} }
            }
        }
    }
    for (var g = 0; g < cfg.groups.length; g++) {
        var G = cfg.groups[g], ref = L(G.ref);
        if (!ref) { out.push("missing ref " + G.ref); continue; }
        var ts = settle(ref) + 0.01, rd = ref.property("ADBE Text Properties").property("ADBE Text Document").value, st = G.style || {};
        var sc = G.scale || tg(ref).property("ADBE Scale").value[0];
        // box width: right-most fragment edge minus the reference left edge (world) -> layer units
        var W = G.width;
        if (!W) { var left = worldRect(ref, ts)[0], right = left; for (var f = 0; f < G.widthFrags.length; f++) { var fl = L(G.widthFrags[f]); if (fl) right = Math.max(right, worldRect(fl, settle(fl) + 0.01)[2]); } W = (right - left) / (sc / 100) + 4; }
        var nl = c.layers.addBoxText([W, 600]); nl.name = G.name; nl.threeDLayer = true; nl.moveBefore(ref);
        var tp = nl.property("ADBE Text Properties").property("ADBE Text Document"), d = tp.value;
        d.text = G.text; d.font = st.font || rd.font; d.fontSize = st.size || rd.fontSize; d.fillColor = st.fill || rd.fillColor; d.applyFill = true; d.applyStroke = false;
        d.tracking = st.tracking === undefined ? rd.tracking : st.tracking; d.autoLeading = false; d.leading = st.leading || rd.leading;
        d.justification = ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT; tp.setValue(d);
        d = tp.value; for (var r = 0; r < (G.runs || []).length; r++) { var R = G.runs[r], cr = d.characterRange(R.s, R.e); if (R.font) cr.font = R.font; if (R.color) cr.fillColor = R.color; } tp.setValue(d);
        tg(nl).property("ADBE Scale").setValue([sc, sc, sc]);
        nl.inPoint = ref.inPoint; nl.outPoint = ref.outPoint;
        // effects (glow) from the reference
        var fxSrc = G.fxFrom ? L(G.fxFrom) : ref, fs = fxSrc.property("ADBE Effect Parade"), fd = nl.property("ADBE Effect Parade");
        for (var e = 1; e <= fs.numProperties; e++) { var ef = fs.property(e), ne = fd.addProperty(ef.matchName); for (var q = 1; q <= ef.numProperties; q++) { try { ne.property(q).setValue(ef.property(q).value); } catch (x) {} } }
        // align the first line's glyphs to the reference glyphs (x from leftFrom if given), then copy its keys
        tg(nl).property("ADBE Anchor Point").setValue([0, 0, 0]); tg(nl).property("ADBE Position").setValue([0, 0, tg(ref).property("ADBE Position").valueAtTime(ts, false)[2]]);
        var rr = worldRect(ref, ts), rx = G.leftFrom ? worldRect(L(G.leftFrom), settle(L(G.leftFrom)) + 0.01)[0] : rr[0];
        var nr = worldRect(nl, ts), rp = tg(ref).property("ADBE Position").valueAtTime(ts, false);
        copyKeys(ref, nl, (rx - nr[0]) - rp[0], (rr[1] - nr[1]) - rp[1]);
        // speech-synced reveal: Opacity 0 on words [start, end]; start keyed from cue to cue (0.35 s ramps)
        var an = nl.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator"); an.name = "Revelar";
        an.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity").setValue(0);
        var sel = an.property("ADBE Text Selectors").addProperty("ADBE Text Selector"), adv = sel.property("ADBE Text Range Advanced");
        adv.property("ADBE Text Range Units").setValue(2); adv.property("ADBE Text Range Type2").setValue(3);
        var sp = sel.property("ADBE Text Index Start"); sel.property("ADBE Text Index End").setValue(999);
        var cues = G.cues, prev = cues[0][0]; sp.setValueAtTime(0, prev);
        for (var k2 = 1; k2 < cues.length; k2++) { sp.setValueAtTime(cues[k2][1], prev); sp.setValueAtTime(cues[k2][1] + 0.35, cues[k2][0]); prev = cues[k2][0]; }
        for (var f2 = 0; f2 < G.frags.length; f2++) { var ol = L(G.frags[f2]); if (ol) { ol.enabled = false; ol.name = "[off] " + ol.name; } }
        var fr = worldRect(nl, ts); out.push(G.name + " W=" + Math.round(W) + " left " + Math.round(fr[0]) + " vs " + Math.round(rx) + " top " + Math.round(fr[1]) + " vs " + Math.round(rr[1]));
    }
    app.project.save();
    return JSON.stringify({ status: "success", o: out });
})();
