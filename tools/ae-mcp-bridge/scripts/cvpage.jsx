// Document-page graphic builder (BRASA Ensina "CV12 cv da Ana"): a real document page (PNG) as a 3D layer in a house
// comp, with page-parented spotlight / boxes / tabs / highlighter marks, and a camera-facing "card" rig.
// $.global.CP = {comp, ops:[...]}. Units of page/card children = screen px (page scale and card scale make 1 unit = 1 px).
// ops:
//  {op:"page", name, png, pos:[x,y,z] world (top-left), scale, t, dy, rotX}       footage layer, anchor [0,0], house in + tilt
//  {op:"rig", name, pos:[x,y,z], scale}                                             3D null, anchor [0,0] (card space)
//  {op:"dim", name, parent, wh:[w,h], color, op:[[t,v],...], mask:[[t,[x1,y1,x2,y2]],...], round, feather}
//  {op:"box", name, parent, c:[x,y], wh:[w,h], t, out?, stroke?, round?, fill?, glow?}       trim draw-on 0.55 s
//  {op:"hl", name, parent, r:[x1,y1,x2,y2], t, d?, color?}                                    highlighter wipe (multiply)
//  {op:"strike", name, parent, x1, x2, y, t, d?, stroke?, color?}                             white wipe line
//  {op:"text", name, parent, text, font, size, color, just:"L"|"C"|"J", box?:[w,h], runs?, at:"tl"|"c", p:[x,y]}
//  {op:"measure", names:[...]}                                                                 -> rects (parent space)
//  {op:"place", name, at:"tl"|"c", p:[x,y]}
//  {op:"in", name, t, dy?:30, d?:0.4}   {op:"out", name, t, d?:0.3}   {op:"glow", name}   {op:"order", name, before}
//  {op:"nullkeys", keys:[[t,[x,y,z]],...]}
(function () {
    var cfg = $.global.CP, c = null, out = [], res = {};
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) c = it; }
    if (!c) return JSON.stringify({ status: "error", message: "no comp " + cfg.comp });
    var YEL = [1, 0.8, 0.01], WH = [0.957, 0.957, 0.957];
    function byName(n) { for (var j = 1; j <= c.numLayers; j++) if (c.layer(j).name === n) return c.layer(j); throw new Error("no layer " + n); }
    function tg(l) { return l.property("ADBE Transform Group"); }
    function ease(p, a, b) {
        for (var k = 1; k <= p.numKeys; k++) {
            var dim = 1, vt = p.propertyValueType;
            if (vt === PropertyValueType.ThreeD || vt === PropertyValueType.TwoD) dim = (vt === PropertyValueType.ThreeD) ? 3 : 2;
            if (p.matchName === "ADBE Scale") dim = 3;
            var ei = [], eo = []; for (var z = 0; z < dim; z++) { ei.push(new KeyframeEase(0, b)); eo.push(new KeyframeEase(0, a)); }
            // house RIGHT-SKEWED curve: leave every key with a (low), reach every key with b (high)
            try { p.setTemporalEaseAtKey(k, ei, eo); } catch (er) { try { p.setTemporalEaseAtKey(k, [ei[0]], [eo[0]]); } catch (er2) {} }
        }
    }
    function glowSrc() { for (var j = 1; j <= c.numLayers; j++) { var fx = c.layer(j).property("ADBE Effect Parade"); if (!fx) continue; for (var f = 1; f <= fx.numProperties; f++) if (fx.property(f).matchName === "ADBE Glo2") return fx.property(f); } return null; }
    var GS = glowSrc();
    function addGlow(l) { if (!GS) return; var g = l.property("ADBE Effect Parade").addProperty("ADBE Glo2"); for (var q = 1; q <= GS.numProperties; q++) { try { var p = GS.property(q); if (p.propertyType === PropertyType.PROPERTY && !p.numKeys) g.property(q).setValue(p.value); } catch (e) {} } }
    function adopt(l, parentName) {
        l.threeDLayer = true;
        if (parentName) l.parent = byName(parentName);
        var t = tg(l); t.property("ADBE Scale").setValue([100, 100, 100]); t.property("ADBE Orientation").setValue([0, 0, 0]);
        t.property("ADBE Rotate X").setValue(0); t.property("ADBE Rotate Y").setValue(0); t.property("ADBE Rotate Z").setValue(0);
    }
    function rrect(x1, y1, x2, y2, r) {   // rounded-rect mask Shape
        var s = new Shape(), k = 0.5523 * r;
        s.vertices = [[x1 + r, y1], [x2 - r, y1], [x2, y1 + r], [x2, y2 - r], [x2 - r, y2], [x1 + r, y2], [x1, y2 - r], [x1, y1 + r]];
        s.inTangents = [[-k, 0], [0, 0], [0, -k], [0, 0], [k, 0], [0, 0], [0, k], [0, 0]];
        s.outTangents = [[0, 0], [k, 0], [0, 0], [0, k], [0, 0], [-k, 0], [0, 0], [0, -k]];
        s.closed = true; return s;
    }
    function shapeLayer(o) {
        var sl = c.layers.addShape(); sl.name = o.name; sl.label = 2; adopt(sl, o.parent);
        var grp = sl.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        return sl;
    }
    function vectors(sl) { return sl.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group"); }
    for (var n = 0; n < cfg.ops.length; n++) {
        var o = cfg.ops[n];
        try {
            if (o.op === "page") {
                var f = new File(o.png), item = null;
                for (var q = 1; q <= app.project.numItems; q++) { var pi = app.project.item(q); if (pi instanceof FootageItem && pi.file && pi.file.fsName === f.fsName) item = pi; }
                if (!item) item = app.project.importFile(new ImportOptions(f));
                var pl = c.layers.add(item); pl.name = o.name; pl.threeDLayer = true;
                var T = tg(pl); T.property("ADBE Anchor Point").setValue([0, 0, 0]); T.property("ADBE Scale").setValue([o.scale, o.scale, o.scale]);
                var P = T.property("ADBE Position"), Op = T.property("ADBE Opacity"), RX = T.property("ADBE Rotate X");
                P.setValueAtTime(o.t, [o.pos[0], o.pos[1] + o.dy, o.pos[2]]); P.setValueAtTime(o.t + 0.5, o.pos);
                Op.setValueAtTime(o.t, 0); Op.setValueAtTime(o.t + 0.4, 100);
                RX.setValueAtTime(o.t, o.rotX || 0); RX.setValueAtTime(o.t + 0.6, 0);
                ease(P, 16.67, 90); ease(Op, 16.67, 90); ease(RX, 16.67, 90);
                var ds = pl.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
                ds.property("ADBE Drop Shadow-0002").setValue(35); ds.property("ADBE Drop Shadow-0004").setValue(18 / (o.scale / 100)); ds.property("ADBE Drop Shadow-0005").setValue(70 / (o.scale / 100));
            } else if (o.op === "rig") {
                var nl = c.layers.addNull(); nl.name = o.name; nl.threeDLayer = true; nl.enabled = false;
                var NT = tg(nl); NT.property("ADBE Anchor Point").setValue([0, 0, 0]); NT.property("ADBE Position").setValue(o.pos); NT.property("ADBE Scale").setValue([o.scale, o.scale, o.scale]);
                nl.outPoint = c.duration;
            } else if (o.op === "dim") {
                var sd = c.layers.addSolid(o.color, o.name, o.wh[0], o.wh[1], 1, c.duration); adopt(sd, o.parent);
                var ST = tg(sd); ST.property("ADBE Anchor Point").setValue([0, 0, 0]); ST.property("ADBE Position").setValue([0, 0, 0]);
                var so = ST.property("ADBE Opacity"); for (var a = 0; a < o.ov.length; a++) so.setValueAtTime(o.ov[a][0], o.ov[a][1]); ease(so, 33, 90);
                var mk = sd.property("ADBE Mask Parade").addProperty("ADBE Mask Atom"); mk.inverted = true;
                mk.property("ADBE Mask Feather").setValue([o.feather || 4, o.feather || 4]);
                var mp = mk.property("ADBE Mask Shape");
                for (var b = 0; b < o.mask.length; b++) { var R = o.mask[b][1]; mp.setValueAtTime(o.mask[b][0], rrect(R[0], R[1], R[2], R[3], o.round || 22)); }
                ease(mp, 33, 100);
                sd.moveAfter(byName(o.parent)); sd.moveBefore(byName(o.parent));
            } else if (o.op === "box") {
                var bl = shapeLayer(o), vc = vectors(bl);
                vc.addProperty("ADBE Vector Shape - Rect"); if (o.fill) vc.addProperty("ADBE Vector Graphic - Fill");
                vc.addProperty("ADBE Vector Filter - Trim"); vc.addProperty("ADBE Vector Graphic - Stroke"); vc = vectors(bl);
                var rc = vc.property("ADBE Vector Shape - Rect"); rc.property("ADBE Vector Rect Size").setValue(o.wh); rc.property("ADBE Vector Rect Roundness").setValue(o.round || 22);
                if (o.fill) vc.property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(o.fill);
                var st = vc.property("ADBE Vector Graphic - Stroke"); st.property("ADBE Vector Stroke Color").setValue(o.color || YEL); st.property("ADBE Vector Stroke Width").setValue(o.stroke || 4);
                tg(bl).property("ADBE Position").setValue([o.c[0], o.c[1], o.z || 0]);
                var tr = vc.property("ADBE Vector Filter - Trim"), te = tr.property("ADBE Vector Trim End"); tr.property("ADBE Vector Trim Offset").setValue(-90);
                te.setValueAtTime(o.t, 0); te.setValueAtTime(o.t + 0.55, 100);
                te.setTemporalEaseAtKey(1, [new KeyframeEase(0, 49.92)], [new KeyframeEase(0, 49.92)]); te.setTemporalEaseAtKey(2, [new KeyframeEase(0, 100)], [new KeyframeEase(0, 100)]);
                if (o.fill) { var fo = vc.property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Opacity"); fo.setValueAtTime(o.t + 0.2, 0); fo.setValueAtTime(o.t + 0.6, 100); }
                if (o.glow !== false) addGlow(bl);
                var bo = tg(bl).property("ADBE Opacity"); bo.setValueAtTime(o.t, 100);
                if (o.out !== undefined) { bo.setValueAtTime(o.out, 100); bo.setValueAtTime(o.out + 0.3, 0); ease(bo, 33, 80); }
                bl.inPoint = Math.max(0, o.t - 0.05);
            } else if (o.op === "hl") {
                var hl = shapeLayer(o), hv = vectors(hl); hv.addProperty("ADBE Vector Shape - Rect"); hv.addProperty("ADBE Vector Graphic - Fill"); hv = vectors(hl);
                var w = o.r[2] - o.r[0], h = o.r[3] - o.r[1];
                hv.property("ADBE Vector Shape - Rect").property("ADBE Vector Rect Size").setValue([w, h]);
                hv.property("ADBE Vector Shape - Rect").property("ADBE Vector Rect Position").setValue([w / 2, 0]);
                hv.property("ADBE Vector Shape - Rect").property("ADBE Vector Rect Roundness").setValue(4);
                hv.property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(o.color || YEL);
                tg(hl).property("ADBE Position").setValue([o.r[0], (o.r[1] + o.r[3]) / 2, 0]);
                hl.blendingMode = BlendingMode.MULTIPLY;
                var hs = tg(hl).property("ADBE Scale"); hs.setValueAtTime(o.t, [0, 100, 100]); hs.setValueAtTime(o.t + (o.d || 0.45), [100, 100, 100]); ease(hs, 49.92, 100);
                hl.inPoint = Math.max(0, o.t - 0.05);
                if (o.out !== undefined) { var ho = tg(hl).property("ADBE Opacity"); ho.setValueAtTime(o.out, 100); ho.setValueAtTime(o.out + 0.3, 0); }
            } else if (o.op === "strike") {
                var sk = shapeLayer(o), sv = vectors(sk); sv.addProperty("ADBE Vector Shape - Rect"); sv.addProperty("ADBE Vector Graphic - Fill"); sv = vectors(sk);
                var sw = o.x2 - o.x1, sh2 = o.stroke || 5;
                sv.property("ADBE Vector Shape - Rect").property("ADBE Vector Rect Size").setValue([sw, sh2]);
                sv.property("ADBE Vector Shape - Rect").property("ADBE Vector Rect Position").setValue([sw / 2, 0]);
                sv.property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(o.color || WH);
                tg(sk).property("ADBE Position").setValue([o.x1, o.y, o.z || 0]);
                var ks = tg(sk).property("ADBE Scale"); ks.setValueAtTime(o.t, [0, 100, 100]); ks.setValueAtTime(o.t + (o.d || 0.55), [100, 100, 100]); ease(ks, 49.92, 100);
                sk.inPoint = Math.max(0, o.t - 0.05);
            } else if (o.op === "text") {
                var tl = o.box ? c.layers.addBoxText(o.box, o.text) : c.layers.addText(o.text); tl.name = o.name; adopt(tl, o.parent);
                var tp = tl.property("ADBE Text Properties").property("ADBE Text Document"), d = tp.value;
                d.font = o.font || "Lato-Regular"; d.fontSize = o.size; d.fillColor = o.color || WH; d.applyFill = true; d.applyStroke = false;
                if (o.just === "J") d.justification = ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT; else if (o.just === "C") d.justification = ParagraphJustification.CENTER_JUSTIFY; else d.justification = ParagraphJustification.LEFT_JUSTIFY;
                if (o.leading) { d.autoLeading = false; d.leading = o.leading; }
                tp.setValue(d);
                if (o.runs) { d = tp.value; for (var rr = 0; rr < o.runs.length; rr++) { var RU = o.runs[rr], cr = d.characterRange(RU.s, RU.e); if (RU.font) cr.font = RU.font; if (RU.color) cr.fillColor = RU.color; } tp.setValue(d); }
                if (o.glow !== false) addGlow(tl);
                tg(tl).property("ADBE Position").setValue([o.p ? o.p[0] : 0, o.p ? o.p[1] : 0, o.z || 0]);
            } else if (o.op === "measure") {
                for (var m = 0; m < o.names.length; m++) { var ml = byName(o.names[m]), r = ml.sourceRectAtTime(o.t || 0, false); res[o.names[m]] = [r.left, r.top, r.width, r.height]; }
            } else if (o.op === "place") {
                var pl2 = byName(o.name), r2 = pl2.sourceRectAtTime(o.t || 0, false), A = tg(pl2).property("ADBE Anchor Point");
                if (o.at === "c") A.setValue([r2.left + r2.width / 2, r2.top + r2.height / 2, 0]); else A.setValue([r2.left, r2.top, 0]);
                tg(pl2).property("ADBE Position").setValue([o.p[0], o.p[1], o.z || 0]);
            } else if (o.op === "in") {
                var il = byName(o.name), ip = tg(il).property("ADBE Position"), io = tg(il).property("ADBE Opacity");
                var v = ip.numKeys ? ip.keyValue(ip.numKeys) : ip.value; while (ip.numKeys) ip.removeKey(1); while (io.numKeys) io.removeKey(1);
                var dy = o.dy === undefined ? 30 : o.dy, du = o.d || 0.4;
                ip.setValueAtTime(o.t, [v[0], v[1] + dy, v[2]]); ip.setValueAtTime(o.t + du, v); io.setValueAtTime(o.t, 0); io.setValueAtTime(o.t + du, 100);
                ease(ip, 16.67, 90); ease(io, 16.67, 90); il.inPoint = Math.max(0, o.t - 0.05);
            } else if (o.op === "out") {
                var ol = byName(o.name), oo = tg(ol).property("ADBE Opacity"), cur = oo.valueAtTime(o.t, false);
                oo.setValueAtTime(o.t, cur); oo.setValueAtTime(o.t + (o.d || 0.3), 0);
                var i1 = oo.nearestKeyIndex(o.t), i2 = oo.nearestKeyIndex(o.t + (o.d || 0.3));
                oo.setTemporalEaseAtKey(i1, [new KeyframeEase(0, 33)], [new KeyframeEase(0, 33)]); oo.setTemporalEaseAtKey(i2, [new KeyframeEase(0, 80)], [new KeyframeEase(0, 80)]);
            } else if (o.op === "order") { byName(o.name).moveBefore(byName(o.before)); }
            else if (o.op === "remove") { byName(o.name).remove(); }
            else if (o.op === "nullkeys") {
                var NL = null; for (var q2 = 1; q2 <= c.numLayers; q2++) if (c.layer(q2).nullLayer && /^Null 1/.test(c.layer(q2).name)) NL = c.layer(q2);
                var np = tg(NL).property("ADBE Position"); while (np.numKeys) np.removeKey(1);
                if (o.keys.length === 1) np.setValue(o.keys[0][1]); else { for (var q3 = 0; q3 < o.keys.length; q3++) np.setValueAtTime(o.keys[q3][0], o.keys[q3][1]); ease(np, 33, 100); }
            }
            out.push(n + ":" + o.op + " ok");
        } catch (e) { out.push(n + ":" + o.op + " ERR " + e.toString() + " line " + e.line); }
    }
    return JSON.stringify({ status: "success", o: out, r: res });
})();
