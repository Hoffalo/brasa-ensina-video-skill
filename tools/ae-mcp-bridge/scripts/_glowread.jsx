(function(){var c=null;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===$.global.X.comp)c=it;}var o={};
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L.name!==$.global.X.layer)continue;var fx=L.property("ADBE Effect Parade");for(var f=1;f<=fx.numProperties;f++){var g=fx.property(f);if(g.matchName!=="ADBE Glo2")continue;for(var q=1;q<=g.numProperties;q++){var p=g.property(q);try{o[q+" "+p.name+" ("+p.matchName+")"]=p.value.toString();}catch(e){}}}}
return JSON.stringify({status:"success",o:o});})();
