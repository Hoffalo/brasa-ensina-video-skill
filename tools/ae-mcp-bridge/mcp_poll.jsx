// Standalone poller for the MCP bridge (called by the panel's timer via $.evalFile, so it does not depend on the
// panel's functions being visible in the timer's script engine). Handles "runScriptFile" commands.
(function () {
    if ($.global.__mcpPollBusy) return;
    var dir = Folder.myDocuments.fsName + "/ae-mcp-bridge", cf = new File(dir + "/ae_command.json"), rf = new File(dir + "/ae_mcp_result.json");
    function rd(f) { if (!f.exists) return ""; f.encoding = "UTF-8"; f.open("r"); var s = f.read(); f.close(); return s; }
    function wr(f, s) { f.encoding = "UTF-8"; f.open("w"); f.write(s); f.close(); }
    var s = rd(cf); if (!s) return;
    var d; try { d = JSON.parse(s); } catch (e) { return; }
    if (d.status !== "pending" || d.command !== "runScriptFile") return;
    $.global.__mcpPollBusy = true;
    d.status = "running"; wr(cf, JSON.stringify(d));
    var res;
    try {
        var f = new File(d.args.path);
        if (!f.exists) throw new Error("Script file not found: " + d.args.path);
        app.beginUndoGroup(d.args.undoName || "MCP script");
        try { res = $.evalFile(f); } finally { app.endUndoGroup(); }
        if (typeof res !== "string") res = JSON.stringify({ status: "success", result: String(res) });
        d.status = "completed";
    } catch (e) {
        res = JSON.stringify({ status: "error", message: e.toString(), line: e.line });
        d.status = "error";
    }
    wr(rf, res); wr(cf, JSON.stringify(d));
    $.global.__mcpPollBusy = false;
})();
