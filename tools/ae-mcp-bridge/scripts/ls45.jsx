(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G45 - Abertura (Claude)") c=it;} var o=[];
 for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); o.push(j+" "+L.name+(L.parent?" <- "+L.parent.name:"")+(L.nullLayer?" NULL":"")+(L.enabled?"":" OFF")); } return JSON.stringify({status:"success",o:o}); })();
