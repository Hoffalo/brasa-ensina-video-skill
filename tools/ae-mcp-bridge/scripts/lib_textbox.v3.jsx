// Rebuilds text layers as justified box text (removing italics) and adds yellow content boxes.
// Driven by $.global.MCP_TARGETS (array of comp names) and the SPEC table below.
(function () {
    var YELLOW = [1, 0.8, 0.01];
    var STROKE_PX = 4, PAD_X_PX = 56, PAD_Y_PX = 44, ROUND_PX = 22, DRAW_DUR = 0.55;

    // per comp: pairs = [first, continuation] sharing width + left edge; boxes = groups of content layer indices;
    // strike = [solidIndex, textIndex] strikethrough refit; staticBoxes = no draw-on (layers never animate)
    var SPEC = {
        "G1 Copy 4": { boxes: [[1, 3]] },
        "G1 Copy 5": { boxes: [[3, 5, 6]] },
        "G1 Copy 6": { boxes: [[5, 7, 8]] },
        "G5 Copy 2": { pairs: [[6, 5]], boxes: [[5, 6]], fullLast: [6] },
        "G5 Copy 3": { pairs: [[6, 5]], boxes: [[5, 6]] },
        "G5 Copy 5": { pairs: [[6, 5]], boxes: [[5, 6]] },
        "G5 Copy 4": { boxes: [[6], [5]], uniform: true, alignTop: true, pad: 40,
                       plusLayout: { left: [6], right: [5], plus: [4], gap: 40, t: 13 } },
        "G12": { boxes: [[4]] },
        "G17": { boxes: [[4], [6, 7]], moveUnder: { group: [4], title: [3], gap: 120, t: 4.5 } },
        "G18": { boxes: [[1, 2, 3]], strike: [1, 3] },
        "G20": { boxes: [[4, 5], [10, 11]] },
        "g16 copy 2": { boxes: [[10, 11], [7, 8], [4, 3], [6, 5]], staticBoxes: true, uniform: true },
        "g16 copy 3": { boxes: [[9, 10], [7, 8], [4, 3], [6, 5]], staticBoxes: true, uniform: true },
        "G1 Copy 3": { boxes: [[4, 5, 6]], padLeft: 246 }, // icon PNGs have a padded canvas: box the text, widen left to cover the icons
        "G1 Copy 9": { boxes: [[4, 5, 6, 8]] },
        // ---- Projeto de Pesquisa (centred comps re-laid-out as left blocks) ----
        "g5 copy 2": { skip: [7, 8, 9, 10], stacks: [{ m: [6], t: 30 }] },
        "G26": { stacks: [{ m: [4, 8], t: 4.5 }, { m: [7, 6], t: 11.5 }], boxes: [[8], [7, 6]], titleGap: [{ title: [4], box: 0, gap: 80, t: 4.5 }] },
        "G27": { stacks: [{ m: [4, 11, 9], t: 10 }, { m: [5, 10, 8], t: 24 }], boxes: [[11, 9], [10, 8]],
                 titleGap: [{ title: [4], box: 0, gap: 80, t: 10 }, { title: [5], box: 1, gap: 80, t: 24 }] },
        "G28": { keepItalic: [5], noReflow: [5] },
        "G29": { stacks: [{ m: [10, 18, 17], t: 5.5, attach: { 7: 18 } }, { m: [9, 15, 14, 12], t: 12.5, attach: { 4: 15, 5: 15 } },
                          { m: [8, 16, 13, 11], t: 20.5, attach: { 6: 16 } }],
                 boxes: [[18, 17], [15, 14, 12], [16, 13, 11]],
                 boxPad: { 0: { top: 20 } },
                 titleGap: [{ title: [10], box: 0, gap: 40, t: 5.5 }, { title: [9], box: 1, gap: 40, t: 12.5 }, { title: [8], box: 2, gap: 40, t: 20.5 }] },
        "G30": { stacks: [{ m: [6, 8], t: 33.4 }, { m: [7, 9], t: 33.4 }, { m: [11, 10], t: 33.4 }, { m: [5, 4, 3], t: 33.4 }],
                 boxes: [[6, 8], [7, 9], [11, 10], [4, 3]], uniform: [[0, 1, 2]], alignTop: true, pad: 40, rows: [{ boxes: [0, 1, 2], gap: 40, center: true, t: 33.4 }],
                 titleGap: [{ title: [5], box: 3, gap: 60, t: 33.4 }] },
        "G31": { keepItalic: [5], noReflow: [5] },
        "G33": { stacks: [{ m: [3, 4, 5, 9, 8, 7, 6], t: 8 }], boxes: [[9, 8, 7, 6]], titleGap: [{ title: [3, 4, 5], box: 0, gap: 80, t: 8 }] },
        "G34": { stacks: [{ m: [4, 9], t: 11, attach: { 3: 4 } }, { m: [8], t: 11 }, { m: [7], t: 11 }, { m: [6], t: 11 }],
                 boxes: [[8], [7], [6]], uniform: [[0, 1, 2]], alignTop: true, pad: 30, rows: [{ boxes: [0, 1, 2], gap: 30, center: true, t: 11 }],
                 titleGap: [{ title: [3, 4, 9], box: 0, gap: 60, t: 11 }] },
        "G35": { skip: [3, 4, 5, 6], stacks: [{ m: [8, 9], t: 17 }, { m: [14], t: 17 }, { m: [13, 12, 11, 10], t: 17 }],
                 boxes: [[14], [13, 12, 11, 10]], boxPad: { 0: { bottom: 12 } }, titleGap: [{ title: [8, 9], box: 0, gap: 80, t: 17 }] },
        "G36": { stacks: [{ m: [3], t: 10 }, { m: [4], t: 7 }, { m: [5], t: 3 }, { m: [6], t: 1 }] },
        "G1 Copy 10": { boxes: [[10, 9, 8, 7, 6, 5, 4]] },
        "G37": { noReflow: [7, 6], boxes: [[7, 4, 6]], titleGap: [{ title: [5], box: 0, gap: 60, t: 10 }] }
    };

    var CHAR_ATTRS = ["font", "fontSize", "fillColor", "applyFill", "strokeColor", "applyStroke", "strokeWidth", "strokeOverFill",
        "tracking", "fauxBold", "fauxItalic", "fontCapsOption", "superscript", "subscript", "baselineShift",
        "horizontalScale", "verticalScale", "autoLeading", "leading", "ligature", "kerningType", "kerning"];
    var log = [];

    function findComp(name) {
        for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === name) return it; }
        return null;
    }
    function fontExists(ps) { try { return app.fonts.getFontsByPostScriptName(ps).length > 0; } catch (e) { return false; } }
    function deItalic(ps) {
        if (!ps || !/Italic/i.test(ps)) return ps;
        var cands = [ps.replace(/-?Italic$/i, "-Regular"), ps.replace(/Italic$/i, ""), ps.replace(/Italic/i, "")];
        for (var i = 0; i < cands.length; i++) { var c = cands[i].replace(/-$/, ""); if (fontExists(c)) return c; }
        return ps;
    }
    function same(a, b) {
        if (a instanceof Array && b instanceof Array) { if (a.length !== b.length) return false; for (var i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 1e-6) return false; return true; }
        return a === b;
    }

    // ---------- generic property copy (values, keys, eases, expressions) ----------
    function copyKeys(s, d) {
        var n = s.numKeys, k;
        for (k = 1; k <= n; k++) d.setValueAtTime(s.keyTime(k), s.keyValue(k));
        for (k = 1; k <= n; k++) {
            try { d.setInterpolationTypeAtKey(k, s.keyInInterpolationType(k), s.keyOutInterpolationType(k)); } catch (e) {}
            try { d.setTemporalEaseAtKey(k, s.keyInTemporalEase(k), s.keyOutTemporalEase(k)); } catch (e) {}
            try { d.setTemporalContinuousAtKey(k, s.keyTemporalContinuous(k)); d.setTemporalAutoBezierAtKey(k, s.keyTemporalAutoBezier(k)); } catch (e) {}
            if (s.isSpatial) {
                try { d.setSpatialTangentsAtKey(k, s.keyInSpatialTangent(k), s.keyOutSpatialTangent(k)); } catch (e) {}
                try { d.setSpatialContinuousAtKey(k, s.keySpatialContinuous(k)); d.setSpatialAutoBezierAtKey(k, s.keySpatialAutoBezier(k)); } catch (e) {}
                try { d.setRovingAtKey(k, s.keyRoving(k)); } catch (e) {}
            }
        }
    }
    function copyProp(s, d) {
        if (s.propertyType === PropertyType.PROPERTY) {
            if (s.propertyValueType === PropertyValueType.NO_VALUE || s.propertyValueType === PropertyValueType.CUSTOM_VALUE) return;
            try {
                if (s.numKeys > 0) copyKeys(s, d);
                else if (!same(s.value, d.value)) d.setValue(s.value);
            } catch (e) {}
            try { if (s.canSetExpression && s.expression !== "") { d.expression = s.expression; d.expressionEnabled = s.expressionEnabled; } } catch (e) {}
            return;
        }
        // group
        if (s.matchName === "ADBE Transform Group") {
            var sp = s.property("ADBE Position");
            if (sp.dimensionsSeparated) d.property("ADBE Position").dimensionsSeparated = true;
        }
        for (var i = 1; i <= s.numProperties; i++) {
            var c = s.property(i), dc = null;
            try { dc = d.property(c.matchName); } catch (e) {}
            if (!dc) { try { dc = d.property(i); } catch (e) {} }
            if (!dc) continue;
            try { if (c.canSetEnabled) dc.enabled = c.enabled; } catch (e) {}
            copyProp(c, dc);
        }
    }
    function shiftProp(p, dx, dy) {
        if (!p) return;
        function sh(v) { var o = v.slice(0); o[0] += dx; o[1] += dy; return o; }
        if (p.numKeys > 0) { for (var k = 1; k <= p.numKeys; k++) p.setValueAtKey(k, sh(p.keyValue(k))); }
        else p.setValue(sh(p.value));
    }

    // ---------- text helpers ----------
    function readChars(doc, keepItalic) {
        var out = [], len = doc.text.length;
        for (var c = 0; c < len; c++) {
            var cr = doc.characterRange(c, c + 1), a = {};
            for (var j = 0; j < CHAR_ATTRS.length; j++) { try { var v = cr[CHAR_ATTRS[j]]; if (v !== undefined && v !== null) a[CHAR_ATTRS[j]] = v; } catch (e) {} }
            if (!keepItalic) { if (a.font) a.font = deItalic(a.font); a.fauxItalic = false; }
            out.push(a);
        }
        return out;
    }
    function isNumberList(t) { return /^\s*(\d+\.\s*[\r\u0003\n]+\s*)+\d+\.\s*$/.test(t) || /^\s*\d+\.\s*$/.test(t); }
    function reflow(t, chars) {
        // replace breaks that sit between two printable characters with a space (index-preserving),
        // but keep deliberate breaks: font/colour changes across the break, or a line that is just a list number
        var a = t.split(""), BR = /[\r\u0003]/;
        function lineAround(i, dir) { var j = i + dir, o = ""; while (j >= 0 && j < a.length && !BR.test(a[j])) { o = dir < 0 ? a[j] + o : o + a[j]; j += dir; } return o; }
        function styleKey(c) { var x = chars && chars[c] ? chars[c] : {}; return String(x.font) + "|" + (x.fillColor ? x.fillColor.toString() : ""); }
        for (var i = 1; i < a.length - 1; i++) {
            if (!BR.test(a[i]) || BR.test(a[i - 1]) || BR.test(a[i + 1])) continue;
            if (styleKey(i - 1) !== styleKey(i + 1)) continue;
            if (/^\s*\d+\.\s*$/.test(lineAround(i, -1)) || /^\s*\d+\.\s*$/.test(lineAround(i, 1))) continue;
            a[i] = " ";
        }
        return a.join("");
    }
    function applyDoc(prop, text, chars, oldDoc, boxSize, keepItalic) {
        var doc = prop.value;
        doc.text = text;
        try { doc.font = keepItalic ? oldDoc.font : deItalic(oldDoc.font); } catch (e) {}
        try { doc.fontSize = oldDoc.fontSize; } catch (e) {}
        try { doc.fauxItalic = keepItalic ? oldDoc.fauxItalic : false; } catch (e) {}
        try { doc.applyFill = oldDoc.applyFill; if (oldDoc.applyFill) doc.fillColor = oldDoc.fillColor; } catch (e) {}
        try { doc.applyStroke = oldDoc.applyStroke; if (oldDoc.applyStroke) { doc.strokeColor = oldDoc.strokeColor; doc.strokeWidth = oldDoc.strokeWidth; } } catch (e) {}
        try { doc.tracking = oldDoc.tracking; } catch (e) {}
        try { doc.autoLeading = oldDoc.autoLeading; if (!oldDoc.autoLeading) doc.leading = oldDoc.leading; } catch (e) {}
        try { doc.fontCapsOption = oldDoc.fontCapsOption; } catch (e) {}
        doc.justification = ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT;
        doc.boxTextSize = boxSize;
        // per-character runs
        var i = 0;
        while (i < chars.length) {
            var j = i + 1, key = chars[i].toSource();
            while (j < chars.length && chars[j].toSource() === key) j++;
            var cr = doc.characterRange(i, j);
            for (var a in chars[i]) { try { if (a === "leading" && chars[i].autoLeading) continue; cr[a] = chars[i][a]; } catch (e) {} }
            i = j;
        }
        prop.setValue(doc);
    }

    // Rebuild one text layer as box text. opts: { reflow, width (layer units, optional), leftTarget (layer units, optional) }
    function rebuildText(comp, old, opts) {
        var oprop = old.property("ADBE Text Properties").property("ADBE Text Document");
        var oldDoc = oprop.value;
        var t0 = Math.max(old.inPoint, 0);
        var oldRect = old.sourceRectAtTime(t0, false);
        var chars = readChars(oldDoc, opts.keepItalic);
        var text = oldDoc.text;
        var size = oldDoc.fontSize, nLines = text.split(/[\r\u0003]/).length;
        var H = Math.ceil((nLines + 3) * size * 1.4);

        var nl = comp.layers.addBoxText([8000, H], text);
        nl.moveBefore(old);
        var nprop = nl.property("ADBE Text Properties").property("ADBE Text Document");
        // pass 1: original breaks, very wide box -> measure longest line in the new (non-italic) font
        applyDoc(nprop, text, chars, oldDoc, [8000, H], opts.keepItalic);
        var r1 = nl.sourceRectAtTime(t0, false);
        var boxLeft = nprop.value.boxTextPos[0];
        var measured = r1.width + (r1.left - boxLeft);
        // reflowed text wraps at the longest original line; everything else gets slack so it never wraps
        var W = opts.width ? opts.width : Math.ceil(opts.reflow ? measured + size * 0.15 : measured * 1.3 + size);
        var finalText = opts.reflow ? reflow(text, chars) : text;
        applyDoc(nprop, finalText, chars, oldDoc, [W, H], opts.keepItalic);

        // layer attributes
        nl.name = old.name;
        try { nl.label = old.label; } catch (e) {}
        nl.threeDLayer = old.threeDLayer;
        nl.startTime = old.startTime; nl.inPoint = old.inPoint; nl.outPoint = old.outPoint;
        try { nl.shy = old.shy; nl.motionBlur = old.motionBlur; nl.blendingMode = old.blendingMode; nl.quality = old.quality; nl.comment = old.comment; } catch (e) {}
        if (old.parent) nl.parent = old.parent;
        // transform, effects, material, text options
        copyProp(old.property("ADBE Transform Group"), nl.property("ADBE Transform Group"));
        try { copyProp(old.property("ADBE Text Properties").property("ADBE Text More Options"), nl.property("ADBE Text Properties").property("ADBE Text More Options")); } catch (e) {}
        try { if (old.threeDLayer) copyProp(old.property("ADBE Material Options Group"), nl.property("ADBE Material Options Group")); } catch (e) {}
        var ofx = old.property("ADBE Effect Parade"), nfx = nl.property("ADBE Effect Parade");
        for (var f = 1; f <= ofx.numProperties; f++) {
            var se = ofx.property(f), de = nfx.addProperty(se.matchName);
            de.name = se.name; de.enabled = se.enabled;
            copyProp(se, de);
        }
        // align new glyph box to old (left edge + top) by shifting the anchor (and Transform-effect anchor/position)
        var r2 = nl.sourceRectAtTime(t0, false);
        var targetLeft = (opts.leftTarget !== undefined) ? opts.leftTarget : oldRect.left;
        var dx = r2.left - targetLeft, dy = r2.top - oldRect.top;
        var anc = nl.property("ADBE Transform Group").property("ADBE Anchor Point");
        shiftProp(anc, dx, dy);
        for (var g = 1; g <= nfx.numProperties; g++) {
            var e = nfx.property(g);
            if (e.matchName === "ADBE Geometry2") { shiftProp(e.property("ADBE Geometry2-0001"), dx, dy); shiftProp(e.property("ADBE Geometry2-0002"), dx, dy); }
        }
        nl.enabled = old.enabled;
        var wasLocked = old.locked; old.locked = false;
        var idx = old.index;
        old.remove();
        if (wasLocked) nl.locked = true;
        log.push(comp.name + " #" + idx + " '" + nl.name + "' W=" + W + (opts.reflow ? " reflow" : "") + " oldW=" + Math.round(oldRect.width) + " newW=" + Math.round(r2.width));
        return { layer: nl, oldWidth: oldRect.width, newWidth: r2.width, oldRect: oldRect, newRect: nl.sourceRectAtTime(t0, false) };
    }

    // ---------- bounds via a temporary expression layer ----------
    function sampleBounds(comp, layers, t) {
        var tmp = comp.layers.addText("x");
        var ids = [];
        for (var i = 0; i < layers.length; i++) ids.push(layers[i].index);
        var expr = "var ids=[" + ids.join(",") + "];var o=[];for(var i=0;i<ids.length;i++){var L=thisComp.layer(ids[i]);var r=L.sourceRectAtTime(time,false);" +
            "var c=[[r.left,r.top],[r.left+r.width,r.top],[r.left,r.top+r.height],[r.left+r.width,r.top+r.height]];" +
            "for(var j=0;j<4;j++){var w=L.toWorld(c[j]);var s=L.toComp(c[j]);o.push([w[0],w[1],(w.length>2?w[2]:0),s[0],s[1]]);}}JSON.stringify(o);";
        var sp = tmp.property("ADBE Text Properties").property("ADBE Text Document");
        sp.expression = expr;
        var res = [];
        for (var k = 0; k < t.length; k++) { try { res.push(eval(sp.valueAtTime(t[k], false).text)); } catch (e) { res.push(null); } }
        tmp.remove();
        return res;
    }
    function firstAnimTime(L) {
        var op = L.property("ADBE Transform Group").property("ADBE Opacity");
        if (op.numKeys > 0) return op.keyTime(1);
        var sc = L.property("ADBE Transform Group").property("ADBE Scale");
        if (sc.numKeys > 0) return sc.keyTime(1);
        return Math.max(L.inPoint, 0);
    }
    function lastAnimTime(L) {
        var tg = L.property("ADBE Transform Group"), m = Math.max(L.inPoint, 0);
        for (var i = 1; i <= tg.numProperties; i++) { var p = tg.property(i); try { if (p.numKeys > 0) m = Math.max(m, p.keyTime(p.numKeys)); } catch (e) {} }
        return m;
    }

    function boundsOf(q, iWorld) {
        var o = { minX: 1e9, minY: 1e9, maxX: -1e9, maxY: -1e9, z: 0 };
        var ix = iWorld ? 0 : 3, iy = iWorld ? 1 : 4;
        for (var u = 0; u < q.length; u++) { o.minX = Math.min(o.minX, q[u][ix]); o.maxX = Math.max(o.maxX, q[u][ix]); o.minY = Math.min(o.minY, q[u][iy]); o.maxY = Math.max(o.maxY, q[u][iy]); o.z += q[u][2]; }
        o.z /= q.length;
        return o;
    }
    // world bounds, depth, timing and world-units-per-screen-pixel for a group of layers
    function measureBox(comp, members, staticBox) {
        var g = { members: members, start: 1e9, settle: 0, inP: 1e9, outP: -1e9, is3D: false, glowSrc: null, lowest: members[0], staticBox: staticBox };
        for (var i = 0; i < members.length; i++) {
            var L = members[i];
            g.start = Math.min(g.start, firstAnimTime(L)); g.settle = Math.max(g.settle, lastAnimTime(L));
            g.inP = Math.min(g.inP, L.inPoint); g.outP = Math.max(g.outP, L.outPoint);
            if (L.threeDLayer) g.is3D = true;
            if (L.index > g.lowest.index) g.lowest = L;
            if (!g.glowSrc) { var fx = L.property("ADBE Effect Parade"); for (var f = 1; f <= fx.numProperties; f++) if (fx.property(f).matchName === "ADBE Glo2") { g.glowSrc = fx.property(f); break; } }
        }
        if (staticBox) g.start = Math.max(g.inP, 0);
        var ts = [Math.min(g.settle + 0.1, comp.duration - 0.01)];
        for (var s = Math.max(g.start, 0); s < Math.min(g.start + 20, comp.duration); s += 0.25) ts.push(s);
        var res = sampleBounds(comp, members, ts);
        if (!res[0]) throw new Error("bounds failed in " + comp.name);
        var wb = boundsOf(res[0], true);
        g.minX = wb.minX; g.maxX = wb.maxX; g.minY = wb.minY; g.maxY = wb.maxY; g.z = wb.z;
        var zMin = 1e9, zMax = -1e9, n3 = 0;
        for (var zi = 0; zi < members.length; zi++) { if (members[zi].threeDLayer) n3++; }
        for (var zp = 0; zp < res[0].length; zp++) { zMin = Math.min(zMin, res[0][zp][2]); zMax = Math.max(zMax, res[0][zp][2]); }
        if (g.is3D && (zMax - zMin > 1 || n3 < members.length)) {
            var ref = res[0].slice(0, 4), rw = boundsOf(ref, true), rs = boundsOf(ref, false), rr = (rw.maxX - rw.minX) / (rs.maxX - rs.minX);
            var all = boundsOf(res[0], false);
            g.minX = rw.minX + (all.minX - rs.minX) * rr; g.maxX = rw.minX + (all.maxX - rs.minX) * rr;
            g.minY = rw.minY + (all.minY - rs.minY) * rr; g.maxY = rw.minY + (all.maxY - rs.minY) * rr;
            g.z = rw.z; g.ratio = rr; g.mixed = true;
        }
        if (!g.mixed) g.ratio = 1;
        if (g.mixed) {
            // ratio already taken from the settled view
        } else if (g.is3D && !staticBox) {
            // animated boxes: scale from the settled view (what the viewer sees once text lands)
            var s0 = boundsOf(res[0], false); g.ratio = (g.maxX - g.minX) / (s0.maxX - s0.minX);
        } else if (g.is3D) {
            var best = 0;
            for (var r = 0; r < res.length; r++) {
                if (!res[r]) continue;
                var sb = boundsOf(res[r], false), cx = (sb.minX + sb.maxX) / 2, cy = (sb.minY + sb.maxY) / 2;
                if (cx < 0 || cx > comp.width || cy < 0 || cy > comp.height) continue;
                var sc = (sb.maxX - sb.minX) / (g.maxX - g.minX);
                if (sc > best) best = sc;
            }
            g.ratio = best > 0 ? 1 / best : 1;
        }
        return g;
    }
    // g.box = {x (left), y (top), w, h} in world units; g.ratio sets stroke/roundness
    function createBox(comp, g, nameSuffix) {
        var bx = g.box, ratio = g.ratio, staticBox = g.staticBox;
        var sl = comp.layers.addShape();
        sl.name = "Box" + (nameSuffix ? " " + nameSuffix : "");
        sl.label = 2; // yellow
        sl.threeDLayer = g.is3D;
        sl.moveAfter(g.lowest);
        var cx = bx.x + bx.w / 2, cy = bx.y + bx.h / 2;
        sl.property("ADBE Transform Group").property("ADBE Position").setValue(g.is3D ? [cx, cy, g.z] : [cx, cy]);
        var grp = sl.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        grp.name = "Box";
        var vc = grp.property("ADBE Vectors Group");
        vc.addProperty("ADBE Vector Shape - Rect");
        if (!staticBox) vc.addProperty("ADBE Vector Filter - Trim");
        vc.addProperty("ADBE Vector Graphic - Stroke");
        // re-fetch: adding properties invalidates earlier references
        vc = sl.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group");
        var rect = vc.property("ADBE Vector Shape - Rect");
        rect.property("ADBE Vector Rect Size").setValue([bx.w, bx.h]);
        rect.property("ADBE Vector Rect Roundness").setValue(ROUND_PX * ratio);
        var trim = staticBox ? null : vc.property("ADBE Vector Filter - Trim");
        var st = vc.property("ADBE Vector Graphic - Stroke");
        st.property("ADBE Vector Stroke Color").setValue(YELLOW);
        st.property("ADBE Vector Stroke Width").setValue(STROKE_PX * ratio);
        try { st.property("ADBE Vector Stroke Line Cap").setValue(2); st.property("ADBE Vector Stroke Line Join").setValue(2); } catch (e) {}
        if (trim) {
            var te = trim.property("ADBE Vector Trim End");
            te.setValueAtTime(g.start, 0); te.setValueAtTime(g.start + DRAW_DUR, 100);
            // same ease as the existing white line wipes (out 49.92% / in 100%)
            te.setTemporalEaseAtKey(1, [new KeyframeEase(0, 33.33)], [new KeyframeEase(0, 49.92)]);
            te.setTemporalEaseAtKey(2, [new KeyframeEase(0, 100)], [new KeyframeEase(0, 16.67)]);
            trim.property("ADBE Vector Trim Offset").setValue(-90); // start drawing from the top-left
        }
        if (g.glowSrc) { var gl = sl.property("ADBE Effect Parade").addProperty("ADBE Glo2"); copyProp(g.glowSrc, gl); }
        sl.inPoint = Math.min(Math.max(g.inP, 0), g.start);
        sl.outPoint = g.outP;
        log.push(comp.name + " box '" + sl.name + "' " + (g.is3D ? "3D z=" + Math.round(g.z) : "2D") + " size=" + Math.round(bx.w) + "x" + Math.round(bx.h) + " ratio=" + Math.round(ratio * 100) / 100 + (trim ? " draw@" + Math.round(g.start * 100) / 100 : " static"));
        return sl;
    }
    // shift a layer's position (all keys) by world dx/dy
    function shiftLayer(L, dx, dy) {
        var tg = L.property("ADBE Transform Group"), pos = tg.property("ADBE Position");
        function sh1(p, d) { if (!d) return; if (p.numKeys) { for (var k = 1; k <= p.numKeys; k++) p.setValueAtKey(k, p.keyValue(k) + d); } else p.setValue(p.value + d); }
        if (pos.dimensionsSeparated) { sh1(tg.property("ADBE Position_0"), dx); sh1(tg.property("ADBE Position_1"), dy); }
        else shiftProp(pos, dx, dy);
    }
    // screen bounds of a set of layers at time t (single sample), with world-per-pixel ratio
    function screenBounds(comp, layers, t) { var r = sampleBounds(comp, layers, [t])[0]; var o = boundsOf(r, false); o.world = boundsOf(r, true); o.ratio = (o.world.maxX - o.world.minX) / (o.maxX - o.minX); return o; }

    function layerById(c, id) { for (var i = 1; i <= c.numLayers; i++) if (c.layer(i).id === id) return c.layer(i); return null; }

    // ---------- main ----------
    var targets = $.global.MCP_TARGETS || [];
    for (var ti = 0; ti < targets.length; ti++) {
        var comp = findComp(targets[ti]);
        if (!comp) { log.push("MISSING " + targets[ti]); continue; }
        var spec = SPEC[comp.name] || {};
        // remove boxes left by an earlier run so the SPEC layer indices line up again
        for (var xi = comp.numLayers; xi >= 1; xi--) { var X = comp.layer(xi); if (X instanceof ShapeLayer && /^Box( \d+)?$/.test(X.name)) X.remove(); }
        // capture text layers (by object) before indices move
        var texts = [];
        for (var li = 1; li <= comp.numLayers; li++) if (comp.layer(li) instanceof TextLayer) texts.push(comp.layer(li));
        // layer ids are stable; wrappers and indices are not
        var boxMembers = [];
        if (spec.boxes) for (var b = 0; b < spec.boxes.length; b++) { var arr = []; for (var m = 0; m < spec.boxes[b].length; m++) arr.push(comp.layer(spec.boxes[b][m]).id); boxMembers.push(arr); }
        var strikeSolidId = spec.strike ? comp.layer(spec.strike[0]).id : null, strikeTextId = spec.strike ? comp.layer(spec.strike[1]).id : null;

        function ids(arr) { var o = []; for (var i = 0; i < (arr || []).length; i++) o.push(comp.layer(arr[i]).id); return o; }
        var fullLastIds = ids(spec.fullLast);
        var skipIds = ids(spec.skip), keepItalicIds = ids(spec.keepItalic), noReflowIds = ids(spec.noReflow);
        function has(arr, id) { for (var i = 0; i < arr.length; i++) if (arr[i] === id) return true; return false; }
        var gapDefs = [];
        if (spec.titleGap) for (var tg0 = 0; tg0 < spec.titleGap.length; tg0++) { var T0 = spec.titleGap[tg0]; gapDefs.push({ title: ids(T0.title), box: T0.box, gap: T0.gap, t: T0.t }); }
        var stackDefs = [];
        if (spec.stacks) for (var sd = 0; sd < spec.stacks.length; sd++) {
            var S0 = spec.stacks[sd], att = [];
            if (S0.attach) for (var ak in S0.attach) att.push({ layer: comp.layer(parseInt(ak, 10)).id, to: comp.layer(S0.attach[ak]).id });
            stackDefs.push({ m: ids(S0.m), t: S0.t, attach: att });
        }
        var plusIds = spec.plusLayout ? { left: ids(spec.plusLayout.left), right: ids(spec.plusLayout.right), plus: ids(spec.plusLayout.plus) } : null;
        var moveIds = spec.moveUnder ? { group: ids(spec.moveUnder.group), title: ids(spec.moveUnder.title) } : null;

        var idMap = {}; // old layer id -> new layer id
        var done = {};
        function rebuild(L, opts) {
            var oldId = L.id;
            var doc = L.property("ADBE Text Properties").property("ADBE Text Document").value;
            if (has(keepItalicIds, oldId)) opts.keepItalic = true;
            if (has(noReflowIds, oldId)) opts.reflow = false;
            if (opts.reflow === undefined) opts.reflow = !/^Hagrid/i.test(doc.font) && !isNumberList(doc.text);
            var res = rebuildText(comp, L, opts);
            idMap[oldId] = res.layer.id;
            res.oldId = oldId;
            return res;
        }
        if (spec.pairs) {
            for (var pj = 0; pj < spec.pairs.length; pj++) {
                var A = comp.layer(spec.pairs[pj][0]), B = comp.layer(spec.pairs[pj][1]);
                if (A.property("ADBE Text Properties").property("ADBE Text Document").value.boxText) continue; // already rebuilt
                // comp-space left of A (same parent/scale assumed); convert into B's layer space
                var aRect = A.sourceRectAtTime(Math.max(A.inPoint, 0), false), bRect = B.sourceRectAtTime(Math.max(B.inPoint, 0), false);
                var aPos = A.property("ADBE Transform Group").property("ADBE Position"), bPos = B.property("ADBE Transform Group").property("ADBE Position");
                var aX = (aPos.numKeys ? aPos.keyValue(aPos.numKeys) : aPos.value)[0], bX = (bPos.numKeys ? bPos.keyValue(bPos.numKeys) : bPos.value)[0];
                var aS = A.property("ADBE Transform Group").property("ADBE Scale").value[0] / 100, bS = B.property("ADBE Transform Group").property("ADBE Scale").value[0] / 100;
                var aAnc = A.property("ADBE Transform Group").property("ADBE Anchor Point").value[0], bAnc = B.property("ADBE Transform Group").property("ADBE Anchor Point").value[0];
                var compLeft = aX + (aRect.left - aAnc) * aS;
                var bLeftTarget = (compLeft - bX) / bS + bAnc;
                var A2 = rebuild(A, {});
                var wA = A2.layer.property("ADBE Text Properties").property("ADBE Text Document").value.boxTextSize[0];
                // measure B's longest line then share the larger width
                var B2 = rebuild(B, { leftTarget: bLeftTarget, width: undefined });
                var wB = B2.layer.property("ADBE Text Properties").property("ADBE Text Document").value.boxTextSize[0];
                var Wp = Math.max(wA, wB);
                var pl = [A2.layer, B2.layer];
                for (var q = 0; q < 2; q++) {
                    var tp = pl[q].property("ADBE Text Properties").property("ADBE Text Document"), dd = tp.value;
                    dd.boxTextSize = [Wp, dd.boxTextSize[1]]; tp.setValue(dd);
                }
                done[A2.layer.index] = 1; done[B2.layer.index] = 1;
            }
        }
        // everything else
        var fresh = [];
        for (var li2 = 1; li2 <= comp.numLayers; li2++) {
            var LL = comp.layer(li2);
            if (!(LL instanceof TextLayer) || done[li2] || has(skipIds, LL.id)) continue;
            var LD = LL.property("ADBE Text Properties").property("ADBE Text Document").value;
            if (LD.boxText || /^\s*$/.test(LD.text)) continue; // already rebuilt, or an empty leftover layer
            fresh.push(LL);
        }
        for (var fi = 0; fi < fresh.length; fi++) {
            var oldT = fresh[fi], isStrike = (oldT.id === strikeTextId);
            var rr = rebuild(oldT, {});
            if (isStrike && strikeSolidId !== null) {
                // refit strikethrough: scale end key X by new/old rendered width (left edge is preserved)
                var sk = layerById(comp, strikeSolidId).property("ADBE Transform Group").property("ADBE Scale");
                var f2 = rr.newWidth / rr.oldWidth;
                if (sk.numKeys > 0) { var kv = sk.keyValue(sk.numKeys); kv[0] = kv[0] * f2; sk.setValueAtKey(sk.numKeys, kv); }
                log.push(comp.name + " strike refit x" + Math.round(f2 * 1000) / 1000);
            }
        }
        function members(arr) { var m = []; for (var i = 0; i < arr.length; i++) m.push(layerById(comp, idMap[arr[i]] !== undefined ? idMap[arr[i]] : arr[i])); return m; }
        // paragraphs continued by another layer: justify their last line too
        var FLs = members(fullLastIds);
        for (var jf = 0; jf < FLs.length; jf++) {
            var fp = FLs[jf].property("ADBE Text Properties").property("ADBE Text Document"), fd = fp.value;
            fd.justification = ParagraphJustification.FULL_JUSTIFY_LASTLINE_FULL; fp.setValue(fd);
            log.push(comp.name + " '" + FLs[jf].name + "' last line justified");
        }
        var padX = spec.pad !== undefined ? spec.pad : PAD_X_PX, padY = spec.pad !== undefined ? spec.pad : PAD_Y_PX;
        // A [+] B layout: push the two boxed columns apart so each box clears the plus sign by `gap` px
        if (spec.plusLayout) {
            var PL = spec.plusLayout;
            var Lm = members(plusIds.left), Rm = members(plusIds.right), Pm = members(plusIds.plus);
            var lb = screenBounds(comp, Lm, PL.t), rb = screenBounds(comp, Rm, PL.t), pb = screenBounds(comp, Pm, PL.t);
            var dxL = (pb.minX - PL.gap - padX) - lb.maxX, dxR = (pb.maxX + PL.gap + padX) - rb.minX;
            for (var a1 = 0; a1 < Lm.length; a1++) shiftLayer(Lm[a1], dxL * lb.ratio, 0);
            for (var a2 = 0; a2 < Rm.length; a2++) shiftLayer(Rm[a2], dxR * rb.ratio, 0);
            log.push(comp.name + " columns shifted " + Math.round(dxL) + "px / " + Math.round(dxR) + "px");
        }
        // pull a boxed group up/down so its box sits `gap` px under the title
        if (spec.moveUnder) {
            var MU = spec.moveUnder, Gm = members(moveIds.group), Tm = members(moveIds.title);
            var gb = screenBounds(comp, Gm, MU.t), tb = screenBounds(comp, Tm, MU.t);
            var dyS = (tb.maxY + MU.gap + padY) - gb.minY;
            for (var a3 = 0; a3 < Gm.length; a3++) shiftLayer(Gm[a3], 0, dyS * gb.ratio);
            log.push(comp.name + " group moved " + Math.round(dyS) + "px vertically");
        }
        // centred stacks -> one shared left edge, block keeps its centre; attached layers (arrows/icons) follow a member
        for (var st = 0; st < stackDefs.length; st++) {
            var SD = stackDefs[st], Sm = members(SD.m), sbs = [], bL = 1e9, bR = -1e9, mW = 0;
            for (var s1 = 0; s1 < Sm.length; s1++) { var sb = screenBounds(comp, [Sm[s1]], SD.t); sbs.push(sb); bL = Math.min(bL, sb.minX); bR = Math.max(bR, sb.maxX); mW = Math.max(mW, sb.maxX - sb.minX); }
            var target = (bL + bR) / 2 - mW / 2, dxs = {};
            for (var s2 = 0; s2 < Sm.length; s2++) { var dS = target - sbs[s2].minX; dxs[SD.m[s2]] = dS; shiftLayer(Sm[s2], dS * sbs[s2].ratio, 0); }
            for (var s3 = 0; s3 < SD.attach.length; s3++) {
                var AL = layerById(comp, SD.attach[s3].layer), dA = dxs[SD.attach[s3].to] || 0;
                shiftLayer(AL, dA * screenBounds(comp, [AL], SD.t).ratio, 0);
            }
            log.push(comp.name + " stack " + (st + 1) + " left edge at " + Math.round(target) + "px");
        }
        // measure every box, then size them (optionally all identical)
        var geos = [];
        for (var bi = 0; bi < boxMembers.length; bi++) geos.push(measureBox(comp, members(boxMembers[bi]), !!spec.staticBoxes));
        // uniform: true (all boxes) or [[boxIdx, ...], ...] groups that share size (and top when alignTop)
        var ugroups = spec.uniform === true ? [(function () { var a = []; for (var q = 0; q < geos.length; q++) a.push(q); return a; })()] : (spec.uniform || []);
        for (var ug = 0; ug < ugroups.length; ug++) {
            var grpI = ugroups[ug], rs = 0;
            for (var u1 = 0; u1 < grpI.length; u1++) rs += geos[grpI[u1]].ratio;
            var rU = rs / grpI.length, mw = 0, mh = 0, top = 1e9;
            for (var u2 = 0; u2 < grpI.length; u2++) { var g2 = geos[grpI[u2]]; g2.ratio = rU; mw = Math.max(mw, g2.maxX - g2.minX); mh = Math.max(mh, g2.maxY - g2.minY); top = Math.min(top, g2.minY); }
            for (var u3 = 0; u3 < grpI.length; u3++) {
                var G = geos[grpI[u3]];
                G.box = { x: G.minX - padX * rU, y: (spec.alignTop ? top : G.minY) - padY * rU, w: mw + 2 * padX * rU, h: mh + 2 * padY * rU };
            }
        }
        {
            for (var u4 = 0; u4 < geos.length; u4++) {
                var H = geos[u4];
                if (H.box) continue;
                var pl = spec.padLeft !== undefined ? spec.padLeft : padX; // extra room on the left (e.g. icons beside the text)
                var bp = (spec.boxPad && spec.boxPad[u4]) || {}, pt = bp.top !== undefined ? bp.top : padY, pb = bp.bottom !== undefined ? bp.bottom : padY;
                H.box = { x: H.minX - pl * H.ratio, y: H.minY - pt * H.ratio, w: (H.maxX - H.minX) + (pl + padX) * H.ratio, h: (H.maxY - H.minY) + (pt + pb) * H.ratio };
            }
        }
        // rows: spread equal-size boxes evenly (gap px) around their common centre, moving their content with them
        if (spec.rows) for (var rw = 0; rw < spec.rows.length; rw++) {
            var RW = spec.rows[rw], rb2 = [], cSum = 0;
            for (var r1 = 0; r1 < RW.boxes.length; r1++) { var gR = geos[RW.boxes[r1]]; rb2.push(gR); cSum += gR.box.x + gR.box.w / 2; }
            rb2.sort(function (p1, p2) { return p1.box.x - p2.box.x; });
            var gapW = RW.gap * rb2[0].ratio, totW = 0;
            for (var r2 = 0; r2 < rb2.length; r2++) totW += rb2[r2].box.w;
            totW += gapW * (rb2.length - 1);
            var rowC = cSum / rb2.length;
            if (RW.center) { // centre the row on the frame: map world x <-> screen x through the first box's members
                var g0 = rb2[0], sb0 = screenBounds(comp, g0.members, RW.t);
                rowC = g0.minX + (comp.width / 2 - sb0.minX) * sb0.ratio;
            }
            var xCur = rowC - totW / 2;
            for (var r3 = 0; r3 < rb2.length; r3++) {
                var gm = rb2[r3], dxW = xCur - gm.box.x;
                for (var r4 = 0; r4 < gm.members.length; r4++) shiftLayer(gm.members[r4], dxW, 0);
                if (RW.attach) for (var ra = 0; ra < RW.attach.length; ra++) { /* reserved */ }
                gm.box.x = xCur; xCur += gm.box.w + gapW;
            }
            log.push(comp.name + " row of " + rb2.length + " boxes spread, gap " + RW.gap + "px");
        }
        for (var gd = 0; gd < gapDefs.length; gd++) {
            var GD = gapDefs[gd], GB = geos[GD.box], Tl = members(GD.title);
            var sbm = screenBounds(comp, GB.members, GD.t), tbs = screenBounds(comp, Tl, GD.t);
            var boxTopS = sbm.minY + (GB.box.y - GB.minY) / (GB.mixed ? GB.ratio : sbm.ratio);
            var need = (tbs.maxY + GD.gap) - boxTopS;
            need = Math.min(need, tbs.minY - 40); // keep the title inside the frame
            if (Math.abs(need) > 0.5) { for (var tl = 0; tl < Tl.length; tl++) shiftLayer(Tl[tl], 0, -need * tbs.ratio); log.push(comp.name + " title moved " + Math.round(-need) + "px"); }
        }
        for (var u5 = 0; u5 < geos.length; u5++) createBox(comp, geos[u5], geos.length > 1 ? String(u5 + 1) : "");
    }
    return JSON.stringify({ status: "success", log: log });
})();
