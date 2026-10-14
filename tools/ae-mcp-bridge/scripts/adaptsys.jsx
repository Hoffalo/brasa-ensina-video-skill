// Adapt a comp built outside the house system to the BRASA Ensina system WITHOUT changing its design:
//  1. house background (copied from a house comp) far behind the content -> parallax
//  2. Null + Camera rig (camera parented to "Null 1" at [0,0,-1400]; the camera's moves move to the Null)
//  3. depth: unparented title-like text (Hagrid >= 70 px) pulled toward camera with compensation (same layout at rest)
//  4. framing: every camera rest re-aimed and re-distanced so the content of that rest fills the safe area
//  5. no source credits ("Fonte: ..."), no italics (Lato Italic -> Lato Regular, faux italic off)
// $.global.MCP_ADAPT = { comp: "...", bgFrom: "G20", mx: 120, my: 100, maxEnlarge: 1.6, titleZ: -180, bgZ: 1500 }
(function () {
    var cfg = $.global.MCP_ADAPT, log = [];
    try {
    var MX = cfg.mx || 120, MY = cfg.my || 100;
    function C(n) { for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === n) return it; } }
    var comp = C(cfg.comp), house = C(cfg.bgFrom || "G20");
    if (!comp) throw new Error("comp not found: " + cfg.comp);
    var cam = null, bgOld = null;
    for (var j = 1; j <= comp.numLayers; j++) { var L = comp.layer(j); if (L instanceof CameraLayer) cam = L; if (/^BG/.test(L.name)) bgOld = L; }
    var ZOOM = cam.property("ADBE Camera Options Group").property("ADBE Camera Zoom").value;

    // ---- 5. credits + italics ----
    for (var k = comp.numLayers; k >= 1; k--) {
        var T = comp.layer(k); if (!(T instanceof TextLayer)) continue;
        var tp = T.property("ADBE Text Properties").property("ADBE Text Document"), d = tp.value;
        if (/^\s*Fonte\s*:/i.test(d.text)) { log.push("removed credit '" + d.text.substr(0, 30) + "'"); T.remove(); continue; }
        function deItal(doc) { var ch = false;
            for (var c = 0; c < doc.text.length; c++) {
                var cr = doc.characterRange(c, c + 1);
                try { if (/Italic/i.test(cr.font)) { cr.font = cr.font.replace(/-?Italic$/i, "-Regular").replace(/BoldItalic/i, "Bold"); ch = true; } } catch (e) {}
                try { if (cr.fauxItalic) { cr.fauxItalic = false; ch = true; } } catch (e) {}
            }
            return ch; }
        var changed = false;
        if (tp.numKeys) { for (var sk0 = 1; sk0 <= tp.numKeys; sk0++) { var kd = tp.keyValue(sk0); if (deItal(kd)) { tp.setValueAtKey(sk0, kd); changed = true; } } }
        else if (deItal(d)) { tp.setValue(d); changed = true; }
        if (changed) log.push("de-italicised '" + T.name.substr(0, 24) + "'");
    }

    // ---- 2. Null + camera rig ----
    var pos = cam.property("ADBE Transform Group").property("ADBE Position");
    var keys = [];
    for (var q = 1; q <= pos.numKeys; q++) keys.push({ t: pos.keyTime(q), v: pos.keyValue(q), ie: pos.keyInTemporalEase(q), oe: pos.keyOutTemporalEase(q), ii: pos.keyInInterpolationType(q), oi: pos.keyOutInterpolationType(q) });
    if (!keys.length) keys.push({ t: 0, v: pos.value });
    var nul = comp.layers.addNull(comp.duration); nul.name = "Null 1"; nul.threeDLayer = true; nul.enabled = false;
    nul.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, 0, 0]);
    var np = nul.property("ADBE Transform Group").property("ADBE Position");
    // ---- 4. framing per rest (computed on the original camera path, before re-parenting) ----
    function boundsAt(t) {
        var tmp = comp.layers.addText("x"), ids = [];
        for (var a = 1; a <= comp.numLayers; a++) {
            var A = comp.layer(a);
            if (A === tmp || A === nul || A instanceof CameraLayer || !A.enabled || /^BG/.test(A.name) || A.nullLayer || A.adjustmentLayer) continue;
            ids.push(A.index);
        }
        var sp = tmp.property("ADBE Text Properties").property("ADBE Text Document");
        sp.expression = "var ids=[" + ids.join(",") + "];var o=[1e9,1e9,-1e9,-1e9],n=0;for(var i=0;i<ids.length;i++){var L=thisComp.layer(ids[i]);if(L.opacity<5)continue;" +
            "var p=L;var vis=true;while(p.hasParent){p=p.parent;}var r=L.sourceRectAtTime(time,false);if(r.width<1||r.height<1)continue;" +
            "var c=[[r.left,r.top],[r.left+r.width,r.top],[r.left,r.top+r.height],[r.left+r.width,r.top+r.height]];" +
            "var sc=L.toComp([r.left+r.width/2,r.top+r.height/2]);if(sc[0]<0||sc[0]>thisComp.width||sc[1]<0||sc[1]>thisComp.height)continue;" +
            "for(var j=0;j<4;j++){var w=L.toWorld(c[j]);" +
            "o[0]=Math.min(o[0],w[0]);o[1]=Math.min(o[1],w[1]);o[2]=Math.max(o[2],w[0]);o[3]=Math.max(o[3],w[1]);n++;}}JSON.stringify(o.concat([n]));";
        var r = eval(sp.valueAtTime(t, false).text); tmp.remove(); return r;
    }
    // group keys into rests: consecutive keys with ~same x/y
    var groups = [], cur = [];
    for (var g = 0; g < keys.length; g++) {
        if (cur.length && (Math.abs(keys[g].v[0] - cur[cur.length - 1].v[0]) > 1 || Math.abs(keys[g].v[1] - cur[cur.length - 1].v[1]) > 1)) { groups.push(cur); cur = []; }
        cur.push(keys[g]);
    }
    groups.push(cur);
    var newPos = [];
    var availW = comp.width - 2 * MX, availH = comp.height - 2 * MY, maxE = cfg.maxEnlarge || 1.6;
    for (var gi = 0; gi < groups.length; gi++) {
        var G = groups[gi], last = G[G.length - 1];
        var isIntro = (G.length === 1 && gi + 1 < groups.length && groups[gi + 1][0].t - last.t < 1.2);
        if (isIntro) { newPos.push(null); continue; }
        var tEnd = (gi + 1 < groups.length) ? Math.min(groups[gi + 1][0].t, G.length > 1 ? last.t : groups[gi + 1][0].t) - 0.05 : comp.duration - 0.05;
        var b = boundsAt(tEnd);
        var origD = -last.v[2];
        if (b[4] === 0) { for (var z0 = 0; z0 < G.length; z0++) newPos.push(G[z0].v); continue; }
        var bw = b[2] - b[0], bh = b[3] - b[1], cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2;
        var D = ZOOM * Math.max(bw / availW, bh / availH);
        D = Math.max(D, ZOOM / maxE);
        for (var z1 = 0; z1 < G.length; z1++) { var ratio = (-G[z1].v[2]) / origD; newPos.push([cx, cy, -D * ratio]); }
        log.push("rest " + gi + " (to " + Math.round(tEnd * 10) / 10 + "s): content " + Math.round(bw) + "x" + Math.round(bh) + " -> camera dist " + Math.round(D) + " (x" + Math.round(ZOOM / D * 100) / 100 + ")");
    }
    // intro keys keep their original offset relative to the following rest (scaled by distance)
    for (var ni = 0; ni < newPos.length; ni++) {
        if (newPos[ni]) continue;
        var nx = newPos[ni + 1], ox = keys[ni].v, onx = keys[ni + 1].v, s = (-nx[2]) / (-onx[2]);
        newPos[ni] = [nx[0] + (ox[0] - onx[0]) * s, nx[1] + (ox[1] - onx[1]) * s, nx[2] + (ox[2] - onx[2]) * s];
    }
    var OFF = 1400;
    for (var w2 = 0; w2 < keys.length; w2++) {
        var v = [newPos[w2][0], newPos[w2][1], newPos[w2][2] + OFF];
        if (keys.length === 1) { np.setValue(v); break; }
        np.setValueAtTime(keys[w2].t, v);
    }
    for (var w3 = 0; w3 < keys.length && keys.length > 1; w3++) {
        try { np.setInterpolationTypeAtKey(w3 + 1, keys[w3].ii, keys[w3].oi); np.setTemporalEaseAtKey(w3 + 1, keys[w3].ie, keys[w3].oe); } catch (e) {}
    }
    while (pos.numKeys) pos.removeKey(1);
    cam.parent = nul; pos.setValue([0, 0, -OFF]);
    cam.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
    nul.moveToBeginning();
    log.push("rig: Null 1 + camera at [0,0,-1400], " + keys.length + " keys moved to the Null");

    // ---- 3. depth for big titles ----
    var restD = -newPos[newPos.length - 1][2], TZ = cfg.titleZ === undefined ? -180 : cfg.titleZ, nt = 0;
    for (var h = 1; h <= comp.numLayers; h++) {
        var H = comp.layer(h); if (!(H instanceof TextLayer) || H.parent || !H.threeDLayer) continue;
        var hd = H.property("ADBE Text Properties").property("ADBE Text Document").value;
        if (!/^Hagrid/i.test(hd.font) || hd.fontSize < 70) continue;
        var tg = H.property("ADBE Transform Group"), hp = tg.property("ADBE Position"), hs = tg.property("ADBE Scale");
        var f = (restD + TZ) / restD;
        // pivot = where the rest camera looks
        var px = newPos[newPos.length - 1][0], py = newPos[newPos.length - 1][1];
        function mv(vv) { return [px + (vv[0] - px) * f, py + (vv[1] - py) * f, (vv[2] || 0) + TZ]; }
        if (hp.dimensionsSeparated) continue;
        if (hp.numKeys) { for (var hk = 1; hk <= hp.numKeys; hk++) hp.setValueAtKey(hk, mv(hp.keyValue(hk))); } else hp.setValue(mv(hp.value));
        if (hs.numKeys) { for (var sk = 1; sk <= hs.numKeys; sk++) { var sv = hs.keyValue(sk); hs.setValueAtKey(sk, [sv[0] * f, sv[1] * f, sv[2] * f]); } } else { var sv2 = hs.value; hs.setValue([sv2[0] * f, sv2[1] * f, sv2[2] * f]); }
        nt++;
    }
    log.push(nt + " title layer(s) pulled forward to z=" + TZ);

    // ---- 1. house background ----
    var src = null;
    for (var bb = 1; bb <= house.numLayers; bb++) if (/^Deep Royal Blue/.test(house.layer(bb).name)) { src = house.layer(bb); break; }
    src.copyToComp(comp);
    var bg = null;
    for (var bq = 1; bq <= comp.numLayers; bq++) if (/^Deep Royal Blue/.test(comp.layer(bq).name) && !(comp.layer(bq) instanceof CameraLayer) && !comp.layer(bq).nullLayer) { bg = comp.layer(bq); break; }
    if (!bg || bg === nul) throw new Error("house BG copy not found");
    bg.moveToEnd();
    var BZ = cfg.bgZ || 1500, farD = 0;
    for (var fz = 0; fz < newPos.length; fz++) farD = Math.max(farD, -newPos[fz][2]);
    bg.threeDLayer = true;
    var btg = bg.property("ADBE Transform Group");
    var bp = btg.property("ADBE Position"); while (bp.numKeys) bp.removeKey(1);
    var cxAll = 0; for (var fx = 0; fx < newPos.length; fx++) cxAll += newPos[fx][0] / newPos.length;
    bp.setValue([cxAll, comp.height / 2, BZ]);
    // house grid density: 396 % seen from ~3026 away; keep the same apparent cell size from the new distance
    var sc = 396 * (restD + BZ) / 3026;
    btg.property("ADBE Scale").setValue([sc, sc, sc]);
    bg.startTime = 0; bg.inPoint = 0; bg.outPoint = comp.duration;
    if (bgOld) { bgOld.enabled = false; log.push("old '" + bgOld.name + "' disabled (kept for reference)"); }
    log.push("house BG at z=" + BZ + ", scale " + Math.round(sc) + "%");
    // ---- 7. labels parented to pills must sit clearly in front of them, or AE's 3D sort hides them ----
    var nz = 0;
    for (var lz = 1; lz <= comp.numLayers; lz++) {
        var LZ = comp.layer(lz); if (!LZ.parent || !LZ.threeDLayer || LZ instanceof CameraLayer) continue;
        var pz = LZ.property("ADBE Transform Group").property("ADBE Position");
        if (pz.dimensionsSeparated || pz.numKeys) continue;
        var vz = pz.value; if (vz.length > 2 && vz[2] < 0 && vz[2] > -20) { vz[2] = -20; pz.setValue(vz); nz++; }
    }
    log.push(nz + " pill label(s) moved to z=-20 in front of their pill");
    // ---- 6. house glow on text (copied from a house text layer) ----
    var gsrc = null;
    for (var gg = 1; gg <= house.numLayers && !gsrc; gg++) { var GL = house.layer(gg); if (!(GL instanceof TextLayer)) continue; var gfx = GL.property("ADBE Effect Parade"); for (var ge = 1; ge <= gfx.numProperties; ge++) if (gfx.property(ge).matchName === "ADBE Glo2") { gsrc = gfx.property(ge); break; } }
    var ng = 0;
    if (gsrc) for (var tl = 1; tl <= comp.numLayers; tl++) {
        var TL = comp.layer(tl); if (!(TL instanceof TextLayer) || TL.parent) continue; // pill labels (parented) keep their own look
        var tfx = TL.property("ADBE Effect Parade"), has = false;
        for (var te = 1; te <= tfx.numProperties; te++) if (tfx.property(te).matchName === "ADBE Glo2") has = true;
        if (has) continue;
        var ngl = tfx.addProperty("ADBE Glo2");
        for (var gp = 1; gp <= gsrc.numProperties; gp++) { try { var spp = gsrc.property(gp); if (spp.propertyValueType !== PropertyValueType.NO_VALUE && spp.propertyValueType !== PropertyValueType.CUSTOM_VALUE) TL.property("ADBE Effect Parade").property(tfx.numProperties).property(gp).setValue(spp.value); } catch (e) {} }
        ng++;
    }
    log.push("house glow added to " + ng + " text layer(s)");
    return JSON.stringify({ status: "success", log: log });
    } catch (err) { return JSON.stringify({ status: "error", message: String(err) + " (line " + err.line + ") after: " + log[log.length - 1], log: log }); }
})();
