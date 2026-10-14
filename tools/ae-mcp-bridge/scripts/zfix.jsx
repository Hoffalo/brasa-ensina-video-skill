(function(){ var want={"G26":1,"G27":1,"G36":1,"g5 copy 2":1}, o=[];
 for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(!(it instanceof CompItem)||!want[it.name]) continue;
  for (var j=1;j<=it.numLayers;j++){ var L=it.layer(j); if(!(L instanceof CameraLayer)) continue; L.property("ADBE Camera Options Group").property("ADBE Camera Zoom").setValue(2666.66666666667); o.push(it.name); } }
 return JSON.stringify({status:"success",restored:o}); })();
