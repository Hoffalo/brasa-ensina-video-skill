// $.global.NUDGE = {comp, name, dx} : shift all position keys (or value) of a layer by dx
(function(){var cfg=$.global.NUDGE,c;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
var out=[];for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L.name!==cfg.name)continue;var p=L.property("ADBE Transform Group").property("ADBE Position");
if(p.numKeys){for(var k=1;k<=p.numKeys;k++){var v=p.keyValue(k);v[0]+=cfg.dx;v[1]+=(cfg.dy||0);p.setValueAtKey(k,v);}}else{var v2=p.value;v2[0]+=cfg.dx;v2[1]+=(cfg.dy||0);p.setValue(v2);}out.push(L.name);}
return JSON.stringify({status:"success",o:out});})();
