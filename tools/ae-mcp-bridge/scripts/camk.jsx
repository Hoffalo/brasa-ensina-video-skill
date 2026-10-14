(function(){ var o={}; var want={"G2":1,"G16":1,"G11":1,"G13":1};
 for (var i=1;i<=app.project.numItems;i++){var c=app.project.item(i); if(!(c instanceof CompItem)||!want[c.name]) continue; var a=[];
  for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j), p=L.property("ADBE Transform Group").property("ADBE Position"), op=L.property("ADBE Transform Group").property("ADBE Opacity");
    var s=j+" "+L.name.substr(0,18)+(L.threeDLayer?" 3D":" 2D");
    if (p.numKeys){ s+=" posK:"; for (var k=1;k<=p.numKeys;k++){ var v=p.keyValue(k); s+=" "+Math.round(p.keyTime(k)*100)/100+"@"+[Math.round(v[0]),Math.round(v[1]),Math.round(v[2]||0)].join(","); } }
    else { var v2=p.value; s+=" pos="+[Math.round(v2[0]),Math.round(v2[1]),Math.round(v2[2]||0)].join(","); }
    if (op.numKeys){ s+=" opK:"; for (var k2=1;k2<=op.numKeys;k2++) s+=" "+Math.round(op.keyTime(k2)*100)/100+"="+Math.round(op.keyValue(k2)); }
    a.push(s); }
  o[c.name]=a; }
 return JSON.stringify(o); })();
