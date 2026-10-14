(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G45 - Abertura (Claude)") c=it;} var o=[];
 for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); if(!(L.nullLayer||L instanceof CameraLayer||/Deep Royal|BG/.test(L.name))) continue;
  var tg=L.property("ADBE Transform Group"), p=tg.property("ADBE Position"), s=j+" "+L.name+" in="+L.inPoint+" out="+L.outPoint+" start="+L.startTime+" 3d="+L.threeDLayer+" en="+L.enabled+" parent="+(L.parent?L.parent.name:"-")+" anc="+String(tg.property("ADBE Anchor Point").value)+" scl="+String(tg.property("ADBE Scale").value);
  if (p.numKeys){ for (var k=1;k<=p.numKeys;k++) s+=" | "+Math.round(p.keyTime(k)*100)/100+"@"+String(p.keyValue(k)); } else s+=" pos="+String(p.value);
  if (L instanceof CameraLayer) s+=" zoom="+L.property("ADBE Camera Options Group").property("ADBE Camera Zoom").value+" orient="+L.autoOrient;
  if (L.source) s+=" src="+L.source.width+"x"+L.source.height+" dur="+L.source.duration;
  o.push(s);} return JSON.stringify({status:"success",o:o}); })();
