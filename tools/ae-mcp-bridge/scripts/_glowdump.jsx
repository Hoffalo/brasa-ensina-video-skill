(function(){var cfg=$.global.X,o=[],c=null;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(cfg.layers.join("|").indexOf(L.name)<0)continue;var fx=L.property("ADBE Effect Parade");if(!fx)continue;
for(var e=1;e<=fx.numProperties;e++){var f=fx.property(e);var p=[];for(var q=1;q<=f.numProperties;q++){try{var v=f.property(q).value;p.push(q+":"+f.property(q).name+"="+(v instanceof Array?v.join(","):v));}catch(x){}}o.push(L.name+" | "+f.matchName+" | "+p.join("; "));}}
return JSON.stringify({status:"success",o:o});})();
