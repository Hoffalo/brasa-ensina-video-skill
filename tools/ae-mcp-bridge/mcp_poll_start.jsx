// Run once per After Effects session: File > Scripts > Run Script File... > this file.
// Starts the MCP bridge poller on AE's main timer (every 1.5 s). Safe to run twice (the old task is cancelled).
(function () {
    var poll = Folder.myDocuments.fsName.replace(/\\/g, "/") + "/ae-mcp-bridge/mcp_poll.jsx";
    try { if ($.global.__mcpPollTask) app.cancelTask($.global.__mcpPollTask); } catch (e) {}
    $.global.__mcpPollBusy = false;
    $.global.__mcpPollTask = app.scheduleTask('$.evalFile(new File("' + poll + '"))', 1500, true);
    alert("MCP bridge poller running (task " + $.global.__mcpPollTask + ").\nClaude can now run scripts in this AE session.");
})();
