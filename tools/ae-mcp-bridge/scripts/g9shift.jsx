(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G9") c=it;}
 var D=400, moved=[];
 for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); if (/^(OFERECENDO|- Mestrado|- Financiamento|\*Em univ|Box 2)/.test(L.name)) { var p=L.property("ADBE Transform Group").property("ADBE Position");
   if (p.numKeys){ for (var k=1;k<=p.numKeys;k++){ var v=p.keyValue(k); v[0]+=D; p.setValueAtKey(k,v);} } else { var w=p.value; w[0]+=D; p.setValue(w); } moved.push(L.name.substr(0,10)); } }
 var n=c.layer("Null 1").property("ADBE Transform Group").property("ADBE Position"); var v2=n.keyValue(4); v2[0]+=D; n.setValueAtKey(4,v2);
 return JSON.stringify({status:"success",moved:moved}); })();
