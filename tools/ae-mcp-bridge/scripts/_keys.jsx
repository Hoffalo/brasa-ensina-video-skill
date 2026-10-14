(function(){var out=[];var names="|"+$.global.MCP_K.join("|")+"|";
function walk(c,L,g){for(var q=1;q<=g.numProperties;q++){var p=g.property(q);if(p.propertyType===PropertyType.PROPERTY){if(p.numKeys>0){var ks=[];for(var k=1;k<=p.numKeys;k++){ks.push(Math.round(p.keyTime(k)*100)/100+":"+String(p.keyValue(k)).replace(/(\.\d)\d+/g,"$1"));}out.push(c.name+" "+L.name+" "+p.name+" "+ks.join(" | "));}}else walk(c,L,p);}}
for(var i=1;i<=app.project.numItems;i++){var c=app.project.item(i);if(!(c instanceof CompItem)||names.indexOf("|"+c.name+"|")<0)continue;
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!(L.nullLayer||L instanceof CameraLayer))continue;walk(c,L,L);}}
return JSON.stringify({status:"success",k:out});})();
