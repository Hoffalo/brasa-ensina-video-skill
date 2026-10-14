(function(){ var H={"G21":415.7,"G22":415.7,"G27":415.7,"G29":415.7,"G30":415.7,"G31":506.7}, o=[];
 for (var i=1;i<=app.project.numItems;i++){ var c=app.project.item(i); if(!(c instanceof CompItem) || H[c.name]===undefined) continue;
  for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); if(!(L instanceof ShapeLayer)) continue;
   (function w(g){ for (var k=1;k<=g.numProperties;k++){ var p=g.property(k); if (p.matchName==="ADBE Vector Shape - Rect"){ var s=p.property("ADBE Vector Rect Size"), v=s.value; s.setValue([v[0],H[c.name]]); o.push(c.name+" "+Math.round(v[0])+"x"+H[c.name]); } if (p.propertyType!==PropertyType.PROPERTY && p.numProperties) w(p); } })(L.property("ADBE Root Vectors Group")); } }
 return JSON.stringify({status:"success",o:o}); })();
