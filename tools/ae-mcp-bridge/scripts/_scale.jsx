(function(){var cfg=$.global.SC,c;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L.name!==cfg.name)continue;var s=L.property("ADBE Transform Group").property("ADBE Scale");if(s.numKeys){for(var k=1;k<=s.numKeys;k++){var v=s.keyValue(k);s.setValueAtKey(k,[v[0]*cfg.f,v[1]*cfg.f,v[2]*cfg.f]);}}else{var v2=s.value;s.setValue([v2[0]*cfg.f,v2[1]*cfg.f,v2[2]*cfg.f]);}}
return JSON.stringify({status:"success"});})();
