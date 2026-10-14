(function(){var c=null;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===$.global.X.comp)c=it;}var o=[];
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);o.push(j+" "+L.name);if(!L.nullLayer)continue;var p=L.property("ADBE Transform Group").property("ADBE Position");for(var k=1;k<=p.numKeys;k++)o.push(p.keyTime(k)+": "+p.keyValue(k).toString());if(!p.numKeys)o.push("static "+p.value.toString());}
return JSON.stringify({status:"success",o:o});})();
