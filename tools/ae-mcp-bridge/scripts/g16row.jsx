(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G16") c=it;}
 var D=180, moved=[];
 for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); if (/^(3\.|4\.|As frases|O fechamento|Box 3|Box 4)/.test(L.name)) { var p=L.property("ADBE Transform Group").property("ADBE Position"), v=p.value; v[1]+=D; p.setValue(v); moved.push(L.name.substr(0,12)); } }
 var n=c.layer("Null 1").property("ADBE Transform Group").property("ADBE Position"), k=0;
 for (var q=1;q<=n.numKeys;q++){ var t=n.keyTime(q); if (t>14 && t<26){ var w=n.keyValue(q); w[1]+=D; n.setValueAtKey(q,w); k++; } }
 return JSON.stringify({status:"success",moved:moved,keys:k}); })();
