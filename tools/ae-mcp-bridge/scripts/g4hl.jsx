(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G4") c=it;}
 var L=null; for (var j=1;j<=c.numLayers;j++) if (c.layer(j).name==="red highlight") L=c.layer(j);
 var k=1/0.504, cx=c.width/2, cy=c.height/2, tg=L.property("ADBE Transform Group"), p=tg.property("ADBE Position"), s=tg.property("ADBE Scale");
 function sp(v){ return [cx+(v[0]-cx)*k, cy+(v[1]-cy)*k].concat(v.length>2?[v[2]]:[]); } function ss(v){ return [v[0]*k, v[1]*k].concat(v.length>2?[v[2]]:[]); }
 if (p.numKeys){ for (var a=1;a<=p.numKeys;a++) p.setValueAtKey(a, sp(p.keyValue(a))); } else p.setValue(sp(p.value));
 if (s.numKeys){ for (var b=1;b<=s.numKeys;b++) s.setValueAtKey(b, ss(s.keyValue(b))); } else s.setValue(ss(s.value));
 return JSON.stringify({status:"success", scale:String(s.numKeys? s.keyValue(s.numKeys): s.value)}); })();
