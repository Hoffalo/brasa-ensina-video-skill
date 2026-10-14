(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===$.global.RC)c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);out.push(j+" "+L.name.substr(0,16)+" 3d="+L.threeDLayer+" par="+(L.parent?L.parent.name:"-")+" en="+L.enabled);}
return JSON.stringify({status:"success",o:out});})();
