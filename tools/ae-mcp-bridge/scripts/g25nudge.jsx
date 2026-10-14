(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G25") c=it;}
 for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); if (L instanceof TextLayer && /confiar no meu/.test(L.property("ADBE Text Properties").property("ADBE Text Document").value.text)) {
   var p=L.property("ADBE Transform Group").property("ADBE Position"); for (var k=1;k<=p.numKeys;k++){ var v=p.keyValue(k); v[0]-=13; p.setValueAtKey(k,v);} if(!p.numKeys){var w=p.value; w[0]-=13; p.setValue(w);} } }
 return JSON.stringify({status:"success"}); })();
