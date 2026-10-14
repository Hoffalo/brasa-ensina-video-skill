// Saves preview PNGs of target comps at given times. Set FRAMES_TAG via the "tag" var below before running.
(function () {
    var TAG = $.global.MCP_FRAME_TAG || "before";
    var SHOTS = {
        "G1 Copy 4": [6.4], "G1 Copy 5": [6], "G1 Copy 6": [6.4], "G5 Copy 2": [8], "G5 Copy 3": [5],
        "G5 Copy 4": [4, 13], "G5 Copy 5": [6], "G12": [4.5], "G17": [4.5, 11, 20.5], "G18": [6.5],
        "G20": [6.5], "g16 copy 2": [7, 11], "g16 copy 3": [1.5, 6, 10, 13]
    };
    var dir = new Folder(Folder.myDocuments.fsName + "/ae-mcp-bridge/frames");
    if (!dir.exists) dir.create();
    var saved = [];
    for (var i = 1; i <= app.project.numItems; i++) {
        var it = app.project.item(i);
        if (!(it instanceof CompItem) || !SHOTS[it.name]) continue;
        if ($.global.MCP_FRAME_ONLY && $.global.MCP_FRAME_ONLY.join("|").indexOf(it.name) < 0) continue;
        var ts = SHOTS[it.name];
        for (var k = 0; k < ts.length; k++) {
            var f = new File(dir.fsName + "/" + TAG + "_" + it.name.replace(/ /g, "_") + "_" + ts[k] + ".png");
            it.saveFrameToPng(ts[k], f);
            saved.push(f.name);
        }
    }
    return JSON.stringify({ status: "success", saved: saved });
})();
