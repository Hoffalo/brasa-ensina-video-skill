(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G22") c=it;} var o=[];
 for(var j=1;j<=c.numLayers;j++){var L=c.layer(j); if(L.name==="Para uma") o.push("fadeKeys="+L.property("ADBE Transform Group").property("ADBE Opacity").numKeys); if(L.name==="Box") o.push("box ok");}
 return JSON.stringify({status:"success",g22:o}); })();
