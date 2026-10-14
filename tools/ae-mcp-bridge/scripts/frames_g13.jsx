(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G1 Copy 3") c=it;}
 var f=new File(Folder.myDocuments.fsName+"/ae-mcp-bridge/frames/rev2_G1_Copy_3_6.png"); c.saveFrameToPng(6,f); return JSON.stringify({status:"success"}); })();
