(function(){var cfg=$.global.NP,c,n=0;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);var ok=false;for(var q=0;q<cfg.pfx.length;q++)if(L.name.indexOf(cfg.pfx[q])===0)ok=true;if(!ok)continue;var p=L.property("ADBE Transform Group").property("ADBE Position");
if(p.numKeys){for(var k=1;k<=p.numKeys;k++){var v=p.keyValue(k);v[1]+=cfg.dy;p.setValueAtKey(k,v);}}else{var v2=p.value;v2[1]+=cfg.dy;p.setValue(v2);}n++;}
return JSON.stringify({status:"success",n:n});})();
