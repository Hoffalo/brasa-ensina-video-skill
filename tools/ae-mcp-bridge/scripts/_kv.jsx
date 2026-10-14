(function(){var cfg=$.global.KV,c=null,o=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L.name!==cfg.layer)continue;var p=L.property("ADBE Transform Group").property(cfg.prop);for(var k=1;k<=p.numKeys;k++)o.push([p.keyTime(k),p.keyValue(k)]);if(!p.numKeys)o.push(p.value);}
return JSON.stringify({status:"success",o:o});})();
