// Generic op list for house-style edits. $.global.OPS = {comp, ops:[...]}
// Layer refs: exact name or "#index" (indices resolved BEFORE the op list runs, so later inserts don't shift them).
// ops:
//  {op:"text", layer, text?, font?, size?, color?, just?:"L"|"C"|"R", leading?, runs?:[{s,e,font?,color?}]}  (static docs only)
//  {op:"move", layer, d:[dx,dy,dz?]}            shift static position or every position key (layer/parent space)
//  {op:"pos", layer, v:[x,y,z?]}                set static position (removes keys)
//  {op:"in", layer, t, dy?:60, d?:0.42}         house text-in: rise + fade, replaces position/opacity keys
//  {op:"out", layer, t, d?:0.4}                 fade out (adds opacity keys, keeps earlier ones)
//  {op:"clear", layer}                          remove all position/opacity/scale keys (keeps current values at t=0)
//  {op:"box", name, after, c:[x,y,z], wh:[w,h], k, t, d?:0.55, stroke?:4, round?:22, glowFrom?, fill?:[r,g,b], is3D?:true}
//  {op:"line", name, after, c:[x,y,z], w, k, t, d?:0.55, stroke?:4}     yellow rule wiping in from the left
//  {op:"dup", layer, name}  {op:"rename", layer, name}  {op:"enable", layer, on}  {op:"times", layer, inP?, outP?}
//  {op:"nullkeys", keys:[[t,[x,y,z]],...]}       replace Null 1 position keys (ease 33/100)
//  {op:"scale", layer, v:[...]}  {op:"opacity", layer, v}  {op:"order", layer, before}
//  {op:"retime", layer, dt}                     shift all keys of the layer (transform + effects) by dt
(function () {
    var cfg = $.global.OPS, c = null, out = [];
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) c = it; }
    if (!c) return JSON.stringify({ status: "error", message: "no comp " + cfg.comp });
    var YEL = [1, 0.8, 0.01], WH = [0.957, 0.957, 0.957];
    var cache = {};
    function byName(n) { for (var j = 1; j <= c.numLayers; j++) if (c.layer(j).name === n) return c.layer(j); return null; }
    for (var a = 0; a < cfg.ops.length; a++) { var fl = ["layer", "after", "before", "glowFrom"]; for (var fi = 0; fi < fl.length; fi++) { var r = cfg.ops[a][fl[fi]]; if (r && r.charAt(0) === "#" && !cache[r]) cache[r] = c.layer(parseInt(r.substr(1), 10)); } }
    function L(n) { if (cache[n]) return cache[n]; if (n && n.charAt(0) === "#") return c.layer(parseInt(n.substr(1), 10)); var x = byName(n); if (!x) throw new Error("no layer " + n); return x; }
    function tg(l) { return l.property("ADBE Transform Group"); }
    function easeAll(p, inf1, inf2) {
        for (var k = 1; k <= p.numKeys; k++) {
            var dim = 1; if (p.propertyValueType === PropertyValueType.ThreeD || p.propertyValueType === PropertyValueType.ThreeD_SPATIAL) dim = 3;
            if (p.propertyValueType === PropertyValueType.TwoD || p.propertyValueType === PropertyValueType.TwoD_SPATIAL) dim = 2;
            if (p.propertyValueType === PropertyValueType.ThreeD_SPATIAL || p.propertyValueType === PropertyValueType.TwoD_SPATIAL) dim = 1;
            var e1 = [], e2 = []; for (var z = 0; z < dim; z++) { e1.push(new KeyframeEase(0, inf1)); e2.push(new KeyframeEase(0, inf2)); }
            // house RIGHT-SKEWED curve: every key leaves with inf1 (low) and is reached with inf2 (high); never alternate per key
            try { p.setTemporalEaseAtKey(k, e2, e1); } catch (e) {}
        }
    }
    function clearKeys(p) { var v = p.valueAtTime(0, false); while (p.numKeys) p.removeKey(1); try { p.setValue(v); } catch (e) {} }
    function settled(p) { return p.numKeys ? p.keyValue(p.numKeys) : p.value; }
    function glowFrom(n) { var s = (cache[n] || byName(n)); if (!s) return null; var fx = s.property("ADBE Effect Parade"); for (var f = 1; f <= fx.numProperties; f++) if (fx.property(f).matchName === "ADBE Glo2") return fx.property(f); return null; }
    function copyProps(src, dst) { for (var q = 1; q <= src.numProperties; q++) { try { var p = src.property(q); if (p.propertyType === PropertyType.PROPERTY && !p.numKeys) dst.property(q).setValue(p.value); } catch (e) {} } }
    function shape(o, kind) {
        var afterL = o.after ? L(o.after) : null;   // resolve BEFORE creating, so a bad ref cannot leave an orphan layer
        var sl = c.layers.addShape(); sl.name = o.name; sl.label = 2;
        sl.threeDLayer = o.is3D !== false;
        if (afterL) sl.moveAfter(afterL);
        tg(sl).property("ADBE Position").setValue(sl.threeDLayer ? o.c : [o.c[0], o.c[1]]);
        var grp = sl.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        var vc = grp.property("ADBE Vectors Group");
        if (kind === "box") vc.addProperty("ADBE Vector Shape - Rect"); else vc.addProperty("ADBE Vector Shape - Group");
        if (o.fill) vc.addProperty("ADBE Vector Graphic - Fill");
        vc.addProperty("ADBE Vector Filter - Trim");
        vc.addProperty("ADBE Vector Graphic - Stroke");
        vc = sl.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group");
        var k = o.k || 1;
        if (kind === "box") {
            var rc = vc.property("ADBE Vector Shape - Rect");
            rc.property("ADBE Vector Rect Size").setValue(o.wh);
            rc.property("ADBE Vector Rect Roundness").setValue((o.round || 22) * k);
        } else {
            var sh = new Shape(); sh.vertices = [[-o.w / 2, 0], [o.w / 2, 0]]; sh.closed = false;
            vc.property("ADBE Vector Shape - Group").property("ADBE Vector Shape").setValue(sh);
        }
        if (o.fill) { var fl = vc.property("ADBE Vector Graphic - Fill"); fl.property("ADBE Vector Fill Color").setValue(o.fill); }
        var st = vc.property("ADBE Vector Graphic - Stroke");
        st.property("ADBE Vector Stroke Color").setValue(o.color || YEL);
        st.property("ADBE Vector Stroke Width").setValue((o.stroke || 4) * k);
        try { st.property("ADBE Vector Stroke Line Cap").setValue(2); st.property("ADBE Vector Stroke Line Join").setValue(2); } catch (e) {}
        var tr = vc.property("ADBE Vector Filter - Trim");
        var te = tr.property("ADBE Vector Trim End");
        te.setValueAtTime(o.t, 0); te.setValueAtTime(o.t + (o.d || 0.55), 100);
        var e1 = [new KeyframeEase(0, 49.92)], e2 = [new KeyframeEase(0, 100)];
        te.setTemporalEaseAtKey(1, e1, e1); te.setTemporalEaseAtKey(2, e2, e2);
        if (kind === "box") tr.property("ADBE Vector Trim Offset").setValue(-90);
        if (o.fill) { var fo = vc.property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Opacity"); fo.setValueAtTime(o.t + (o.d || 0.55) * 0.5, 0); fo.setValueAtTime(o.t + (o.d || 0.55) + 0.2, 100); }
        var g = o.glowFrom ? glowFrom(o.glowFrom) : null;
        if (g) { var gl = sl.property("ADBE Effect Parade").addProperty("ADBE Glo2"); copyProps(g, gl); }
        return sl;
    }
    for (var n = 0; n < cfg.ops.length; n++) {
        var o = cfg.ops[n];
        try {
            if (o.op === "text") {
                var l = L(o.layer), tp = l.property("ADBE Text Properties").property("ADBE Text Document");
                if (tp.numKeys) throw new Error("keyed source text");
                var d = tp.value;
                if (o.text !== undefined) d.text = o.text;
                if (o.font) d.font = o.font; if (o.size) d.fontSize = o.size; if (o.color) d.fillColor = o.color;
                d.applyFill = true; d.applyStroke = false;
                if (o.just === "J") d.justification = ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT; else if (o.just) d.justification = o.just === "C" ? ParagraphJustification.CENTER_JUSTIFY : (o.just === "R" ? ParagraphJustification.RIGHT_JUSTIFY : ParagraphJustification.LEFT_JUSTIFY);
                if (o.leading) { d.autoLeading = false; d.leading = o.leading; }
                try { d.fontCapsOption = FontCapsOption.FONT_NORMAL_CAPS; } catch (e) {}
                if (o.allcaps) { try { d.fontCapsOption = FontCapsOption.FONT_ALL_CAPS; } catch (e) {} }
                tp.setValue(d);
                if (o.runs && o.runs.length) {
                    d = tp.value;
                    for (var rr = 0; rr < o.runs.length; rr++) {
                        var R = o.runs[rr], cr = d.characterRange(R.s, R.e);
                        if (R.font) cr.font = R.font; if (R.color) cr.fillColor = R.color; if (R.size) cr.fontSize = R.size;
                    }
                    tp.setValue(d);
                }
            } else if (o.op === "move") {
                var p = tg(L(o.layer)).property("ADBE Position"), dd = o.d;
                function add(v) { var r2 = []; for (var z = 0; z < v.length; z++) r2.push(v[z] + (dd[z] || 0)); return r2; }
                if (p.numKeys) { for (var kk = 1; kk <= p.numKeys; kk++) p.setValueAtKey(kk, add(p.keyValue(kk))); } else p.setValue(add(p.value));
            } else if (o.op === "pos") {
                var p2 = tg(L(o.layer)).property("ADBE Position"); while (p2.numKeys) p2.removeKey(1); p2.setValue(o.v);
            } else if (o.op === "clear") {
                var l3 = L(o.layer); clearKeys(tg(l3).property("ADBE Position")); clearKeys(tg(l3).property("ADBE Opacity"));
            } else if (o.op === "in") {
                var l4 = L(o.layer), ps = tg(l4).property("ADBE Position"), op = tg(l4).property("ADBE Opacity");
                var v = settled(ps); while (ps.numKeys) ps.removeKey(1); while (op.numKeys) op.removeKey(1);
                var dy = o.dy === undefined ? 60 : o.dy, du = o.d || 0.42;
                var v0 = v.length > 2 ? [v[0], v[1] + dy, v[2]] : [v[0], v[1] + dy];
                ps.setValueAtTime(o.t, v0); ps.setValueAtTime(o.t + du, v); op.setValueAtTime(o.t, 0); op.setValueAtTime(o.t + du, 100);
                easeAll(ps, 16.67, 90); easeAll(op, 16.67, 90);
                if (l4.inPoint > o.t) l4.inPoint = Math.max(0, o.t);
            } else if (o.op === "in3d") {   // house 3D entrance: rise dy + come forward from z+dz, fade (BRASA reference)
                var l7 = L(o.layer), ps7 = tg(l7).property("ADBE Position"), op7 = tg(l7).property("ADBE Opacity");
                var v7 = settled(ps7); while (ps7.numKeys) ps7.removeKey(1); while (op7.numKeys) op7.removeKey(1);
                var du7 = o.d || 0.4, st7 = [v7[0], v7[1] + (o.dy || 0), v7[2] + (o.dz || 0)];
                ps7.setValueAtTime(o.t, st7); ps7.setValueAtTime(o.t + du7, v7); op7.setValueAtTime(o.t, 0); op7.setValueAtTime(o.t + du7, 100);
                easeAll(ps7, 33, 100); easeAll(op7, 33, 100);
                if (l7.inPoint > o.t) l7.inPoint = Math.max(0, o.t);
            } else if (o.op === "opkeys") {  // replace opacity keys: keys [[t,v],...] (ease out 33 / in 100)
                var op8 = tg(L(o.layer)).property("ADBE Opacity"); while (op8.numKeys) op8.removeKey(1);
                for (var q8 = 0; q8 < o.keys.length; q8++) op8.setValueAtTime(o.keys[q8][0], o.keys[q8][1]); easeAll(op8, 33, 100);
            } else if (o.op === "out") {
                var op2 = tg(L(o.layer)).property("ADBE Opacity"), du2 = o.d || 0.4;
                var cur = op2.valueAtTime(o.t, false);
                op2.setValueAtTime(o.t, cur); op2.setValueAtTime(o.t + du2, 0);
                var i1 = op2.nearestKeyIndex(o.t), i2 = op2.nearestKeyIndex(o.t + du2);
                var e1b = [new KeyframeEase(0, 33)], e2b = [new KeyframeEase(0, 80)];
                op2.setTemporalEaseAtKey(i1, e1b, e1b); op2.setTemporalEaseAtKey(i2, e2b, e2b);
            } else if (o.op === "box") { shape(o, "box"); }
            else if (o.op === "line") { shape(o, "line"); }
            else if (o.op === "dup") { var dl = L(o.layer).duplicate(); dl.name = o.name; }
            else if (o.op === "rename") { L(o.layer).name = o.name; }
            else if (o.op === "enable") { L(o.layer).enabled = o.on; }
            else if (o.op === "times") { var l5 = L(o.layer); if (o.inP !== undefined) l5.inPoint = o.inP; if (o.outP !== undefined) l5.outPoint = o.outP; }
            else if (o.op === "nullkeys") {
                var nl = null; for (var q = 1; q <= c.numLayers; q++) if (c.layer(q).nullLayer && /^Null 1/.test(c.layer(q).name)) nl = c.layer(q);
                var np = tg(nl).property("ADBE Position"); while (np.numKeys) np.removeKey(1);
                if (o.keys.length === 1) np.setValue(o.keys[0][1]);
                else { for (var q2 = 0; q2 < o.keys.length; q2++) np.setValueAtTime(o.keys[q2][0], o.keys[q2][1]); easeAll(np, 33, 100);
                    // straight camera paths: auto-bezier spatial tangents make the camera DRIFT between identical hold keys
                    for (var q9 = 1; q9 <= np.numKeys; q9++) { try { np.setSpatialAutoBezierAtKey(q9, false); np.setSpatialContinuousAtKey(q9, false); np.setSpatialTangentsAtKey(q9, [0, 0, 0], [0, 0, 0]); } catch (e) {} } }
            }
            else if (o.op === "nullscale") {   // scale every Null key's offset from key 1 by f
                var nl2 = null; for (var q4 = 1; q4 <= c.numLayers; q4++) if (c.layer(q4).nullLayer && /^Null 1/.test(c.layer(q4).name)) nl2 = c.layer(q4);
                var np2 = tg(nl2).property("ADBE Position"), k0 = np2.keyValue(1);
                for (var q5 = 2; q5 <= np2.numKeys; q5++) { var kv = np2.keyValue(q5), nv = []; for (var z5 = 0; z5 < kv.length; z5++) nv.push(k0[z5] + (kv[z5] - k0[z5]) * o.f); np2.setValueAtKey(q5, nv); }
            }
            else if (o.op === "cutkeys") {     // remove keys at/after `from` on a transform prop ("Opacity", "Position", "Scale")
                var cp = tg(L(o.layer)).property(o.prop); for (var q6 = cp.numKeys; q6 >= 1; q6--) if (cp.keyTime(q6) >= o.from - 1e-4) cp.removeKey(q6);
            }
            else if (o.op === "keyval") {      // set the value of the key nearest time t on a transform prop
                var kp = tg(L(o.layer)).property(o.prop); kp.setValueAtKey(kp.nearestKeyIndex(o.t), o.v);
            }
            else if (o.op === "addtext") {     // {name, text, font, size, color, just, c:[x,y,z], after?, glowFrom?}
                var tl = c.layers.addText(o.text); tl.name = o.name; tl.threeDLayer = o.is3D !== false;
                var tdp = tl.property("ADBE Text Properties").property("ADBE Text Document"), td = tdp.value;
                td.font = o.font || "Lato-Regular"; td.fontSize = o.size || 40; td.fillColor = o.color || WH; td.applyFill = true; td.applyStroke = false;
                td.justification = o.just === "L" ? ParagraphJustification.LEFT_JUSTIFY : (o.just === "R" ? ParagraphJustification.RIGHT_JUSTIFY : ParagraphJustification.CENTER_JUSTIFY);
                tdp.setValue(td);
                tg(tl).property("ADBE Position").setValue(tl.threeDLayer ? o.c : [o.c[0], o.c[1]]);
                if (o.after) tl.moveBefore(L(o.after));
                var g2 = o.glowFrom ? glowFrom(o.glowFrom) : null;
                if (g2) { var gl2 = tl.property("ADBE Effect Parade").addProperty("ADBE Glo2"); copyProps(g2, gl2); }
            }
            else if (o.op === "boxw") {        // set box-text width (layer units), keep height
                var bp = L(o.layer).property("ADBE Text Properties").property("ADBE Text Document"), bd = bp.value;
                bd.boxTextSize = [o.w, bd.boxTextSize[1]]; if (o.just === "J") bd.justification = ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT; if (o.just === "L") bd.justification = ParagraphJustification.LEFT_JUSTIFY; bp.setValue(bd);
            }
            else if (o.op === "remove") { L(o.layer).remove(); }
            else if (o.op === "scale") { var sc = tg(L(o.layer)).property("ADBE Scale"); while (sc.numKeys) sc.removeKey(1); sc.setValue(o.v); }
            else if (o.op === "opacity") { var oo = tg(L(o.layer)).property("ADBE Opacity"); while (oo.numKeys) oo.removeKey(1); oo.setValue(o.v); }
            else if (o.op === "order") { L(o.layer).moveBefore(L(o.before)); }
            else if (o.op === "retime") {
                var l6 = L(o.layer);
                (function walk(g) {
                    for (var q3 = 1; q3 <= g.numProperties; q3++) {
                        var pp; try { pp = g.property(q3); } catch (e) { continue; }
                        if (pp.propertyType === PropertyType.PROPERTY) {
                            if (pp.numKeys) {
                                var ks = []; for (var k3 = 1; k3 <= pp.numKeys; k3++) ks.push({ t: pp.keyTime(k3), v: pp.keyValue(k3), ie: pp.keyInTemporalEase(k3), oe: pp.keyOutTemporalEase(k3), ii: pp.keyInInterpolationType(k3), oi: pp.keyOutInterpolationType(k3) });
                                while (pp.numKeys) pp.removeKey(1);
                                for (var k4 = 0; k4 < ks.length; k4++) { var ni = pp.addKey(ks[k4].t + o.dt); pp.setValueAtKey(ni, ks[k4].v); try { pp.setInterpolationTypeAtKey(ni, ks[k4].ii, ks[k4].oi); pp.setTemporalEaseAtKey(ni, ks[k4].ie, ks[k4].oe); } catch (e) {} }
                            }
                        } else walk(pp);
                    }
                })(l6);
                if (l6.inPoint > 0) l6.inPoint = Math.max(0, l6.inPoint + o.dt);
            }
            out.push(n + ":" + o.op + " ok");
        } catch (e) { out.push(n + ":" + o.op + " ERR " + e.toString() + " line " + e.line); }
    }
    return JSON.stringify({ status: "success", o: out });
})();
