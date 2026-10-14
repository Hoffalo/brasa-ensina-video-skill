(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G51b - Planilha (Claude)")c=it;}
var ls=[];for(var j=1;j<=c.numLayers;j++){var n=c.layer(j).name;if(n==="Celula = TOTAL"||n==="Valor = TOTAL")ls.push(c.layer(j));}
for(var k=0;k<ls.length;k++){ls[k].moveToBeginning();out.push("top "+ls[k].name);}
for(var j2=1;j2<=c.numLayers;j2++){var L=c.layer(j2);
 if(L.nullLayer){var p=L.property("ADBE Transform Group").property("ADBE Position");for(var q=1;q<=p.numKeys;q++){if(p.keyTime(q)>0.5){var v=p.keyValue(q);v[1]-=60;p.setValueAtKey(q,v);}}out.push("null shifted");}
 if(L instanceof CameraLayer){var z=L.property("ADBE Camera Options Group").property("ADBE Camera Zoom");for(var q2=1;q2<=z.numKeys;q2++){if(z.keyTime(q2)>0.5)z.setValueAtKey(q2,z.keyValue(q2)*0.93);}out.push("zoom x0.93");}}
return JSON.stringify({status:"success",o:out});})();
