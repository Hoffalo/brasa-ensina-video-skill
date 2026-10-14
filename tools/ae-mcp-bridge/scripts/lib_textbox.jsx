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
        // ---- Projeto de Pesquisa, Downloads\Motions.aep ----
        // ---- 2-carta motivação (its own Motions.aep) ----
        "G1": { keepItalic: [3], noReflow: [3], strike: [2, 3], stacks: [{ m: [3, 1], t: 6, attach: { 2: 3 } }], boxes: [[3, 1]] },
        "G2": { boxes: [[8, 7, 6, 5, 4]], titleGap: [{ title: [3], box: 0, gap: 80, t: 8, move: "content" }] },
        "G3": { stacks: [{ m: [3], t: 9, alignTo: [4] }], boxes: [[4, 5]], titleGap: [{ title: [3], box: 0, gap: 60, t: 9, move: "content" }] },
        "G4": { noReflow: [4, 5] }, // close-up continuation of G3: no box, keep line breaks so the highlight stays put
        "G5": { textEdits: [{ layer: 4, find: "Dica BRASA", repl: "DICA BRASA" }], justify: [{ layers: [4], mode: "center" }],
                centerX: [{ layers: [4, 3], x: "frame", t: 6 }, { layers: [5], mode: "group", x: "frame", t: 6 }], boxes: [[5]], titleGap: [{ title: [3, 4], box: 0, gap: 60, t: 6, move: "content" }] },
        "G6": { stacks: [{ m: [3], t: 9, alignTo: [4] }], sameWidth: [[4, 5, 6]], boxes: [[4, 5, 6]], titleGap: [{ title: [3], box: 0, gap: 60, t: 18, move: "content" }] },
        "G7": { stacks: [{ m: [3], t: 9, alignTo: [4] }], boxes: [[4, 5]], titleGap: [{ title: [3], box: 0, gap: 60, t: 6, move: "content" }] },
        "G8": { textEdits: [{ layer: 4, find: "Dica BRASA", repl: "DICA BRASA" }], justify: [{ layers: [4], mode: "center" }],
                centerX: [{ layers: [4, 3], x: "frame", t: 6 }, { layers: [5], mode: "group", x: "frame", t: 6 }], boxes: [[5]], titleGap: [{ title: [3, 4], box: 0, gap: 60, t: 6, move: "content" }] },
        "G9": { stacks: [{ m: [3], t: 9, alignTo: [4] }], sameWidth: [[4, 5, 6]], boxes: [[4, 5, 6]], titleGap: [{ title: [3], box: 0, gap: 60, t: 18, move: "content" }] },
        "G10": { stacks: [{ m: [3], t: 9, alignTo: [4] }], sameWidth: [[4, 5]], boxes: [[4, 5]], titleGap: [{ title: [3], box: 0, gap: 60, t: 6, move: "content" }] },
        "G11": { stacks: [{ m: [3], t: 9, alignTo: [4] }], sameWidth: [[4, 5]], boxes: [[4, 5]], titleGap: [{ title: [3], box: 0, gap: 60, t: 18, move: "content" }] },
        "G12": { textEdits: [{ layer: 4, find: "Dica BRASA", repl: "DICA BRASA" }], justify: [{ layers: [4], mode: "center" }],
                centerX: [{ layers: [4, 3], x: "frame", t: 6 }, { layers: [5], mode: "group", x: "frame", t: 6 }], boxes: [[5]], titleGap: [{ title: [3, 4], box: 0, gap: 60, t: 6, move: "content" }] },
        "G13": { stacks: [{ m: [3], t: 9, alignTo: [4] }], sameWidth: [[4, 5]], boxes: [[4, 5]], titleGap: [{ title: [3], box: 0, gap: 60, t: 6, move: "content" }] },
        "G14": { stacks: [{ m: [3], t: 9, alignTo: [4] }], sameWidth: [[4, 5, 6]], boxes: [[4, 5, 6]], titleGap: [{ title: [3], box: 0, gap: 60, t: 12, move: "content" }] },
        "G15": { stacks: [{ m: [3], t: 60, alignTo: [4] }], boxes: [[4]], titleGap: [{ title: [3], box: 0, gap: 60, t: 60 }] },
        "G16": { stacks: [{ m: [9, 10], t: 70 }, { m: [7, 8], t: 70 }, { m: [4, 3], t: 70 }, { m: [6, 5], t: 70 }],
                 boxes: [[9, 10], [7, 8], [4, 3], [6, 5]], staticBoxes: true, uniform: true },
        // ---- bolsas mestrado eua (its own Motions.aep) ----
        "bm:G4": { stacks: [{ m: [3, 5, 4], t: 12 }], boxes: [[5, 4]], titleGap: [{ title: [3], box: 0, gap: 60, t: 12, move: "content" }] },
        "bm:G5": { justify: [{ layers: [4], mode: "center" }], stacks: [{ m: [5, 6, 7, 8], t: 15 }],
                   centerX: [{ layers: [4, 3], x: "frame", t: 15 }, { layers: [5, 6, 7, 8], mode: "group", x: "frame", t: 15 }],
                   boxes: [[5, 6, 7, 8]], titleGap: [{ title: [3, 4], box: 0, gap: 60, t: 15, move: "content" }] },
        "bm:G6": { stacks: [{ m: [7, 10], t: 2 }, { m: [3, 6], t: 9, attach: { 4: 6, 5: 6 } }, { m: [8, 9, 11], t: 9 }], boxes: [[10], [6, 4, 5]],
                   titleGap: [{ title: [7], box: 0, gap: 60, t: 2, move: "content" }, { title: [3], box: 1, gap: 60, t: 9, move: "content" }] },
        "bm:G7": { sameWidth: [[5, 6, 7, 8]], justify: [{ layers: [3, 4], mode: "center" }],
                   centerX: [{ layers: [3], x: "frame", t: 12 }, { layers: [4], x: "frame", t: 12 }, { layers: [9, 5, 6, 7, 8], mode: "group", x: "frame", t: 12 }],
                   boxes: [[9, 8]], titleGap: [{ title: [3, 4], box: 0, gap: 60, t: 12, move: "content" }] },
        "bm:G8": { justify: [{ layers: [3], mode: "center" }],
                   centerX: [{ layers: [3], x: "frame", t: 8 }, { layers: [4, 5, 6], mode: "group", x: "frame", t: 8 }],
                   boxes: [[4, 5, 6]], titleGap: [{ title: [3], box: 0, gap: 60, t: 8, move: "content" }] },
        "bm:G9": { justify: [{ layers: [7, 3, 6], mode: "center" }],
                   centerX: [{ layers: [7], x: "frame", t: 3 }, { layers: [8, 9, 10], mode: "group", x: "frame", t: 3 },
                             { layers: [3], x: "frame", t: 13 }, { layers: [4, 5], mode: "group", x: "frame", t: 13 }, { layers: [6], x: "frame", t: 13 }],
                   boxes: [[8, 9, 10], [4, 5]],
                   titleGap: [{ title: [7], box: 0, gap: 60, t: 3, move: "content" }, { title: [3], box: 1, gap: 60, t: 13, move: "content" }] },
        "bm:G10": { sameWidth: [[4, 5]], justify: [{ layers: [3], mode: "center" }],
                    centerX: [{ layers: [3], x: "frame", t: 9.9 }, { layers: [6, 4, 5], mode: "group", x: "frame", t: 9.9 }],
                    boxes: [[6, 4, 5]], boxPad: { 0: { bottom: 70 } }, titleGap: [{ title: [3], box: 0, gap: 60, t: 9.9, move: "content" }] },
        "bm:G11": { stacks: [{ m: [3, 4, 5], t: 8 }], boxes: [[5]], titleGap: [{ title: [3, 4], box: 0, gap: 60, t: 8, move: "content" }] },
        "bm:G12": { sameWidth: [[7, 8]], stacks: [{ m: [12, 10, 11], t: 3 }, { m: [6, 9, 7, 8], t: 10 }, { m: [3, 5, 4], t: 27 }],
                    boxes: [[10, 11], [9, 7, 8], [5, 4]], uniform: [[0, 1, 2]],
                    titleGap: [{ title: [12], box: 0, gap: 50, t: 7, move: "content" }, { title: [6], box: 1, gap: 50, t: 16, move: "content" }, { title: [3], box: 2, gap: 50, t: 27, move: "content" }] },
        "G21": { skip: [3, 4, 5, 6], boxes: [[5, 6]] },
        "G25": { noReflow: [4, 5], hagridToLato: [4, 6], stacks: [{ m: [6, 5], t: 8, alignTo: [3], attach: { 4: 5 } }],
                 boxes: [[6, 5, 4]], titleGap: [{ title: [3, 8, 7], box: 0, gap: 70, t: 8, move: "content" }] },
        "G22": { stacks: [{ m: [11, 10, 9, 7, 8], t: 9.8, alignTo: [4] }], boxes: [[11, 10, 9, 7, 8]],
                 titleGap: [{ title: [4], box: 0, gap: 80, t: 9.8, move: "content" }] },
        // ---- Projeto de Pesquisa (centred comps re-laid-out as left blocks) ----
        "g5 copy 2": { skip: [7, 8, 9, 10], stacks: [{ m: [6], t: 30 }] },
        "G26": { stacks: [{ m: [4, 8], t: 4.5 }, { m: [7, 6], t: 11.5 }], boxes: [[8], [7, 6]], hagridToLato: [6], titleGap: [{ title: [4], box: 0, gap: 80, t: 4.5 }] },
        "G27": { stacks: [{ m: [4, 11, 9], t: 10 }, { m: [5, 10, 8], t: 24 }], boxes: [[11, 9], [10, 8]],
                 titleGap: [{ title: [4], box: 0, gap: 80, t: 10 }, { title: [5], box: 1, gap: 80, t: 24 }] },
        "G28": { keepItalic: [5], noReflow: [5] },
        "G29": { textEdits: [{ layer: 10, find: "re:Pergunta[\\r\\u0003]1", repl: "Pergunta 1" }, { layer: 9, find: "re:Pergunta[\\r\\u0003]2", repl: "Pergunta 2" }, { layer: 8, find: "re:Pergunta[\\r\\u0003]3", repl: "Pergunta 3" }],
                 hagridToLato: [17, 14, 13],
                 justify: [{ layers: [10, 9, 8, 18, 17, 15, 14, 12, 16, 13, 11], mode: "center" }],
                 setPos: [{ layers: [10, 9, 8], y: -216 }, { layers: [17], z: -293 }],
                 centerX: [{ layers: [10, 18, 7, 17], x: -1040, t: 5 }, { layers: [9, 15, 4, 5, 14, 12], x: 960, t: 11 }, { layers: [8, 16, 6, 13, 11], x: 2960, t: 19 }],
                 boxes: [[18, 17], [15, 14, 12], [16, 13, 11]], uniform: [[0, 1, 2]], alignTop: true, centerInBox: true, padX: 56, padY: 72,
                 vgap: [{ above: 18, below: [17], gap: 260, t: 5 }, { above: 15, below: [14, 12], gap: 260, t: 11 }, { above: 16, below: [13, 11], gap: 260, t: 19 }],
                 between: [{ layer: 7, above: 18, below: 17, t: 5 }, { layer: 4, above: 15, below: 14, t: 11 }, { layer: 5, above: 15, below: 14, t: 11 }, { layer: 6, above: 16, below: 13, t: 19 }],
                 titleGap: [{ title: [10], box: 0, gap: 70, t: 5, move: "content" }, { title: [9], box: 1, gap: 70, t: 11, move: "content" }, { title: [8], box: 2, gap: 70, t: 19, move: "content" }] },
        // Bolsas EUA (prefix BE:) -- body paragraphs -> justified box text; titles/labels/cells untouched
        "BE:G37": { skip: [8, 9, 10, 11, 14, 17, 18, 19, 20], pairs: [[13, 12]] },
        "BE:G39": { skip: [1, 2, 3, 6, 7, 8, 10, 11, 12, 13, 14, 15] },
        "BE:G39m need-blind": { skip: [3, 6, 9, 12, 15, 18, 21, 24, 27, 28] },
        "BE:G40": { skip: [5, 8, 9] },
        "BE:G43": { skip: [3] },
        "G30": { textEdits: [{ layer: 4, find: "sua justificativa", repl: "Sua justificativa" }],
                 stacks: [{ m: [6, 8], t: 33.4 }, { m: [7, 9], t: 33.4 }, { m: [11, 10], t: 33.4 }, { m: [4, 3], t: 33.4 }],
                 centerX: [{ layers: [5], x: "frame", t: 33.4 }, { layers: [4, 3], mode: "group", x: "frame", t: 33.4 }],
                 boxes: [[6, 8], [7, 9], [11, 10], [4, 3]], uniform: [[0, 1, 2]], alignTop: true, pad: 40, rows: [{ boxes: [0, 1, 2], gap: 40, center: true, t: 33.4 }],
                 titleGap: [{ title: [5], box: 3, gap: 60, t: 33.4 }] },
        "G31": { keepItalic: [5], noReflow: [5] },
        "G33": { textEdits: [{ layer: 8, find: "- com quem", repl: "- Com quem" }, { layer: 9, find: "- quantas", repl: "- Quantas" }],
                 stacks: [{ m: [3, 4, 5, 9, 8, 7, 6], t: 8 }], boxes: [[9, 8, 7, 6]], titleGap: [{ title: [3, 4, 5], box: 0, gap: 130, t: 8, move: "content" }] },
        "G34": { textEdits: [{ layer: 4, find: "Dica BRASA", repl: "DICA BRASA" }], justify: [{ layers: [4], mode: "center" }],
                 stacks: [{ m: [8], t: 11 }, { m: [7], t: 11 }, { m: [6], t: 11 }],
                 centerX: [{ layers: [4, 3], x: "frame", t: 11 }, { layers: [9], mode: "group", x: "frame", t: 11 }],
                 boxes: [[8], [7], [6]], uniform: [[0, 1, 2]], alignTop: true, pad: 30, rows: [{ boxes: [0, 1, 2], gap: 30, center: true, t: 11 }],
                 titleGap: [{ title: [3, 4, 9], box: 0, gap: 60, t: 11 }] },
        "G35": { skip: [3, 4, 5, 6], hagridToLato: [13, 14], stacks: [{ m: [8, 9], t: 17, alignTo: [14] }, { m: [14], t: 17 }, { m: [13, 12, 11, 10], t: 17 }],
                 boxes: [[14], [13, 12, 11, 10]], boxPad: { 0: { bottom: 12 } }, titleGap: [{ title: [8, 9], box: 0, gap: 80, t: 17 }] },
        "G36": { stacks: [{ m: [3], t: 10 }, { m: [4], t: 7 }, { m: [5], t: 3 }, { m: [6], t: 1 }] },
        "G1 Copy 10": { boxes: [[10, 9, 8, 7, 6, 5, 4]] },
        "G37": { noReflow: [6, 5], hagridToLato: [6, 5], boxes: [[6, 3, 5]], titleGap: [{ title: [4], box: 0, gap: 60, t: 10 }] },
        // ---- paises baratos (hand-made comps) ----
        "pb:G20": { hagridToLato: [9], justify: [{ layers: [4, 5], mode: "center" }],
                    stacks: [{ m: [10, 9], t: 4 }, { m: [8, 7, 6], t: 8.5 }],
                    centerX: [{ layers: [5], x: "frame", t: 4 }, { layers: [4], x: "frame", t: 8.5 }, { layers: [10, 9], mode: "group", x: "frame", t: 4 }, { layers: [8, 7, 6], mode: "group", x: "frame", t: 8.5 }],
                    boxes: [[10, 9], [8, 7, 6]],
                    titleGap: [{ title: [5], box: 0, gap: 60, t: 4, move: "content" }, { title: [4], box: 1, gap: 60, t: 8.5, move: "content" }] },
        "pb:G23": { justify: [{ layers: [7, 5, 6], mode: "center" }], stacks: [{ m: [4, 3], t: 13.5 }],
                    centerX: [{ layers: [7], x: "frame", t: 5 }, { layers: [5], x: "frame", t: 5 }, { layers: [6], x: "frame", t: 13.5 }, { layers: [4, 3], mode: "group", x: "frame", t: 13.5 }],
                    boxes: [[4, 3]], titleGap: [{ title: [6], box: 0, gap: 60, t: 13.5, move: "content" }] },
        "pb:G24": { stacks: [{ m: [17, 11, 16, 9, 15, 8], t: 12 }, { m: [3], t: 30, alignTo: [14] }, { m: [14, 10, 13, 12], t: 30 }],
                    inline: [{ layer: 7, after: 11, t: 12, space: 30 }, { layer: 6, after: 9, t: 12, space: 30 }], hagridToLato: [6, 7],
                    boxes: [[17, 11, 7, 16, 9, 6, 15, 8], [14, 10, 13, 12]],
                    titleGap: [{ title: [3], box: 1, gap: 60, t: 30, move: "content" }] },
        "pb:G25": { stacks: [{ m: [7, 6, 5, 4, 3], t: 8 }], boxes: [[5, 4, 3]], titleGap: [{ title: [7, 6], box: 0, gap: 60, t: 8, move: "content" }] },
        "pb:G26": { justify: [{ layers: [9, 8, 7, 14, 13, 16, 11, 10, 15, 12], mode: "center" }],
                    centerX: [{ layers: [5, 9, 14, 13], px: 270, t: 10 }, { layers: [4, 8, 16, 11, 10], px: 960, t: 10 }, { layers: [3, 7, 15, 12], px: 1650, t: 10 }],
                    boxes: [[9, 14, 13], [8, 16, 11, 10], [7, 15, 12]], uniform: [[0, 1, 2]], alignTop: true, boxCenter: true,
                    boxPad: { 0: { top: 300 }, 1: { top: 300 }, 2: { top: 300 } } },
        "pb:G37": { skip: [12, 13], hagridToLato: [8, 15], justify: [{ layers: [8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20], mode: "center" }],
                    centerX: [{ layers: [14], like: 15, t: 30 }, { layers: [8, 10], like: 9, t: 20 }, { layers: [11], like: 16, t: 20 }],
                    boxes: [[11, 16], [9, 8, 10], [15]], uniform: [[0, 1, 2]], alignTop: true, boxCenter: true, pad: 40,
                    grow: [{ box: 2, to: [15, 14, 13, 12], toX: [15, 14], t0: 25.1, t1: 25.6 }] },
        "pb:G39": { hagridToLato: [9, 5], justify: [{ layers: [8, 7], mode: "center" }],
                    stacks: [{ m: [12, 11, 10], t: 7, alignTo: [3] }, { m: [6, 5, 4], t: 18 }],
                    inline: [{ layer: 9, after: 10, t: 7, space: 24 }],
                    centerX: [{ layers: [8], x: "frame", t: 18 }, { layers: [7], x: "frame", t: 18 }, { layers: [6, 5, 4], mode: "group", x: "frame", t: 18 }],
                    boxes: [[10, 9], [6, 5, 4]],
                    titleGap: [{ title: [12, 11], box: 0, gap: 60, t: 7, move: "content" }, { title: [8, 7], box: 1, gap: 60, t: 18, move: "content" }] },
        "pb:G40": { latoKeepCase: [9, 8], noReflow: [9, 8], justify: [{ layers: [9, 8], mode: "center" }], stacks: [{ m: [7, 6], t: 18 }],
                    centerX: [{ layers: [9], x: "frame", t: 18 }, { layers: [8], x: "frame", t: 18 }, { layers: [7, 6], mode: "group", x: "frame", t: 18 }],
                    boxes: [[9, 8], [7, 6]], titleGap: [{ title: [9, 8], box: 1, gap: 100, t: 18, move: "content" }] },
        "pb:G43": { hagridToLato: [6, 5, 4], stacks: [{ m: [6, 5, 4], t: 14, alignTo: [3] }], boxes: [[6, 5, 4]] }
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
        var text = oldDoc.text.replace(/\u0003/g, "\r"); // soft returns get stretched by full justification
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
        for (var i0 = 0; i0 < layers.length; i0++) if (!layers[i0]) throw new Error("sampleBounds: missing layer in " + comp.name);
        var tmp = comp.layers.addText("x");
        var ids = [], fxi = [];
        for (var i = 0; i < layers.length; i++) {
            ids.push(layers[i].index);
            // Transform effects (ADBE Geometry2) shift the rendered text: include their position-anchor offset
            var fl = [], fp = layers[i].property("ADBE Effect Parade");
            if (fp) for (var e = 1; e <= fp.numProperties; e++) if (fp.property(e).matchName === "ADBE Geometry2" && fp.property(e).enabled) fl.push(e);
            fxi.push("[" + fl.join(",") + "]");
        }
        var expr = "var ids=[" + ids.join(",") + "],fx=[" + fxi.join(",") + "];var o=[];for(var i=0;i<ids.length;i++){var L=thisComp.layer(ids[i]);var r=L.sourceRectAtTime(time,false);" +
            "var ox=0,oy=0;for(var k=0;k<fx[i].length;k++){var E=L.effect(fx[i][k]);ox+=E(2)[0]-E(1)[0];oy+=E(2)[1]-E(1)[1];}" +
            "var c=[[r.left,r.top],[r.left+r.width,r.top],[r.left,r.top+r.height],[r.left+r.width,r.top+r.height]];" +
            // text/shape layers are continuously rasterized: the Transform effect offset lands in comp pixels, unscaled
            "var w0=L.toWorld(c[0]),w1=L.toWorld(c[1]),s0=L.toComp(c[0]),s1=L.toComp(c[1]);var k=Math.abs(s1[0]-s0[0])>0.01?Math.abs(w1[0]-w0[0])/Math.abs(s1[0]-s0[0]):1;" +
            "for(var j=0;j<4;j++){var w=L.toWorld(c[j]);var s=L.toComp(c[j]);o.push([w[0]+ox*k,w[1]+oy*k,(w.length>2?w[2]:0),s[0]+ox,s[1]+oy]);}}JSON.stringify(o);";
        var sp = tmp.property("ADBE Text Properties").property("ADBE Text Document");
        sp.expression = expr;
        var res = [];
        for (var k = 0; k < t.length; k++) { try { res.push(eval(sp.valueAtTime(t[k], false).text)); } catch (e) { res.push(null); } }
        tmp.remove();
        return res;
    }
    function originScreen(comp, L, t) {
        var tmp = comp.layers.addText("x"), sp = tmp.property("ADBE Text Properties").property("ADBE Text Document");
        sp.expression = "var p=thisComp.layer(" + (L.index) + ").toComp([0,0]);p[0]+','+p[1];";
        var v = sp.valueAtTime(t, false).text.split(","); tmp.remove();
        return [parseFloat(v[0]), parseFloat(v[1])];
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

    // re-apply per-character runs read with readChars (keeps justification / box size of the current doc)
    function restyleText(L, fn) {
        var prop = L.property("ADBE Text Properties").property("ADBE Text Document"), doc = prop.value;
        var chars = readChars(doc, true), text = doc.text, just = doc.justification, box = doc.boxText ? doc.boxTextSize : null;
        var nt = fn(text, chars);
        if (nt === null) return false;
        if (nt.length !== text.length) throw new Error("restyleText needs same-length text in " + L.name);
        doc.text = nt; doc.justification = just; if (box) doc.boxTextSize = box;
        var i = 0;
        while (i < chars.length) {
            var j = i + 1, key = chars[i].toSource();
            while (j < chars.length && chars[j].toSource() === key) j++;
            var cr = doc.characterRange(i, j);
            for (var a in chars[i]) { try { if (a === "leading" && chars[i].autoLeading) continue; cr[a] = chars[i][a]; } catch (e) {} }
            i = j;
        }
        prop.setValue(doc);
        return true;
    }
    // Hagrid is for UPPERCASE titles only: turn Hagrid runs inside body text/captions into yellow Lato, sentence case
    function hagridToLato(L, noCap, keepCase) {
        return restyleText(L, function (text, chars) {
            var a = text.split(""), changed = false, anyH = false;
            for (var h = 0; h < chars.length; h++) if (!/^Hagrid/i.test(chars[h].font || "")) { try { chars[h].fontCapsOption = FontCapsOption.FONT_NORMAL_CAPS; } catch (e) {} }
            for (var i = 0; i < chars.length; i++) {
                if (!chars[i].font || !/^Hagrid/i.test(chars[i].font)) continue;
                var runStart = (i === 0 || !/^Hagrid/i.test(chars[i - 1].font || ""));
                chars[i].font = "Lato-Regular"; chars[i].fillColor = YELLOW; chars[i].applyFill = true;
                try { chars[i].fontCapsOption = FontCapsOption.FONT_NORMAL_CAPS; } catch (e) {}
                var lower = a[i].toLowerCase();
                if (runStart) {
                    var k = i - 1; while (k >= 0 && /[\s\r\u0003]/.test(a[k])) k--;
                    if ((k < 0 && !noCap) || (k >= 0 && /[.!?:]/.test(a[k]))) lower = a[i].toUpperCase();
                }
                if (!keepCase) a[i] = lower; changed = true;
            }
            // acronyms / codes (B2, EUA, DSU, $25) keep their typed case
            var re = /[A-Za-zÀ-ÿ0-9$€]+/g, m;
            while ((m = re.exec(text)) !== null) { var w = m[0]; if ((w.length <= 3 || /[0-9]/.test(w)) && w === w.toUpperCase()) for (var q = 0; q < w.length; q++) a[m.index + q] = w.charAt(q); }
            return changed ? a.join("") : null;
        });
    }
    function layerById(c, id) { for (var i = 1; i <= c.numLayers; i++) if (c.layer(i).id === id) return c.layer(i); return null; }

    // ---------- main ----------
    var targets = $.global.MCP_TARGETS || [];
    for (var ti = 0; ti < targets.length; ti++) {
        var comp = findComp(targets[ti]);
        if (!comp) { log.push("MISSING " + targets[ti]); continue; }
        var spec = SPEC[($.global.MCP_SPEC_PREFIX || "") + comp.name] || SPEC[comp.name] || {};
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
        var editDefs = [];
        if (spec.textEdits) for (var te0 = 0; te0 < spec.textEdits.length; te0++) editDefs.push({ id: comp.layer(spec.textEdits[te0].layer).id, find: spec.textEdits[te0].find, repl: spec.textEdits[te0].repl });
        var inlRaw = []; if (spec.inline) for (var in0 = 0; in0 < spec.inline.length; in0++) inlRaw.push(comp.layer(spec.inline[in0].layer).id);
        var latoKeepIds = ids(spec.latoKeepCase || []);
        var latoIds = ids(spec.hagridToLato), justDefs = [], posDefs = [], cxDefs = [];
        if (spec.justify) for (var jd0 = 0; jd0 < spec.justify.length; jd0++) justDefs.push({ m: ids(spec.justify[jd0].layers), mode: spec.justify[jd0].mode });
        if (spec.setPos) for (var sp0 = 0; sp0 < spec.setPos.length; sp0++) posDefs.push({ m: ids(spec.setPos[sp0].layers), y: spec.setPos[sp0].y, z: spec.setPos[sp0].z });
        if (spec.centerX) for (var cx0 = 0; cx0 < spec.centerX.length; cx0++) { var CX0 = spec.centerX[cx0]; cxDefs.push({ m: ids(CX0.layers), mode: CX0.mode || "each", x: CX0.x, px: CX0.px, like: CX0.like !== undefined ? ids([CX0.like]) : null, t: CX0.t }); }
        if (spec.between) for (var bw0 = 0; bw0 < spec.between.length; bw0++) { var B0 = spec.between[bw0]; B0._a = comp.layer(B0.layer).id; B0._u = comp.layer(B0.above).id; B0._d = comp.layer(B0.below).id; }
        var swDefs = []; if (spec.sameWidth) for (var sw0 = 0; sw0 < spec.sameWidth.length; sw0++) swDefs.push(ids(spec.sameWidth[sw0]));
        var gapDefs = [];
        if (spec.titleGap) for (var tg0 = 0; tg0 < spec.titleGap.length; tg0++) { var T0 = spec.titleGap[tg0]; gapDefs.push({ title: ids(T0.title), box: T0.box, gap: T0.gap, t: T0.t, move: T0.move }); }
        var stackDefs = [];
        if (spec.stacks) for (var sd = 0; sd < spec.stacks.length; sd++) {
            var S0 = spec.stacks[sd], att = [];
            if (S0.attach) for (var ak in S0.attach) att.push({ layer: comp.layer(parseInt(ak, 10)).id, to: comp.layer(S0.attach[ak]).id });
            stackDefs.push({ m: ids(S0.m), t: S0.t, attach: att, alignTo: S0.alignTo ? ids(S0.alignTo) : null });
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
        // crossfading versions of the same paragraph share one box width (identical wrapping, no jumps)
        for (var sw = 0; sw < swDefs.length; sw++) {
            var SW = members(swDefs[sw]), wMax = 0;
            for (var s1 = 0; s1 < SW.length; s1++) wMax = Math.max(wMax, SW[s1].property("ADBE Text Properties").property("ADBE Text Document").value.boxTextSize[0]);
            for (var s2 = 0; s2 < SW.length; s2++) {
                var sp2 = SW[s2].property("ADBE Text Properties").property("ADBE Text Document"), sd = sp2.value, t0w = Math.max(SW[s2].inPoint, 0);
                if (sd.boxTextSize[0] === wMax) continue;
                var bR = SW[s2].sourceRectAtTime(t0w, false);
                sd.boxTextSize = [wMax, sd.boxTextSize[1]]; sp2.setValue(sd);
                var aR = SW[s2].sourceRectAtTime(t0w, false), anc2 = SW[s2].property("ADBE Transform Group").property("ADBE Anchor Point");
                shiftProp(anc2, aR.left - bR.left, aR.top - bR.top);
            }
            log.push(comp.name + " shared width " + Math.round(wMax) + " for " + SW.length + " layers");
        }
        // Hagrid is for titles only and always fully UPPERCASE
        for (var hc = 1; hc <= comp.numLayers; hc++) {
            var HL = comp.layer(hc); if (!(HL instanceof TextLayer) || has(skipIds, HL.id)) continue;
            var hp = HL.property("ADBE Text Properties").property("ADBE Text Document"), hd = hp.value;
            if (!/^Hagrid/i.test(hd.font) || hd.text.toUpperCase() === hd.text || hd.fontCapsOption === FontCapsOption.FONT_ALL_CAPS) continue;
            var hb = HL.sourceRectAtTime(Math.max(HL.inPoint, 0), false);
            try { hd.fontCapsOption = FontCapsOption.FONT_ALL_CAPS; hp.setValue(hd); } catch (e) { continue; }
            var ha = HL.sourceRectAtTime(Math.max(HL.inPoint, 0), false);
            shiftProp(HL.property("ADBE Transform Group").property("ADBE Anchor Point"), ha.left - hb.left, ha.top - hb.top);
            log.push(comp.name + " '" + HL.name + "' Hagrid -> ALL CAPS");
        }
        // paragraphs continued by another layer: justify their last line too
        var FLs = members(fullLastIds);
        for (var jf = 0; jf < FLs.length; jf++) {
            var fp = FLs[jf].property("ADBE Text Properties").property("ADBE Text Document"), fd = fp.value;
            fd.justification = ParagraphJustification.FULL_JUSTIFY_LASTLINE_FULL; fp.setValue(fd);
            log.push(comp.name + " '" + FLs[jf].name + "' last line justified");
        }
        // text edits (same length, styles kept), Hagrid->Lato, justification overrides, absolute y/z
        for (var e1 = 0; e1 < editDefs.length; e1++) {
            var ED = editDefs[e1], EL = members([ED.id])[0];
            if (restyleText(EL, function (t) { var f = ED.find.indexOf("re:") === 0 ? new RegExp(ED.find.substr(3)) : ED.find; var nt = t.replace(f, ED.repl); return nt !== t ? nt : null; })) log.push(comp.name + " text '" + ED.find + "' -> '" + ED.repl + "'");
        }
        var LL2 = members(latoIds);
        var inlIds = []; for (var in1 = 0; in1 < inlRaw.length; in1++) inlIds.push(members([inlRaw[in1]])[0].id);
        var LK = members(latoKeepIds); for (var e7 = 0; e7 < LK.length; e7++) if (hagridToLato(LK[e7], true, true)) log.push(comp.name + " '" + LK[e7].name + "' Hagrid -> yellow Lato (case kept)");
        for (var e2 = 0; e2 < LL2.length; e2++) if (hagridToLato(LL2[e2], ("|" + inlIds.join("|") + "|").indexOf("|" + LL2[e2].id + "|") >= 0)) log.push(comp.name + " '" + LL2[e2].name + "' Hagrid -> yellow Lato");
        for (var e3 = 0; e3 < justDefs.length; e3++) {
            var JM = members(justDefs[e3].m);
            for (var e4 = 0; e4 < JM.length; e4++) {
                var jp = JM[e4].property("ADBE Text Properties").property("ADBE Text Document"), jdc = jp.value;
                jdc.justification = justDefs[e3].mode === "center" ? ParagraphJustification.CENTER_JUSTIFY : ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT; jp.setValue(jdc);
            }
        }
        for (var e5 = 0; e5 < posDefs.length; e5++) {
            var PM = members(posDefs[e5].m);
            for (var e6 = 0; e6 < PM.length; e6++) {
                var pp = PM[e6].property("ADBE Transform Group").property("ADBE Position"), cur = pp.numKeys ? pp.keyValue(pp.numKeys) : pp.value;
                var dy = posDefs[e5].y !== undefined ? posDefs[e5].y - cur[1] : 0, dz = posDefs[e5].z !== undefined ? posDefs[e5].z - cur[2] : 0;
                if (pp.numKeys) { for (var kk = 1; kk <= pp.numKeys; kk++) { var kv2 = pp.keyValue(kk); kv2[1] += dy; kv2[2] += dz; pp.setValueAtKey(kk, kv2); } }
                else { cur[1] += dy; cur[2] += dz; pp.setValue(cur); }
            }
        }
        var padX = spec.padX !== undefined ? spec.padX : (spec.pad !== undefined ? spec.pad : PAD_X_PX), padY = spec.padY !== undefined ? spec.padY : (spec.pad !== undefined ? spec.pad : PAD_Y_PX);
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
            if (SD.alignTo) target = screenBounds(comp, members(SD.alignTo), SD.t).minX; // left-aligned titles sit at the content's left edge
            for (var s2 = 0; s2 < Sm.length; s2++) { var dS = target - sbs[s2].minX; dxs[SD.m[s2]] = dS; shiftLayer(Sm[s2], dS * sbs[s2].ratio, 0); }
            for (var s3 = 0; s3 < SD.attach.length; s3++) {
                var AL = members([SD.attach[s3].layer])[0], dA = dxs[SD.attach[s3].to] || 0;
                shiftLayer(AL, dA * screenBounds(comp, [AL], SD.t).ratio, 0);
            }
            log.push(comp.name + " stack " + (st + 1) + " left edge at " + Math.round(target) + "px");
        }
        // horizontal centring: each layer (or a group as one block) centred on the frame or on a world x
        for (var c1 = 0; c1 < cxDefs.length; c1++) {
            var CD = cxDefs[c1], CM = members(CD.m);
            var centreOf = function (ls) { var b = screenBounds(comp, ls, CD.t); return { s: (b.minX + b.maxX) / 2, w: (b.world.minX + b.world.maxX) / 2, r: b.ratio }; };
            if (CD.mode === "group") {
                var cg = centreOf(CM), dW = CD.x === "frame" ? (comp.width / 2 - cg.s) * cg.r : CD.x - cg.w;
                for (var c2 = 0; c2 < CM.length; c2++) shiftLayer(CM[c2], dW, 0);
            } else {
                for (var c3 = 0; c3 < CM.length; c3++) { var ce = centreOf([CM[c3]]), dX3; if (CD.like) dX3 = centreOf(members(CD.like)).w - ce.w; else if (typeof CD.px === "number") dX3 = (CD.px - ce.s) * ce.r; else if (CD.x === "frame") dX3 = (comp.width / 2 - ce.s) * ce.r; else dX3 = CD.x - ce.w; if ($.global.MCP_DEBUG) log.push("cx " + CM[c3].name + " s=" + Math.round(ce.s) + " r=" + ce.r + " px=" + CD.px + " dX=" + dX3); shiftLayer(CM[c3], dX3, 0); }
            }
        }
        // vertical gap between a text and the layers below it (e.g. question -> arrow -> caption)
        if (spec.vgap) for (var vg = 0; vg < spec.vgap.length; vg++) {
            var VG = spec.vgap[vg], upL = members(ids([VG.above])), dnL = members(ids(VG.below));
            var ub = screenBounds(comp, upL, VG.t), db = screenBounds(comp, dnL, VG.t), dS2 = (ub.maxY + VG.gap) - db.minY;
            for (var vg2 = 0; vg2 < dnL.length; vg2++) shiftLayer(dnL[vg2], 0, dS2 * db.ratio);
        }
        // inline: a highlight layer continues the sentence of another layer (same line, one space after its end)
        if (spec.inline) for (var il = 0; il < spec.inline.length; il++) {
            var IL = spec.inline[il], aL = members(ids([IL.after])), bL = members(ids([IL.layer]));
            var ab = screenBounds(comp, aL, IL.t), bb = screenBounds(comp, bL, IL.t), spPx = IL.space !== undefined ? IL.space : (ab.maxY - ab.minY) * 0.28;
            // baseline: text layers' origin [0,0] sits on the first baseline, so match origins instead of rect bottoms (descenders)
            var oA = originScreen(comp, aL[0], IL.t), oB = originScreen(comp, bL[0], IL.t);
            shiftLayer(bL[0], (ab.maxX + spPx - bb.minX) * bb.ratio, (oA[1] - oB[1]) * bb.ratio);
            log.push(comp.name + " inline '" + bL[0].name + "' after '" + aL[0].name + "'");
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
                var ubp = (spec.boxPad && spec.boxPad[grpI[u3]]) || {}, upt = ubp.top !== undefined ? ubp.top : padY, upb = ubp.bottom !== undefined ? ubp.bottom : padY;
                G.box = { x: spec.boxCenter ? (G.minX + G.maxX) / 2 - mw / 2 - padX * rU : G.minX - padX * rU, y: (spec.alignTop ? top : G.minY) - upt * rU, w: mw + 2 * padX * rU, h: mh + (upt + upb) * rU };
                if (spec.centerInBox) { // centre content horizontally and vertically inside its box
                    G.box.x = (G.minX + G.maxX) / 2 - G.box.w / 2;
                    if (spec.alignTop) { var dyC = (top + mh / 2) - (G.minY + G.maxY) / 2; for (var vc = 0; vc < G.members.length; vc++) shiftLayer(G.members[vc], 0, dyC); G.minY += dyC; G.maxY += dyC; }
                }
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
            if (GD.move === "content") { // move the box and its content instead of the title
                if (Math.abs(need) > 0.5) {
                    var rB = GB.mixed ? GB.ratio : sbm.ratio, dWy = need * rB;
                    for (var cm = 0; cm < GB.members.length; cm++) shiftLayer(GB.members[cm], 0, dWy);
                    GB.box.y += dWy; GB.minY += dWy; GB.maxY += dWy;
                    log.push(comp.name + " box " + (GD.box + 1) + " moved " + Math.round(need) + "px down");
                }
                continue;
            }
            need = Math.min(need, tbs.minY - 80); // keep the title inside the safe margin
            if (Math.abs(need) > 0.5) { for (var tl = 0; tl < Tl.length; tl++) shiftLayer(Tl[tl], 0, -need * tbs.ratio); log.push(comp.name + " title moved " + Math.round(-need) + "px"); }
        }
        // arrows/icons that sit between two texts: centre them vertically in the gap (after content moves)
        if (spec.between) for (var bw = 0; bw < spec.between.length; bw++) {
            var BWd = spec.between[bw], tB = BWd.t;
            var AL2 = layerById(comp, BWd._a), up = screenBounds(comp, [layerById(comp, BWd._u)], tB), dn = screenBounds(comp, [layerById(comp, BWd._d)], tB);
            var ab = screenBounds(comp, [AL2], tB), midS = (up.maxY + dn.minY) / 2, cS = (ab.minY + ab.maxY) / 2;
            shiftLayer(AL2, 0, (midS - cS) * ab.ratio);
        }
        var boxLs = [];
        for (var u5 = 0; u5 < geos.length; u5++) boxLs.push(createBox(comp, geos[u5], geos.length > 1 ? String(u5 + 1) : ""));
        // grow: a box expands (top fixed) between t0 and t1 to also hold layers that arrive later
        if (spec.grow) for (var gw = 0; gw < spec.grow.length; gw++) {
            var GW = spec.grow[gw], G0 = geos[GW.box], ob = G0.box, rG = G0.ratio, gm = measureBox(comp, members(ids(GW.to)), false);
            var gx = GW.toX ? measureBox(comp, members(ids(GW.toX)), false) : gm;
            var nx0 = GW.keepWidth ? ob.x : Math.min(ob.x, gx.minX - padX * rG), nx1 = GW.keepWidth ? ob.x + ob.w : Math.max(ob.x + ob.w, gx.maxX + padX * rG), ny1 = Math.max(ob.y + ob.h, gm.maxY + padY * rG);
            var nb = { x: nx0, y: ob.y, w: nx1 - nx0, h: ny1 - ob.y }, BL = boxLs[GW.box];
            var rsz = BL.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").property("ADBE Vector Shape - Rect").property("ADBE Vector Rect Size");
            var bps = BL.property("ADBE Transform Group").property("ADBE Position");
            rsz.setValueAtTime(GW.t0, [ob.w, ob.h]); rsz.setValueAtTime(GW.t1, [nb.w, nb.h]);
            var oc = [ob.x + ob.w / 2, ob.y + ob.h / 2], nc = [nb.x + nb.w / 2, nb.y + nb.h / 2];
            bps.setValueAtTime(GW.t0, G0.is3D ? [oc[0], oc[1], G0.z] : oc); bps.setValueAtTime(GW.t1, G0.is3D ? [nc[0], nc[1], G0.z] : nc);
            var eIn = [new KeyframeEase(0, 100)], eOut = [new KeyframeEase(0, 16.67)], e33 = [new KeyframeEase(0, 33.33)];
            rsz.setTemporalEaseAtKey(1, [new KeyframeEase(0, 33.33), new KeyframeEase(0, 33.33)], [new KeyframeEase(0, 33.33), new KeyframeEase(0, 33.33)]);
            rsz.setTemporalEaseAtKey(2, [new KeyframeEase(0, 100), new KeyframeEase(0, 100)], [new KeyframeEase(0, 16.67), new KeyframeEase(0, 16.67)]);
            try { bps.setTemporalEaseAtKey(1, e33, e33); bps.setTemporalEaseAtKey(2, eIn, eOut); } catch (e) {}
            BL.outPoint = Math.max(BL.outPoint, gm.outP);
            log.push(comp.name + " box " + (GW.box + 1) + " grows to " + Math.round(nb.w) + "x" + Math.round(nb.h) + " @" + GW.t0 + "-" + GW.t1);
        }
    }
    return JSON.stringify({ status: "success", log: log });
})();
