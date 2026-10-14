// Spreadsheet table in the house style inside comp cfg.comp. Text styles cloned from cfg.base (a caption layer).
// $.global.TB = {comp, base, x, y, w, rh, split, tBox, rows:[{label, value, t, yellow, thick, fill, font, vfont, size}], note:{text,t}}
(function () {
    var cfg = $.global.TB, c = null, out = [];
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) c = it; }
    var base = null; for (var j = 1; j <= c.numLayers; j++) if (c.layer(j).name === cfg.base) base = c.layer(j);
    if (!base) return JSON.stringify({ status: "error", message: "no base layer" });
    var YEL = [1, 0.8, 0.01], DG = [0.012, 0.341, 0.102], WH = [0.957, 0.957, 0.957];
    function ease(p) {
        var dim = 1;
        if (p.propertyValueType === PropertyValueType.ThreeD || p.propertyValueType === PropertyValueType.TwoD) dim = p.value.length;
        var a = [], b = []; for (var z = 0; z < dim; z++) { a.push(new KeyframeEase(0, 16.67)); b.push(new KeyframeEase(0, 100)); }
        try { p.setTemporalEaseAtKey(1, a, a); p.setTemporalEaseAtKey(2, b, b); } catch (e) {}
    }
    function animIn(L, t, dy) {
        var tg = L.property("ADBE Transform Group"), op = tg.property("ADBE Opacity"), ps = tg.property("ADBE Position");
        var v = ps.value; ps.setValueAtTime(t, [v[0], v[1] + (dy || 40), v[2]]); ps.setValueAtTime(t + 0.42, v);
        op.setValueAtTime(t, 0); op.setValueAtTime(t + 0.42, 100); ease(ps); ease(op);
    }
    function clearKeys(L) { (function w(g) { for (var q = 1; q <= g.numProperties; q++) { var p; try { p = g.property(q); } catch (e) { continue; } if (p.propertyType === PropertyType.PROPERTY) { try { while (p.numKeys) p.removeKey(1); } catch (e) {} } else { try { if (p.numProperties) w(p); } catch (e) {} } } })(L); }
    function text(str, x, y, size, color, font, t, name) {
        var L = base.duplicate(); L.enabled = true; L.name = name; clearKeys(L);
        var fx = L.property("ADBE Effect Parade"); for (var e = fx.numProperties; e >= 1; e--) if (fx.property(e).matchName === "ADBE Geometry2") fx.property(e).remove();
        var tp = L.property("ADBE Text Properties").property("ADBE Text Document"), d = tp.value;
        d.text = str; d.fontSize = size; d.applyFill = true; d.fillColor = color; if (font) d.font = font; d.justification = ParagraphJustification.LEFT_JUSTIFY; tp.setValue(d);
        var tg = L.property("ADBE Transform Group"); tg.property("ADBE Anchor Point").setValue([0, 0, 0]); tg.property("ADBE Scale").setValue([100, 100, 100]); tg.property("ADBE Opacity").setValue(100);
        tg.property("ADBE Position").setValue([x, y, 0]); animIn(L, t); out.push("text " + str); return L;
    }
    function rect(name, cx, cy, w, h, round, stroke, fill, t, kind) {
        var S = c.layers.addShape(); S.name = name; S.threeDLayer = true; S.moveBefore(base);
        var g = S.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"); g.name = "R";
        var vc = g.property("ADBE Vectors Group"); vc.addProperty("ADBE Vector Shape - Rect");
        if (kind === "draw") vc.addProperty("ADBE Vector Filter - Trim");
        if (fill) vc.addProperty("ADBE Vector Graphic - Fill");
        if (stroke) vc.addProperty("ADBE Vector Graphic - Stroke");
        vc = S.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group");
        var r = vc.property("ADBE Vector Shape - Rect"); r.property("ADBE Vector Rect Size").setValue([w, h]); r.property("ADBE Vector Rect Roundness").setValue(round);
        if (fill) vc.property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(fill);
        if (stroke) { var st = vc.property("ADBE Vector Graphic - Stroke"); st.property("ADBE Vector Stroke Color").setValue(stroke[0]); st.property("ADBE Vector Stroke Width").setValue(stroke[1]); }
        var tg = S.property("ADBE Transform Group");
        if (kind === "wipe") {
            tg.property("ADBE Anchor Point").setValue([-w / 2, 0, 0]); tg.property("ADBE Position").setValue([cx - w / 2, cy, 0]);
            var sc = tg.property("ADBE Scale"); sc.setValueAtTime(t, [0, 100, 100]); sc.setValueAtTime(t + 0.4, [100, 100, 100]); ease(sc);
        } else tg.property("ADBE Position").setValue([cx, cy, 0]);
        if (kind === "draw") {
            var tr = S.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").property("ADBE Vector Filter - Trim");
            var te = tr.property("ADBE Vector Trim End"); te.setValueAtTime(t, 0); te.setValueAtTime(t + 0.55, 100); ease(te); tr.property("ADBE Vector Trim Offset").setValue(-90);
        }
        if (kind === "pop") { var s2 = tg.property("ADBE Scale"), o2 = tg.property("ADBE Opacity"); s2.setValueAtTime(t, [92, 92, 100]); s2.setValueAtTime(t + 0.35, [100, 100, 100]); o2.setValueAtTime(t, 0); o2.setValueAtTime(t + 0.35, 100); ease(s2); ease(o2); }
        if (kind === "fade") { var o3 = tg.property("ADBE Opacity"); o3.setValueAtTime(t, 0); o3.setValueAtTime(t + 0.4, 100); ease(o3); }
        out.push("rect " + name); return S;
    }
    var X0 = cfg.x, Y0 = cfg.y, W = cfg.w, RH = cfg.rh, N = cfg.rows.length, H = RH * N, XD = X0 + cfg.split;
    rect("Tabela box", X0 + W / 2, Y0 + H / 2, W, H, 22, [YEL, 4], null, cfg.tBox, "draw");
    rect("Tabela divisoria", XD, Y0 + H / 2, 3, H - 8, 0, null, YEL, cfg.tBox + 0.3, "fade");
    for (var k = 0; k < N; k++) {
        var R = cfg.rows[k], cy = Y0 + RH * k + RH / 2, ty = cy + 16;
        if (k > 0 && !R.fill) rect("Linha " + (k + 1), X0 + W / 2, Y0 + RH * k, W - 8, R.thick ? 4 : 2, 0, null, YEL, R.t - 0.05, "wipe");
        if (R.fill) rect("Fundo " + R.label, X0 + W / 2, cy, W - 12, RH - 10, 16, null, YEL, R.t, "pop");
        text(R.label, X0 + 40, ty, R.size || 46, R.fill ? DG : (R.yellow ? YEL : WH), R.font, R.t + 0.05, "Celula " + R.label);
        text(R.value, XD + 40, ty, 46, R.fill ? DG : [0.8, 0.85, 0.8], R.vfont, R.t + 0.15, "Valor " + R.label);
    }
    if (cfg.note) text(cfg.note.text, X0, Y0 + H + 64, 36, WH, null, cfg.note.t, "Nota");
    return JSON.stringify({ status: "success", o: out });
})();
