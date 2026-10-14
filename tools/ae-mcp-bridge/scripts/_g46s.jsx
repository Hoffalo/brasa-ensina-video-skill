(function(){var c;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name.indexOf("G46")===0)c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L.name.indexOf("€11")!==0)continue;var p=L.property("ADBE Transform Group").property("ADBE Position");for(var k=1;k<=p.numKeys;k++){var v=p.keyValue(k);v[0]+=40;p.setValueAtKey(k,v);}}
return JSON.stringify({status:"success"});})();
