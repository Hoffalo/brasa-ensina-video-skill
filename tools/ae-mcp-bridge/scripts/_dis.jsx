(function(){var cfg=$.global.DIS,c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);for(var n=0;n<cfg.names.length;n++)if(L.name===cfg.names[n]){L.enabled=false;out.push(L.name);}}return JSON.stringify({status:"success",o:out});})();
