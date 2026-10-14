(function(){var c=null;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G35")c=it;}
var tb=null;for(var j=1;j<=c.numLayers;j++)if(c.layer(j).name==="Shape Layer 1")tb=c.layer(j);
var g=tb.property("ADBE Root Vectors Group").property("Rectangle 3"),tr=g.property("ADBE Vector Transform Group");
var sc=[98.3,96.36];tr.property("ADBE Vector Scale").setValue([100,100]);
var r=g.property("ADBE Vectors Group").property("ADBE Vector Shape - Rect"),gp=tr.property("ADBE Vector Position").value,rp=r.property("ADBE Vector Rect Position").value;
r.property("ADBE Vector Rect Size").setValue([(836-122)/0.9324,0.1]);
var cx=((122+836)/2-960)/0.9324;   // table layer: position 960, scale 93.24, anchor 0
r.property("ADBE Vector Rect Position").setValue([cx-gp[0],rp[1]*sc[1]/100]);
app.project.save();return JSON.stringify({status:"success",o:["oldScale "+sc,"grpPos "+gp,"rectPos "+rp]});})();
