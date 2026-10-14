(function(){ var n=["G0","G30","G32","G33","G34","G35","G36"], s=[], tag=$.global.MCP_TAG||"dl";
 for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && ("|"+n.join("|")+"|").indexOf("|"+it.name+"|")>=0){ var f=new File(Folder.myDocuments.fsName+"/ae-mcp-bridge/frames/"+tag+"_"+it.name+".png"); it.saveFrameToPng(3,f); s.push(f.name);} }
 return JSON.stringify({status:"success",saved:s}); })();
