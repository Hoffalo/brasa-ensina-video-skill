// BRASA "art" builder: rebuilds a comp IN PLACE in the paises baratos G45 Abertura vocabulary (user: "real art").
// Left column: Hagrid yellow title + Lato subtitle + translucent cards that FLIP IN (X rot -80 -> 0, drop, fade) on cue.
// Right: a living visual synced to the list: wireframe GLOBE (pins pop + globe turns to face each place) or CHECKLIST
// panel (each row ticks on its cue). Camera: push-in then slow drift. Light glow on title/subtitle only.
// Everything is laid out in SCREEN px at the rest pose and converted through the camera (k = world units per px).
// $.global.ART = {comp, title, sub, items:[{text, t, hl:[...], lines:[{text,t,hl}]}], kind:"card"|"label"|"head",
//   visual:{type:"globe", pins:[{lat,lon,t,name}], face:[[t,lon,lat]...]} | {type:"check", label}, signs:{spin,tilt}}
(function () {
    var A = $.global.ART, c = null, log = [];
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === A.comp) c = it; }
    if (!c) return JSON.stringify({ status: "error", message: "no comp " + A.comp });
    var DUR = c.duration, YEL = [1, 0.8, 0.01], DG = [0.02, 0.25, 0.07], OFF = [0.95, 0.95, 0.95];
    var MX = 150, MY = 100;                          // design margins (safe margin is 100/80; keep air for the drift)
    // ---------- camera rig ----------
    var cam = null, nul = null;
    for (var j = 1; j <= c.numLayers; j++) { var L0 = c.layer(j); if (L0 instanceof CameraLayer) cam = L0; }
    nul = cam.parent; var ZOOM = 2344.5466, CAMOFF = 1400, P = [960, 540, -2000];
    var zp = cam.property("ADBE Camera Options Group").property("ADBE Camera Zoom"); while (zp.numKeys) zp.removeKey(1); zp.setValue(ZOOM);
    try { cam.property("ADBE Camera Options Group").property("ADBE Camera Depth of Field").setValue(0); } catch (e) {}
    cam.property("ADBE Transform Group").property("ADBE Position").setValue([0, 0, -CAMOFF]);
    try { cam.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, 0, 0]); } catch (e) {}
    // ---------- clear old content ----------
    for (var r = c.numLayers; r >= 1; r--) { var Lr = c.layer(r); if (Lr === cam || Lr === nul || /^(Deep Royal Blue|BG)/.test(Lr.name)) continue; Lr.remove(); }
    function K(z) { return (z - (P[2] - CAMOFF)) / ZOOM; }
    function W(sx, sy, z) { var k = K(z); return [P[0] + (sx - 960) * k, P[1] + (sy - 540) * k, z]; }
    function tg(L) { return L.property("ADBE Transform Group"); }
    function ease(p, outI, inI) {
        for (var q = 1; q <= p.numKeys; q++) {
            var dim = 1; try { if (!p.isSpatial && p.value instanceof Array) dim = p.value.length; } catch (e) {}
            var a = [], b = []; for (var z = 0; z < dim; z++) { a.push(new KeyframeEase(0, inI)); b.push(new KeyframeEase(0, outI)); }
            try { p.setTemporalEaseAtKey(q, a, b); } catch (e) {}
            if (p.isSpatial) { try { var zt = p.value.length === 3 ? [0, 0, 0] : [0, 0]; p.setSpatialAutoBezierAtKey(q, false); p.setSpatialContinuousAtKey(q, false); p.setSpatialTangentsAtKey(q, zt, zt); } catch (e) {} }
        }
    }
    // ---------- text ----------
    function mkText(name, str, font, px, color, just, z, runs, track) {
        var L = c.layers.addText(str); L.name = name; L.threeDLayer = true;
        var tp = L.property("ADBE Text Properties").property("ADBE Text Document"), d = tp.value, k = K(z);
        d.text = str; d.font = font; d.fontSize = px * k; d.fillColor = color; d.applyFill = true; d.applyStroke = false;
        d.tracking = track || 0; try { d.fontCapsOption = FontCapsOption.FONT_NORMAL_CAPS; } catch (e) {}
        d.justification = just === "C" ? ParagraphJustification.CENTER_JUSTIFY : ParagraphJustification.LEFT_JUSTIFY; tp.setValue(d);
        if (runs && runs.length) { d = tp.value; for (var q = 0; q < runs.length; q++) { var R = runs[q], cr = d.characterRange(R.s, R.e); if (R.font) cr.font = R.font; if (R.color) cr.fillColor = R.color; } tp.setValue(d); }
        tg(L).property("ADBE Anchor Point").setValue([0, 0, 0]);
        return L;
    }
    function widthPx(L, z) { var b = L.sourceRectAtTime(0, false); return b.width / K(z); }
    function runsFor(text, hl, num) {
        var rs = [];
        if (num) { var m = text.match(/^(\d+\.)\s/); if (m) rs.push({ s: 0, e: m[1].length, font: "Hagrid-Extrabold", color: YEL }); }
        for (var q = 0; q < (hl || []).length; q++) { var ix = text.indexOf(hl[q]); if (ix >= 0) rs.push({ s: ix, e: ix + hl[q].length, font: "Lato-Bold", color: YEL }); }
        return rs;
    }
    function glow(L) {
        var g = L.property("ADBE Effect Parade").addProperty("ADBE Glo2");
        g.property(1).setValue(2); g.property(2).setValue(203); g.property(3).setValue(80); g.property(4).setValue(1); g.property(5).setValue(1); g.property(6).setValue(3);
        g.property(7).setValue(2); g.property(8).setValue(1); g.property(12).setValue([1, 0.97, 0.82, 1]); g.property(13).setValue([1, 0.9, 0.5, 1]);
    }
    // ---------- shapes ----------
    function mkShape(name, kind, w, h, z, opt) {
        var S = c.layers.addShape(); S.name = name; S.threeDLayer = true; var k = K(z); opt = opt || {};
        var g = S.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"); g.name = "S";
        var vc = g.property("ADBE Vectors Group");
        if (kind === "rect") { var rr = vc.addProperty("ADBE Vector Shape - Rect"); rr.property("ADBE Vector Rect Size").setValue([w * k, h * k]); rr.property("ADBE Vector Rect Roundness").setValue((opt.round || 18) * k); }
        else if (kind === "ell") { var el = vc.addProperty("ADBE Vector Shape - Ellipse"); el.property("ADBE Vector Ellipse Size").setValue([w * k, h * k]); }
        else if (kind === "path") { var pg = vc.addProperty("ADBE Vector Shape - Group"); var sh = new Shape(); var vs = []; for (var q = 0; q < opt.pts.length; q++) vs.push([opt.pts[q][0] * k, opt.pts[q][1] * k]); sh.vertices = vs; sh.closed = false; pg.property("ADBE Vector Shape").setValue(sh); }
        if (opt.trim) vc.addProperty("ADBE Vector Filter - Trim");
        if (opt.fill) { var f = vc.addProperty("ADBE Vector Graphic - Fill"); f.property("ADBE Vector Fill Color").setValue(opt.fill); f.property("ADBE Vector Fill Opacity").setValue(opt.fillOp === undefined ? 100 : opt.fillOp); }
        if (opt.stroke) { var st = vc.addProperty("ADBE Vector Graphic - Stroke"); st.property("ADBE Vector Stroke Color").setValue(opt.stroke); st.property("ADBE Vector Stroke Width").setValue((opt.sw || 4) * k); try { st.property("ADBE Vector Stroke Line Cap").setValue(2); st.property("ADBE Vector Stroke Line Join").setValue(2); } catch (e) {} }
        return S;
    }
    function contents(S) { return S.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group"); }
    // ---------- layout: left column ----------
    var items = A.items || [], kind = A.kind || "card", T_PX = A.title_px || 104, S_PX = 46, ZT = -180, ZC = 0;
    var title = mkText("Titulo", A.title, "Hagrid-Extrabold", T_PX, YEL, "L", ZT, null, 10);
    var tw = widthPx(title, ZT);
    if (tw > 1920 - 2 * MX) { var f0 = (1920 - 2 * MX) / tw; T_PX *= f0; title.remove(); title = mkText("Titulo", A.title, "Hagrid-Extrabold", T_PX, YEL, "L", ZT, null, 10); tw = widthPx(title, ZT); }
    var sub = A.sub ? mkText("Subtitulo", A.sub, "Lato-Regular", S_PX, OFF, "L", ZC, null, 0) : null;
    // item text size: one size per class, shrink until the widest card fits the column
    var COLMAX = A.colmax || 820, PAD = 30, I_PX = kind === "label" ? 38 : 36, H_PX = 34, L_PX = 32;
    function build(px) {
        var made = [];
        for (var q = 0; q < items.length; q++) {
            var itq = items[q], o = {};
            if (kind === "label") o.main = mkText("Card " + q + " label", itq.text, "Hagrid-Extrabold", px, OFF, "C", ZC - 20, null, 15);
            else if (kind === "head") {
                o.main = mkText("Card " + q + " head", itq.text, "Hagrid-Extrabold", H_PX * px / I_PX, OFF, "L", ZC - 20, null, 15); o.lines = [];
                for (var li = 0; li < (itq.lines || []).length; li++) { var ln = itq.lines[li]; o.lines.push(mkText("Card " + q + " line " + (li + 1), ln.text, "Lato-Regular", L_PX * px / I_PX, OFF, "L", ZC - 20, runsFor(ln.text, ln.hl, false), 0)); }
            } else o.main = mkText("Card " + q + " text", itq.text, "Lato-Regular", px, OFF, "L", ZC - 20, runsFor(itq.text, itq.hl, true), 0);
            made.push(o);
        }
        return made;
    }
    function maxW(made) { var m = 0; for (var q = 0; q < made.length; q++) { m = Math.max(m, widthPx(made[q].main, ZC - 20)); for (var li = 0; li < (made[q].lines || []).length; li++) m = Math.max(m, widthPx(made[q].lines[li], ZC - 20)); } return m; }
    function kill(made) { for (var q = 0; q < made.length; q++) { made[q].main.remove(); for (var li = 0; li < (made[q].lines || []).length; li++) made[q].lines[li].remove(); } }
    var made = build(I_PX), mw = maxW(made);
    if (mw + 2 * PAD > COLMAX) { var sc = (COLMAX - 2 * PAD) / mw; kill(made); I_PX *= sc; made = build(I_PX); mw = maxW(made); }
    var CW = Math.max(kind === "label" ? 420 : 520, Math.ceil(mw + 2 * PAD)), CAP = 0.72;
    var hp = H_PX * I_PX / 36, lp = L_PX * I_PX / 36;
    var nl = 0; for (var q0 = 0; q0 < items.length; q0++) nl = Math.max(nl, (items[q0].lines || []).length);
    var CH = kind === "head" ? Math.round(26 + hp * CAP + (nl ? 18 + nl * lp * 1.25 - lp * 0.25 : 0) + 26 + lp * 0.2) : (kind === "label" ? 74 : 76);
    var GAP = kind === "head" ? 20 : 16;
    var capT = T_PX * CAP, subGap = 62, listGap = sub ? 54 : 64;
    var listH = items.length * CH + (items.length - 1) * GAP;
    var total = capT + (sub ? subGap : 0) + listGap + listH;
    var ytop = Math.max(MY + 30, Math.round((1080 - total) / 2));
    var X0 = MX;
    var tBase = ytop + capT, sBase = tBase + subGap, listTop = (sub ? sBase : tBase) + listGap;
    // title / subtitle placement (baseline-left at X0), entrances: slide from the left + fade (G45)
    function placeSlide(L, sx, sy, z, t, dx) {
        var p = tg(L).property("ADBE Position"), o = tg(L).property("ADBE Opacity"), w1 = W(sx, sy, z), w0 = W(sx - dx, sy, z);
        p.setValueAtTime(t, w0); p.setValueAtTime(t + 0.32, w1); o.setValueAtTime(t, 0); o.setValueAtTime(t + 0.27, 100); ease(p, 33, 100); ease(o, 33, 100);
    }
    placeSlide(title, X0 - 4, tBase, ZT, 0.15, 37); glow(title);
    if (sub) { placeSlide(sub, X0, sBase, ZC, 0.5, 40); }   // no glow on the subtitle: AE intermittently drops glowed 3D Lato text
    // cards
    var cards = [];
    for (var q1 = 0; q1 < items.length; q1++) {
        var itm = items[q1], cy = listTop + q1 * (CH + GAP) + CH / 2, cx = X0 + CW / 2, o1 = made[q1];
        var card = mkShape("Card " + q1, "rect", CW, CH, ZC, { round: 18, fill: DG, fillOp: 55, stroke: YEL, sw: 4 });
        tg(card).property("ADBE Position").setValue(W(cx, cy, ZC));
        // text at final world position, then parent to the card (card is still static here)
        if (kind === "label") tg(o1.main).property("ADBE Position").setValue(W(cx, cy + I_PX * CAP / 2, ZC - 20));
        else if (kind === "head") {
            var hb = cy - CH / 2 + 26 + hp * CAP; tg(o1.main).property("ADBE Position").setValue(W(X0 + PAD, hb, ZC - 20));
            for (var li1 = 0; li1 < o1.lines.length; li1++) tg(o1.lines[li1]).property("ADBE Position").setValue(W(X0 + PAD, hb + 18 + lp * CAP + li1 * lp * 1.25 + 4, ZC - 20));
        } else tg(o1.main).property("ADBE Position").setValue(W(X0 + PAD, cy + I_PX * CAP / 2, ZC - 20));
        var kids = [o1.main].concat(o1.lines || []);
        for (var kq = 0; kq < kids.length; kq++) kids[kq].parent = card;
        // flip-in (G45): X rot -80 -> 0, drop from 90 px above, fade 0.2 s; children fade with it
        var t0 = itm.t, ps = tg(card).property("ADBE Position"), fin = ps.value, k1 = K(ZC);
        ps.setValueAtTime(t0, [fin[0], fin[1] - 90 * k1, fin[2]]); ps.setValueAtTime(t0 + 0.35, fin);
        var xr = tg(card).property("ADBE Rotate X"); xr.setValueAtTime(t0, -80); xr.setValueAtTime(t0 + 0.35, 0);
        var op = tg(card).property("ADBE Opacity"); op.setValueAtTime(t0, 0); op.setValueAtTime(t0 + 0.2, 100);
        ease(ps, 40, 90); ease(xr, 40, 90); ease(op, 40, 90);
        var mo = tg(o1.main).property("ADBE Opacity"); mo.setValueAtTime(t0, 0); mo.setValueAtTime(t0 + 0.2, 100); ease(mo, 40, 90);
        for (var li2 = 0; li2 < (o1.lines || []).length; li2++) {
            var lt = Math.max(itm.lines[li2].t, t0 + 0.2 + 0.15 * li2), lo = tg(o1.lines[li2]).property("ADBE Opacity"), lpp = tg(o1.lines[li2]).property("ADBE Position"), lv = lpp.value;
            lo.setValueAtTime(lt, 0); lo.setValueAtTime(lt + 0.3, 100); lpp.setValueAtTime(lt, [lv[0], lv[1] + 18, lv[2]]); lpp.setValueAtTime(lt + 0.35, lv); ease(lo, 33, 100); ease(lpp, 33, 100);
        }
        cards.push({ L: card, t: t0, cy: cy });
    }
    var colRight = X0 + Math.max(CW, sub ? widthPx(sub, ZC) : 0);
    // ---------- right visual ----------
    var V = A.visual || { type: "none" }, vx0 = Math.max(colRight + 90, 1060), vcx = (vx0 + 1920 - MX) / 2, vcy = 560;
    var D = Math.min(560, (1920 - MX) - vx0, 1080 - 2 * MY - 60), vt = 0.3;
    if (V.type === "globe") {
        var R = D / 2, kz = K(0), sgS = (A.signs && A.signs.spin) || 1, sgT = (A.signs && A.signs.tilt) || 1;
        var tilt = c.layers.addNull(); tilt.name = "Globo Tilt"; tilt.threeDLayer = true; tilt.enabled = false; tg(tilt).property("ADBE Position").setValue(W(vcx, vcy, 0)); tg(tilt).property("ADBE Anchor Point").setValue([0, 0, 0]);
        var spin = c.layers.addNull(); spin.name = "Globo Spin"; spin.threeDLayer = true; spin.enabled = false; spin.parent = tilt; tg(spin).property("ADBE Position").setValue([0, 0, 0]); tg(spin).property("ADBE Anchor Point").setValue([0, 0, 0]);
        var disc = mkShape("Globo disco", "ell", D, D, 0, { fill: DG, fillOp: 100, stroke: YEL, sw: 5 });
        tg(disc).property("ADBE Position").setValue(W(vcx, vcy, 0));
        var ds = tg(disc).property("ADBE Scale"); ds.setValueAtTime(vt, [0, 0, 100]); ds.setValueAtTime(vt + 0.5, [104, 104, 100]); ds.setValueAtTime(vt + 0.55, [100, 100, 100]); ease(ds, 40, 90);
        var lats = [-60, -30, 0, 30, 60];
        for (var a1 = 0; a1 < lats.length; a1++) {
            var la = lats[a1] * Math.PI / 180, dd = D * Math.cos(la);
            var pl = mkShape("Paralelo " + lats[a1], "ell", dd, dd, 0, { stroke: YEL, sw: 2.5 }); pl.parent = spin;
            tg(pl).property("ADBE Position").setValue([0, -R * Math.sin(la) * kz, 0]); tg(pl).property("ADBE Rotate X").setValue(90);
            var po = tg(pl).property("ADBE Opacity"); po.setValueAtTime(vt - 0.2 < 0 ? 0 : vt - 0.2, 0); po.setValueAtTime(vt + 0.32, lats[a1] === 0 ? 80 : 55); ease(po, 33, 100);
        }
        for (var m1 = 0; m1 < 6; m1++) {
            var me = mkShape("Meridiano " + m1, "ell", D, D, 0, { stroke: YEL, sw: 2.5 }); me.parent = spin;
            tg(me).property("ADBE Position").setValue([0, 0, 0]); tg(me).property("ADBE Rotate Y").setValue(m1 * 30);
            var mo2 = tg(me).property("ADBE Opacity"); mo2.setValueAtTime(vt - 0.2 < 0 ? 0 : vt - 0.2, 0); mo2.setValueAtTime(vt + 0.32, 55); ease(mo2, 33, 100);
        }
        var pins = V.pins || [];
        for (var p1 = 0; p1 < pins.length; p1++) {
            var pn = pins[p1], plat = pn.lat * Math.PI / 180, plon = pn.lon * Math.PI / 180;
            var pin = mkShape("Pin " + (pn.name || p1), "ell", 26, 26, 0, { fill: YEL, stroke: DG, sw: 5 }); pin.parent = spin;
            tg(pin).property("ADBE Position").setValue([R * Math.cos(plat) * Math.sin(plon) * kz * 1.02, -R * Math.sin(plat) * kz * 1.02, -R * Math.cos(plat) * Math.cos(plon) * kz * 1.02]);
            try { pin.autoOrient = AutoOrientType.CAMERA_OR_POINT_OF_INTEREST; } catch (e) {}
            var psc = tg(pin).property("ADBE Scale"); psc.setValueAtTime(pn.t, [0, 0, 100]); psc.setValueAtTime(pn.t + 0.3, [110, 110, 100]); psc.setValueAtTime(pn.t + 0.45, [100, 100, 100]);
            if (V.ripple) { var rt = V.ripple + p1 * 0.05; psc.setValueAtTime(rt, [100, 100, 100]); psc.setValueAtTime(rt + 0.15, [140, 140, 100]); psc.setValueAtTime(rt + 0.4, [100, 100, 100]); }
            ease(psc, 40, 90);
        }
        // spin: face each place on its cue (fast whip), slow drift otherwise; tilt follows latitude
        var face = V.face || [], ys = tg(spin).property("ADBE Rotate Y"), xs = tg(tilt).property("ADBE Rotate X");
        if (face.length) {
            ys.setValueAtTime(0, sgS * (-face[0][1]) + 25); xs.setValueAtTime(0, sgT * face[0][2]);
            for (var f1 = 0; f1 < face.length; f1++) { ys.setValueAtTime(face[f1][0] + 0.45, sgS * (-face[f1][1])); xs.setValueAtTime(face[f1][0] + 0.45, sgT * face[f1][2]); if (f1 === 0) { ys.setValueAtTime(Math.max(0.6, face[0][0] - 0.05), sgS * (-face[0][1]) + 6); } }
            ys.setValueAtTime(DUR, sgS * (-face[face.length - 1][1]) - 12);
            ease(ys, 40, 90); ease(xs, 40, 90);
        }
    } else if (V.type === "check") {
        var n = items.length, PW = Math.min(D + 40, 600), RH = 74, PH = 110 + n * RH + 30;
        if (PH > 1080 - 2 * MY) { RH = (1080 - 2 * MY - 140) / n; PH = 110 + n * RH + 30; }
        var panel = mkShape("Painel", "rect", PW, PH, 0, { round: 24, fill: DG, fillOp: 55, stroke: YEL, sw: 4 });
        tg(panel).property("ADBE Position").setValue(W(vcx, vcy, 0));
        var hd = mkText("Painel titulo", V.label || "CHECKLIST", "Hagrid-Extrabold", 36, YEL, "L", -10, null, 15);
        tg(hd).property("ADBE Position").setValue(W(vcx - PW / 2 + 40, vcy - PH / 2 + 40 + 36 * CAP, -10)); hd.parent = panel;
        var hl1 = mkShape("Painel linha", "rect", PW - 80, 3, -10, { round: 0, fill: YEL, fillOp: 70 }); tg(hl1).property("ADBE Position").setValue(W(vcx, vcy - PH / 2 + 98, -10)); hl1.parent = panel;
        for (var r1 = 0; r1 < n; r1++) {
            var ry = vcy - PH / 2 + 110 + RH * r1 + RH / 2 + 4, bx = vcx - PW / 2 + 40 + 21, tr = items[r1].t;
            var box = mkShape("Check " + r1, "rect", 42, 42, -10, { round: 10, fill: YEL, fillOp: 0, stroke: YEL, sw: 3 }); tg(box).property("ADBE Position").setValue(W(bx, ry, -10)); box.parent = panel;
            var bf = contents(box).property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Opacity"); bf.setValueAtTime(tr, 0); bf.setValueAtTime(tr + 0.15, 100); ease(bf, 40, 90);
            var bs = tg(box).property("ADBE Scale"); bs.setValueAtTime(tr, [100, 100, 100]); bs.setValueAtTime(tr + 0.15, [118, 118, 100]); bs.setValueAtTime(tr + 0.4, [100, 100, 100]); ease(bs, 40, 90);
            var ck = mkShape("Check " + r1 + " marca", "path", 0, 0, -14, { pts: [[-10, 1], [-3, 9], [11, -8]], stroke: DG, sw: 6, trim: true }); tg(ck).property("ADBE Position").setValue(W(bx, ry, -14)); ck.parent = panel;
            var te = contents(ck).property("ADBE Vector Filter - Trim").property("ADBE Vector Trim End"); te.setValueAtTime(tr + 0.08, 0); te.setValueAtTime(tr + 0.38, 100); ease(te, 33, 100);
            var bw2 = PW - 80 - 42 - 28, bar = mkShape("Barra " + r1, "rect", bw2, 14, -10, { round: 7, fill: OFF, fillOp: 25 }); tg(bar).property("ADBE Position").setValue(W(bx + 21 + 28 + bw2 / 2, ry, -10)); bar.parent = panel;
            var barc = contents(bar).property("ADBE Vector Graphic - Fill"), bcol = barc.property("ADBE Vector Fill Color"), bop = barc.property("ADBE Vector Fill Opacity");
            bcol.setValueAtTime(tr, OFF); bcol.setValueAtTime(tr + 0.25, YEL); bop.setValueAtTime(tr, 25); bop.setValueAtTime(tr + 0.25, 85); ease(bcol, 40, 90); ease(bop, 40, 90);
        }
        // panel entrance: card flip (X rot -80 -> 0, drop, fade), then a gentle float (living). It must END flat:
        // a shape layer left rotated on Y gets clipped by AE along a straight line (seen on OA4).
        var xr2 = tg(panel).property("ADBE Rotate X"), pop = tg(panel).property("ADBE Opacity"), pp2 = tg(panel).property("ADBE Position"), pv = pp2.value, kp = K(0);
        xr2.setValueAtTime(vt, -80); xr2.setValueAtTime(vt + 0.45, 0); pop.setValueAtTime(vt, 0); pop.setValueAtTime(vt + 0.25, 100);
        pp2.setValueAtTime(vt, [pv[0], pv[1] - 90 * kp, pv[2]]); pp2.setValueAtTime(vt + 0.45, pv); pp2.setValueAtTime(DUR, [pv[0], pv[1] - 10 * kp, pv[2]]);
        ease(xr2, 40, 90); ease(pop, 40, 90); ease(pp2, 40, 90);
    }
    // ---------- camera: push-in then slow drift (linear spatial, right-skewed eases) ----------
    var np = tg(nul).property("ADBE Position"); while (np.numKeys) np.removeKey(1);
    np.setValueAtTime(0, [P[0], P[1], P[2] - 500]); np.setValueAtTime(0.6, P); np.setValueAtTime(DUR, [P[0], P[1], P[2] + 60]); ease(np, 33, 100);
    var nr = ["ADBE Rotate X", "ADBE Rotate Y", "ADBE Rotate Z", "ADBE Orientation"]; for (var q2 = 0; q2 < nr.length; q2++) { var pr = tg(nul).property(nr[q2]); try { while (pr.numKeys) pr.removeKey(1); } catch (e) {} }
    app.project.save();
    return JSON.stringify({ status: "success", o: ["cards " + items.length + " CW " + CW + " CH " + CH + " item_px " + Math.round(I_PX) + " title_px " + Math.round(T_PX) + " ytop " + ytop + " colRight " + Math.round(colRight) + " visual " + V.type + " D " + Math.round(D) + " at " + Math.round(vcx)] });
})();
