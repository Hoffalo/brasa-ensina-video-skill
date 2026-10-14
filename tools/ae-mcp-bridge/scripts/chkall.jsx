(function(){ function C(n){for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name===n) return it;}}
 var o={};
 var g21=C("G21"), b=0; for(var j=1;j<=g21.numLayers;j++) if(g21.layer(j).name==="Box") b++; o.g21box=b;
 var g22=C("G22"), s=[]; for(var j2=1;j2<=g22.numLayers;j2++){var L=g22.layer(j2); s.push(L.name.substr(0,18)+(L instanceof TextLayer?"(box="+L.property("ADBE Text Properties").property("ADBE Text Document").value.boxText+")":""));} o.g22=s;
 for(var j3=1;j3<=g22.numLayers;j3++) if(g22.layer(j3) instanceof CameraLayer) o.g22zoomKeys=g22.layer(j3).property("ADBE Camera Options Group").property("ADBE Camera Zoom").numKeys;
 var g25=C("G25"), n=g25.layer("Null 1").property("ADBE Transform Group").property("ADBE Position"); o.g25null=n.numKeys+" keys, last="+String(n.keyValue(n.numKeys));
 o.dirty=app.project.dirty;
 return JSON.stringify({status:"success",o:o}); })();
