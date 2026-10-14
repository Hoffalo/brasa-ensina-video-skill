(function(){ var o={};
 for (var i=1;i<=app.project.numItems;i++){ var c=app.project.item(i); if(!(c instanceof CompItem) || !/\(Claude\)/.test(c.name)) continue; var a=[];
  for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); if(!(L instanceof CameraLayer)) continue;
   var tg=L.property("ADBE Transform Group"); a.push("autoOrient="+L.autoOrient+" parent="+(L.parent?L.parent.name:"none")+" zoom="+L.property("ADBE Camera Options Group").property("ADBE Camera Zoom").value);
   for (var q=1;q<=tg.numProperties;q++){ var p=tg.property(q); try{ if(p.numKeys){ for(var k=1;k<=p.numKeys;k++) a.push(p.name+" "+Math.round(p.keyTime(k)*100)/100+" "+String(p.keyValue(k))); } else if (/Position|Point of Interest|Orientation/.test(p.name)) a.push(p.name+" static "+String(p.value)); }catch(e){} } }
  o[c.name]=a; }
 return JSON.stringify({status:"success",o:o}); })();
