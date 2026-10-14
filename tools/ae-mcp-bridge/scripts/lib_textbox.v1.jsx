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
        "G5 Copy 2": { pairs: [[6, 5]], boxes: [[5, 6]] },
        "G5 Copy 3": { pairs: [[6, 5]], boxes: [[5, 6]] },
        "G5 Copy 5": { pairs: [[6, 5]], boxes: [[5, 6]] },
        "G5 Copy 4": { boxes: [[6, 5]] },
        "G12": { boxes: [[4]] },
        "G17": { boxes: [[4], [6, 7]] },
        "G18": { boxes: [[1, 2, 3]], strike: [1, 3] },
        "G20": { boxes: [[4, 5], [10, 11]] },
        "g16 copy 2": { boxes: [[10, 11], [7, 8], [4, 3], [6, 5]], staticBoxes: true },
        "g16 copy 3": { boxes: [[9, 10], [7, 8], [4, 3], [6, 5]], staticBoxes: true }
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
    function readChars(doc) {
        var out = [], len = doc.text.length;
        for (var c = 0; c < len; c++) {
            var cr = doc.characterRange(c, c + 1), a = {};
            for (var j = 0; j < CHAR_ATTRS.length; j++) { try { var v = cr[CHAR_ATTRS[j]]; if (v !== undefined && v !== null) a[CHAR_ATTRS[j]] = v; } catch (e) {} }
            if (a.font) a.font = deItalic(a.font);
            a.fauxItalic = false;
            out.push(a);
        }
        return out;
    }
    function isNumberList(t) { return /^\s*(\d+\.\s*[\r\u0003\n]+\s*)+\d+\.\s*$/.test(t) || /^\s*\d+\.\s*$/.test(t); }
    function reflow(t) {
        // replace breaks that sit between two printable characters with a space (index-preserving)
        var a = t.split("");
        for (var i = 1; i < a.length - 1; i++) {
            if ((a[i] === "\r" || a[i] === "\u0003") && !/[\r\u0003]/.test(a[i - 1]) && !/[\r\u0003]/.test(a[i + 1])) a[i] = " ";
        }
        return a.join("");
    }
    function applyDoc(prop, text, chars, oldDoc, boxSize) {
        var doc = prop.value;
        doc.text = text;
        try { doc.font = deItalic(oldDoc.font); } catch (e) {}
        try { doc.fontSize = oldDoc.fontSize; } catch (e) {}
        try { doc.fauxItalic = false; } catch (e) {}
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
        var chars = readChars(oldDoc);
        var text = oldDoc.text;
        var size = oldDoc.fontSize, nLines = text.split(/[\r\u0003]/).length;
        var H = Math.ceil((nLines + 3) * size * 1.4);

        var nl = comp.layers.addBoxText([8000, H], text);
        nl.moveBefore(old);
        var nprop = nl.property("ADBE Text Properties").property("ADBE Text Document");
        // pass 1: original breaks, very wide box -> measure longest line in the new (non-italic) font
        applyDoc(nprop, text, chars, oldDoc, [8000, H]);
        var r1 = nl.sourceRectAtTime(t0, false);
        var boxLeft = nprop.value.boxTextPos[0];
        var measured = r1.width + (r1.left - boxLeft);
        // reflowed text wraps at the longest original line; everything else gets slack so it never wraps
        var W = opts.width ? opts.width : Math.ceil(opts.reflow ? measured + size * 0.15 : measured * 1.3 + size);
        var finalText = opts.reflow ? reflow(text) : text;
        applyDoc(nprop, finalText, chars, oldDoc, [W, H]);

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

    function makeBox(comp, members, staticBox, nameSuffix) {
        var start = 1e9, settle = 0, inP = 1e9, outP = -1e9, is3D = false, glowSrc = null, lowest = members[0];
        for (var i = 0; i < members.length; i++) {
            var L = members[i];
            start = Math.min(start, firstAnimTime(L)); settle = Math.max(settle, lastAnimTime(L));
            inP = Math.min(inP, L.inPoint); outP = Math.max(outP, L.outPoint);
            if (L.threeDLayer) is3D = true;
            if (L.index > lowest.index) lowest = L;
            if (!glowSrc) { var fx = L.property("ADBE Effect Parade"); for (var f = 1; f <= fx.numProperties; f++) if (fx.property(f).matchName === "ADBE Glo2") { glowSrc = fx.property(f); break; } }
        }
        if (staticBox) start = Math.max(inP, 0);
        var tSettle = Math.min(settle + 0.1, comp.duration - 0.01);
        // samples for screen-scale: settle time + every 0.25s for 20s
        var ts = [tSettle];
        for (var s = Math.max(start, 0); s < Math.min(start + 20, comp.duration); s += 0.25) ts.push(s);
        var res = sampleBounds(comp, members, ts);
        var pts = res[0];
        if (!pts) throw new Error("bounds failed in " + comp.name);
        var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9, zs = 0;
        for (var p = 0; p < pts.length; p++) { minX = Math.min(minX, pts[p][0]); maxX = Math.max(maxX, pts[p][0]); minY = Math.min(minY, pts[p][1]); maxY = Math.max(maxY, pts[p][1]); zs += pts[p][2]; }
        var z = zs / pts.length;
        // world-units-per-screen-pixel: closest in-frame view across samples (2D -> 1)
        var ratio = 1;
        if (is3D) {
            var best = 0;
            for (var r = 0; r < res.length; r++) {
                var q = res[r]; if (!q) continue;
                var sMinX = 1e9, sMaxX = -1e9, sMinY = 1e9, sMaxY = -1e9;
                for (var u = 0; u < q.length; u++) { sMinX = Math.min(sMinX, q[u][3]); sMaxX = Math.max(sMaxX, q[u][3]); sMinY = Math.min(sMinY, q[u][4]); sMaxY = Math.max(sMaxY, q[u][4]); }
                var cx = (sMinX + sMaxX) / 2, cy = (sMinY + sMaxY) / 2;
                if (cx < 0 || cx > comp.width || cy < 0 || cy > comp.height) continue;
                var sc = (sMaxX - sMinX) / (maxX - minX);
                if (sc > best) best = sc;
            }
            ratio = best > 0 ? 1 / best : 1;
        }
        var w = (maxX - minX) + 2 * PAD_X_PX * ratio, h = (maxY - minY) + 2 * PAD_Y_PX * ratio;

        var sl = comp.layers.addShape();
        sl.name = "Box" + (nameSuffix ? " " + nameSuffix : "");
        sl.label = 2; // yellow
        sl.threeDLayer = is3D;
        sl.moveAfter(lowest);
        var tg = sl.property("ADBE Transform Group");
        tg.property("ADBE Position").setValue(is3D ? [(minX + maxX) / 2, (minY + maxY) / 2, z] : [(minX + maxX) / 2, (minY + maxY) / 2]);
        var grp = sl.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        grp.name = "Box";
        var vc = grp.property("ADBE Vectors Group");
        vc.addProperty("ADBE Vector Shape - Rect");
        if (!staticBox) vc.addProperty("ADBE Vector Filter - Trim");
        vc.addProperty("ADBE Vector Graphic - Stroke");
        // re-fetch: adding properties invalidates earlier references
        vc = sl.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group");
        var rect = vc.property("ADBE Vector Shape - Rect");
        rect.property("ADBE Vector Rect Size").setValue([w, h]);
        rect.property("ADBE Vector Rect Roundness").setValue(ROUND_PX * ratio);
        var trim = staticBox ? null : vc.property("ADBE Vector Filter - Trim");
        var st = vc.property("ADBE Vector Graphic - Stroke");
        st.property("ADBE Vector Stroke Color").setValue(YELLOW);
        st.property("ADBE Vector Stroke Width").setValue(STROKE_PX * ratio);
        try { st.property("ADBE Vector Stroke Line Cap").setValue(2); st.property("ADBE Vector Stroke Line Join").setValue(2); } catch (e) {}
        if (trim) {
            var te = trim.property("ADBE Vector Trim End");
            te.setValueAtTime(start, 0); te.setValueAtTime(start + DRAW_DUR, 100);
            // same ease as the existing white line wipes (out 49.92% / in 100%)
            te.setTemporalEaseAtKey(1, [new KeyframeEase(0, 33.33)], [new KeyframeEase(0, 49.92)]);
            te.setTemporalEaseAtKey(2, [new KeyframeEase(0, 100)], [new KeyframeEase(0, 16.67)]);
            trim.property("ADBE Vector Trim Offset").setValue(-90); // start drawing from the top-left
        }
        if (glowSrc) { var g = sl.property("ADBE Effect Parade").addProperty("ADBE Glo2"); copyProp(glowSrc, g); }
        sl.inPoint = Math.max(inP, 0) < start ? Math.max(inP, 0) : start;
        sl.outPoint = outP;
        log.push(comp.name + " box '" + sl.name + "' " + (is3D ? "3D z=" + Math.round(z) : "2D") + " size=" + Math.round(w) + "x" + Math.round(h) + " ratio=" + Math.round(ratio * 100) / 100 + (trim ? " draw@" + Math.round(start * 100) / 100 : " static"));
        return sl;
    }

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

        var idMap = {}; // old layer id -> new layer id
        var done = {};
        function rebuild(L, opts) {
            var oldId = L.id;
            var doc = L.property("ADBE Text Properties").property("ADBE Text Document").value;
            if (opts.reflow === undefined) opts.reflow = !/^Hagrid/i.test(doc.font) && !isNumberList(doc.text);
            var res = rebuildText(comp, L, opts);
            idMap[oldId] = res.layer.id;
            res.oldId = oldId;
            return res;
        }
        if (spec.pairs) {
            for (var pj = 0; pj < spec.pairs.length; pj++) {
                var A = comp.layer(spec.pairs[pj][0]), B = comp.layer(spec.pairs[pj][1]);
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
        for (var li2 = 1; li2 <= comp.numLayers; li2++) { var LL = comp.layer(li2); if (LL instanceof TextLayer && !done[li2] && !LL.property("ADBE Text Properties").property("ADBE Text Document").value.boxText) fresh.push(LL); }
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
        // map box members to rebuilt layers
        for (var bi = 0; bi < boxMembers.length; bi++) {
            var mem = [];
            for (var mi = 0; mi < boxMembers[bi].length; mi++) {
                var oid = boxMembers[bi][mi];
                mem.push(layerById(comp, idMap[oid] !== undefined ? idMap[oid] : oid));
            }
            makeBox(comp, mem, !!spec.staticBoxes, boxMembers.length > 1 ? String(bi + 1) : "");
        }
    }
    return JSON.stringify({ status: "success", log: log });
})();
