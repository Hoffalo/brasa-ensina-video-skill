(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G25") c=it;}
 var f=new File(Folder.myDocuments.fsName+"/ae-mcp-bridge/frames/n_G25_8.png"); var r=c.saveFrameToPng(8,f); return JSON.stringify({status:"success",r:String(r),exists:f.exists}); })();
