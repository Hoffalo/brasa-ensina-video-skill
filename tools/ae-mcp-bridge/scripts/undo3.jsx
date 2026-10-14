(function(){ var n=$.global.MCP_UNDO||1; for (var i=0;i<n;i++) app.executeCommand(16); return JSON.stringify({status:"success",undone:n}); })();
