(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G2") c=it;} var o=[];
 for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j), fx=L.property("ADBE Effect Parade"); if(!fx) continue; for (var f=1;f<=fx.numProperties;f++){ var e=fx.property(f), s=j+" "+L.name.substr(0,12)+" "+e.matchName;
   if (e.matchName==="ADBE Geometry2"){ s+=" anchor="+String(e.property("ADBE Geometry2-0001").value)+" pos="+String(e.property("ADBE Geometry2-0002").value)+" scale="+e.property("ADBE Geometry2-0003").value; } o.push(s);} }
 var t=null; for (var j2=1;j2<=c.numLayers;j2++) if (c.layer(j2).name.indexOf("1.")===0) t=c.layer(j2);
 var d=t.property("ADBE Text Properties").property("ADBE Text Document").value; o.push("numbers text="+JSON.stringify(d.text)+" box="+d.boxText+" size="+String(d.boxTextSize)+" rect="+JSON.stringify(t.sourceRectAtTime(8,false))+" anchor="+String(t.property("ADBE Transform Group").property("ADBE Anchor Point").value)+" scale="+String(t.property("ADBE Transform Group").property("ADBE Scale").value));
 return JSON.stringify({status:"success",o:o}); })();
