(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G4") c=it;}
 var r=""; for (var j=1;j<=c.numLayers;j++) if (c.layer(j) instanceof CameraLayer){ var z=c.layer(j).property("ADBE Camera Options Group").property("ADBE Camera Zoom"); r=z.value+" -> "; z.setValue(z.value/0.504); r+=z.value; }
 return JSON.stringify({status:"success",zoom:r}); })();
