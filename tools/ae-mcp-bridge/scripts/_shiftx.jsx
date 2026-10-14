(function(){var cfg=$.global.X,c=null,o=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
for(var a=0;a<cfg.items.length;a++){var L=c.layer(cfg.items[a][0]),T=L.property("ADBE Transform Group"),P=T.property("ADBE Position"),dx=cfg.items[a][1];
var p=P.dimensionsSeparated?T.property("ADBE Position_0"):P;
if(p.numKeys){for(var k=1;k<=p.numKeys;k++){var v=p.keyValue(k);if(v instanceof Array){v[0]+=dx;}else v+=dx;p.setValueAtKey(k,v);}}else{var v2=p.value;if(v2 instanceof Array)v2[0]+=dx;else v2+=dx;p.setValue(v2);}
o.push(L.name+" sep="+P.dimensionsSeparated+" keys="+p.numKeys);}
app.project.save();return JSON.stringify({status:"success",o:o});})();
