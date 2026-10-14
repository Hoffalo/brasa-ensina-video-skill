(function(){ var want={"G26":0.414,"G27":0.301,"G36":0.132,"g5 copy 2":0.207}, o=[];
 for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(!(it instanceof CompItem)||!want[it.name]) continue;
  for (var j=1;j<=it.numLayers;j++){ var L=it.layer(j); if(!(L instanceof CameraLayer)) continue; var z=L.property("ADBE Camera Options Group").property("ADBE Camera Zoom");
   o.push(it.name+" keys="+z.numKeys+" zoom="+z.value); } }
 return JSON.stringify({status:"success",o:o}); })();
