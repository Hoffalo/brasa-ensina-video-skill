// G2's number list was rebuilt with soft breaks: convert them to paragraph breaks and shrink its box.
(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G2") c=it;}
 var out=[];
 for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); if(!(L instanceof TextLayer)) continue; var p=L.property("ADBE Text Properties").property("ADBE Text Document"), d=p.value;
   if (d.text.indexOf("\u0003")<0) continue;
   var b=L.sourceRectAtTime(5,false); d.text=d.text.replace(/\u0003/g,"\r"); d.boxTextSize=[d.fontSize*3, d.boxTextSize[1]]; p.setValue(d);
   var a=L.sourceRectAtTime(5,false); var an=L.property("ADBE Transform Group").property("ADBE Anchor Point"), v=an.value; v[0]+=a.left-b.left; v[1]+=a.top-b.top; an.setValue(v);
   out.push(L.name+" fixed, w "+Math.round(b.width)+" -> "+Math.round(a.width)); }
 return JSON.stringify({status:"success",log:out}); })();
