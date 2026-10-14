(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G22") c=it;}
 var done=[];
 for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); if (L.name!=="Para uma" && L.name.indexOf("BANCA DE")!==0) continue;
  var op=L.property("ADBE Transform Group").property("ADBE Opacity"); while(op.numKeys) op.removeKey(1);
  op.setValueAtTime(3.05,100); op.setValueAtTime(3.38,0);
  op.setTemporalEaseAtKey(1,[new KeyframeEase(0,16.67)],[new KeyframeEase(0,33.33)]); op.setTemporalEaseAtKey(2,[new KeyframeEase(0,81.39)],[new KeyframeEase(0,16.67)]);
  done.push(L.name); }
 return JSON.stringify({status:"success",faded:done}); })();
