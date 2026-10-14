(function(){var X=$.global.X,c=null;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===X.comp)c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L.name!==X.layer)continue;var fx=L.property("ADBE Effect Parade");for(var e=1;e<=fx.numProperties;e++)fx.property(e).enabled=X.on;}
return JSON.stringify({status:"success"});})();
