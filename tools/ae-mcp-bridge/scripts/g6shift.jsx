(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G6") c=it;}
 var D=250, moved=[];
 for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); if (!/^(Exce|Medicina|MBA|1\. |Box 2)/.test(L.name)) continue;
   var tg=L.property("ADBE Transform Group"), p=tg.property("ADBE Position");
   if (p.dimensionsSeparated){ p=tg.property("ADBE Position_1"); if (p.numKeys){ for (var k=1;k<=p.numKeys;k++) p.setValueAtKey(k,p.keyValue(k)+D);} else p.setValue(p.value+D); }
   else if (p.numKeys){ for (var k2=1;k2<=p.numKeys;k2++){ var v=p.keyValue(k2); v[1]+=D; p.setValueAtKey(k2,v);} } else { var w=p.value; w[1]+=D; p.setValue(w); }
   moved.push(L.name.substr(0,8)); }
 var n=c.layer("Null 1").property("ADBE Transform Group").property("ADBE Position"); var v6=n.keyValue(6); v6[1]+=D; n.setValueAtKey(6,v6);
 return JSON.stringify({status:"success",moved:moved}); })();
