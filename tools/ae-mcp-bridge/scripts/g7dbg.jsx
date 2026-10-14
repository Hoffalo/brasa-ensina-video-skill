(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G7") c=it;} var a=[];
 var p=c.layer("Null 1").property("ADBE Transform Group").property("ADBE Position"); for (var k=1;k<=p.numKeys;k++){ var v=p.keyValue(k); a.push("null "+Math.round(p.keyTime(k)*100)/100+"@"+[Math.round(v[0]),Math.round(v[1]),Math.round(v[2])].join(",")); }
 for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j), tg=L.property("ADBE Transform Group"), q=tg.property("ADBE Position"), w=q.numKeys?q.keyValue(q.numKeys):q.value, s=j+" "+L.name.substr(0,14)+" pos="+[Math.round(w[0]),Math.round(w[1]),Math.round(w[2]||0)].join(",")+" anc="+String(tg.property("ADBE Anchor Point").value).substr(0,30);
  if (L instanceof TextLayer){ var d=L.property("ADBE Text Properties").property("ADBE Text Document").value; s+=" box="+(d.boxText?String(d.boxTextSize):"no")+" just="+d.justification+" txt="+JSON.stringify(d.text.substr(0,45)); }
  if (L instanceof CameraLayer) s+=" zoom="+L.property("ADBE Camera Options Group").property("ADBE Camera Zoom").value;
  a.push(s);}
 return JSON.stringify({status:"success",a:a}); })();
