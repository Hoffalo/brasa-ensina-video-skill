(function(){var c=null;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G2")c=it;}
var cam=null;for(var j=1;j<=c.numLayers;j++)if(c.layer(j) instanceof CameraLayer)cam=c.layer(j);
var T=cam.property("ADBE Transform Group");var o={pos:T.property("ADBE Position").value.toString(),autoOrient:cam.autoOrient,zoom:cam.property("ADBE Camera Options Group").property("ADBE Camera Zoom").value};
try{o.poi=T.property("ADBE Anchor Point").value.toString();}catch(e){}
try{o.orient=T.property("ADBE Orientation").value.toString();o.rx=T.property("ADBE Rotate X").value;}catch(e){}
return JSON.stringify({status:"success",o:o});})();
