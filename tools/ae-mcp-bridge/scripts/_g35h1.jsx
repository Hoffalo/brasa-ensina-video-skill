(function(){var c=null;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G35")c=it;}
var tb=null;for(var j=1;j<=c.numLayers;j++)if(c.layer(j).name==="Shape Layer 1")tb=c.layer(j);
var r=tb.property("ADBE Root Vectors Group").property("Rectangle 3").property("ADBE Vectors Group").property("ADBE Vector Shape - Rect");
r.property("ADBE Vector Rect Size").setValue([(836-122)/0.9324,0.1]);return JSON.stringify({status:"success"});})();
