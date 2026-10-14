(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G11") c=it;} var a=[];
 var p=c.layer("Null 1").property("ADBE Transform Group").property("ADBE Position"); for (var k=1;k<=p.numKeys;k++){ var v=p.keyValue(k); a.push(Math.round(p.keyTime(k)*100)/100+"@"+[Math.round(v[0]),Math.round(v[1]),Math.round(v[2])].join(",")); }
 for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j), q=L.property("ADBE Transform Group").property("ADBE Position"), w=q.numKeys?q.keyValue(q.numKeys):q.value; a.push(j+" "+L.name.substr(0,16)+" "+[Math.round(w[0]),Math.round(w[1]),Math.round(w[2]||0)].join(",")); }
 return JSON.stringify({status:"success",a:a}); })();
