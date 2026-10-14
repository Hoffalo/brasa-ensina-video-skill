(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G45 - Abertura (Claude)") c=it;}
 var bg=null, title=null; for (var j=1;j<=c.numLayers;j++){ if(/^Deep Royal/.test(c.layer(j).name)) bg=c.layer(j); }
 var dir=Folder.myDocuments.fsName+"/ae-mcp-bridge/frames/";
 bg.enabled=false; c.saveFrameToPng(12.6,new File(dir+"t45_nobg.png"));
 return JSON.stringify({status:"success"}); })();
