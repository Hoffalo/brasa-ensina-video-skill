(function(){ var want={"G29":1,"G36":1,"G34":1,"G27":1,"G26":1}, o={};
 for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(!(it instanceof CompItem)||!want[it.name]) continue; var a=[];
  for (var j=1;j<=it.numLayers;j++){ var L=it.layer(j); var p=L.property("ADBE Transform Group").property("ADBE Position"); var v=p.numKeys?p.keyValue(p.numKeys):p.value;
   a.push(j+" "+L.name.substr(0,22)+" pos="+[Math.round(v[0]),Math.round(v[1]),Math.round(v[2]||0)].join(",")+" sc="+Math.round(L.property("ADBE Transform Group").property("ADBE Scale").value[0])+(L.enabled?"":" OFF")); }
  o[it.name]=a; }
 return JSON.stringify(o); })();
