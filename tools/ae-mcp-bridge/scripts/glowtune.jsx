// $.global.GT = {remove:[comps], tune:[comps], radius, intensity}
(function(){var cfg=$.global.GT,o=[];function comp(n){for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===n)return it;}return null;}
function each(list,fn){for(var a=0;a<list.length;a++){var c=comp(list[a]);if(!c)continue;var n=0;for(var j=1;j<=c.numLayers;j++){var fx=c.layer(j).property("ADBE Effect Parade");if(!fx)continue;for(var f=fx.numProperties;f>=1;f--){if(fx.property(f).matchName==="ADBE Glo2"){fn(fx.property(f));n++;}}}o.push(c.name+" "+n);}}
each(cfg.remove||[],function(g){g.remove();});
each(cfg.tune||[],function(g){g.property(3).setValue(cfg.radius);g.property(4).setValue(cfg.intensity);});
app.project.save();return JSON.stringify({status:"success",o:o});})();
