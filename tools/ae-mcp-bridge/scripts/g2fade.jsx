(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G2") c=it;}
 var L=null; for (var j=1;j<=c.numLayers;j++) if (c.layer(j).name.indexOf("As 4 partes")===0) L=c.layer(j);
 var op=L.property("ADBE Transform Group").property("ADBE Opacity"); while(op.numKeys) op.removeKey(1);
 op.setValueAtTime(2.48,100); op.setValueAtTime(3.05,0);
 op.setTemporalEaseAtKey(1,[new KeyframeEase(0,16.67)],[new KeyframeEase(0,33.33)]); op.setTemporalEaseAtKey(2,[new KeyframeEase(0,81.39)],[new KeyframeEase(0,16.67)]);
 return JSON.stringify({status:"success"}); })();
