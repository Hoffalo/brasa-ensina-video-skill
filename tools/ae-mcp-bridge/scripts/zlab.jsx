(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name===$.global.MCP_C) c=it;} var n=0;
 for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); if(!L.parent||!L.threeDLayer||L instanceof CameraLayer) continue; var p=L.property("ADBE Transform Group").property("ADBE Position"); if(p.dimensionsSeparated||p.numKeys) continue; var v=p.value; if(v.length>2&&v[2]<0&&v[2]>-20){ v[2]=-20; p.setValue(v); n++; } }
 return JSON.stringify({status:"success",n:n}); })();
