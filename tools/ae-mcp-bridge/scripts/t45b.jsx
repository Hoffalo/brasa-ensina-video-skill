(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G45 - Abertura (Claude)") c=it;}
 var dir=Folder.myDocuments.fsName+"/ae-mcp-bridge/frames/", L=null, B=null;
 for (var j=1;j<=c.numLayers;j++){ if(c.layer(j).name==="CUSTOS ESCONDIDOS") L=c.layer(j); if(c.layer(j).name==="Box CUSTOS ESCONDIDOS") B=c.layer(j); }
 var info="label idx="+L.index+" box idx="+B.index+" labelBlend="+L.blendingMode+" boxBlend="+B.blendingMode+" trackMatte="+L.trackMatteType+" isMatte="+L.isTrackMatte+" boxMatte="+B.trackMatteType+" boxIsMatte="+B.isTrackMatte+" labelEnabled="+L.enabled+" shy="+L.shy+" solo="+L.solo;
 L.property("ADBE Transform Group").property("ADBE Position").setValue([0,0,-40]);
 c.saveFrameToPng(12.6,new File(dir+"t45_z40.png"));
 L.property("ADBE Transform Group").property("ADBE Position").setValue([0,0,-6]);
 return JSON.stringify({status:"success",info:info}); })();
