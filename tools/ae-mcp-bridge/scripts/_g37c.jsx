(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G37")c=it;}
function L(n){for(var j=1;j<=c.numLayers;j++)if(c.layer(j).name===n)return c.layer(j);}
var ls=["Hoje","Shape Layer 4"];for(var a=0;a<ls.length;a++){var p=L(ls[a]).property("ADBE Transform Group").property("ADBE Position");var v=p.keyValue(1);v[0]+=450;p.setValueAtKey(1,v);out.push(ls[a]+" k1 x="+Math.round(v[0]));}
for(var j=1;j<=c.numLayers;j++)if(c.layer(j) instanceof CameraLayer){var z=c.layer(j).property("ADBE Camera Options Group").property("ADBE Camera Zoom");for(var k=1;k<=z.numKeys;k++)if(z.keyTime(k)>25.5)z.setValueAtKey(k,z.keyValue(k)*1.4);}
return JSON.stringify({status:"success",o:out});})();
