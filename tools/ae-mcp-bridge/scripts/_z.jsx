(function(){var c;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G37")c=it;}
for(var j=1;j<=c.numLayers;j++)if(c.layer(j) instanceof CameraLayer){var z=c.layer(j).property("ADBE Camera Options Group").property("ADBE Camera Zoom");for(var k=1;k<=z.numKeys;k++)z.setValueAtKey(k,2666.66666666667);}
return JSON.stringify({status:"success"});})();
