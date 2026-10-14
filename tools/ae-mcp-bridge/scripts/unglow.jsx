(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name===$.global.MCP_UNGLOW) c=it;} var n=0;
 for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); if(!(L instanceof TextLayer) || !L.parent) continue; var fx=L.property("ADBE Effect Parade");
   for (var k=fx.numProperties;k>=1;k--) if (fx.property(k).matchName==="ADBE Glo2"){ fx.property(k).remove(); n++; } }
 return JSON.stringify({status:"success",removed:n}); })();
