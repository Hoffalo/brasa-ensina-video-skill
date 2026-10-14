(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G7") c=it;}
 var ref=c.layer(8).property("ADBE Transform Group").property("ADBE Position"), refY=ref.keyValue(ref.numKeys)[1], log=[];
 for (var j=5;j<=7;j++){ var p=c.layer(j).property("ADBE Transform Group").property("ADBE Position"), d=refY-p.keyValue(p.numKeys)[1];
   for (var k=1;k<=p.numKeys;k++){ var v=p.keyValue(k); v[1]+=d; p.setValueAtKey(k,v); } log.push("layer "+j+" dy "+Math.round(d)); }
 return JSON.stringify({status:"success",log:log}); })();
