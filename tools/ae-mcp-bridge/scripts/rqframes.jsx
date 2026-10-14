// Render single PNG stills through the Render Queue (fallback when saveFrameToPng stops writing).
// $.global.MCP_RQ = { comp: "G25", times: [..], tag: "m" }. Other queued items are disabled during the render and restored.
(function () {
    var cfg = $.global.MCP_RQ, c = null;
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === cfg.comp) c = it; }
    var rq = app.project.renderQueue, prev = [];
    for (var q = 1; q <= rq.numItems; q++) { var R = rq.item(q); prev.push(R.render); try { if (R.status === RQItemStatus.QUEUED) R.render = false; } catch (e) {} }
    var mine = [], dir = Folder.myDocuments.fsName + "/ae-mcp-bridge/frames/";
    var err = "";
    try {
        for (var t = 0; t < cfg.times.length; t++) {
            var item = rq.items.add(c);
            mine.push(item);
            item.timeSpanStart = cfg.times[t]; item.timeSpanDuration = c.frameDuration;
            var om = item.outputModule(1);
            om.applyTemplate("Photoshop");
            om.file = new File(dir + cfg.tag + "_" + cfg.comp.replace(/ /g, "_") + "_" + cfg.times[t] + "_[#####].psd");
        }
        rq.render();
    } catch (e) { err = String(e); }
    for (var m = mine.length - 1; m >= 0; m--) { try { mine[m].remove(); } catch (e) {} }
    for (var q2 = 1; q2 <= rq.numItems && q2 <= prev.length; q2++) { try { rq.item(q2).render = prev[q2 - 1]; } catch (e) {} }
    return JSON.stringify({ status: err ? "error" : "success", message: err, n: mine.length });
})();
