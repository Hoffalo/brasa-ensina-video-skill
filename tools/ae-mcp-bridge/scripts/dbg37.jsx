(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G37") c=it;}
 var tmp=c.layers.addText("x"), o={};
 var ids=[]; for (var j=2;j<=c.numLayers;j++) ids.push(j);
 var sp=tmp.property("ADBE Text Properties").property("ADBE Text Document");
 sp.expression="var o=[];for(var i=2;i<=thisComp.numLayers;i++){var L=thisComp.layer(i);var r=L.sourceRectAtTime(time,false);var a=L.toComp([r.left,r.top]),b=L.toComp([r.left+r.width,r.top+r.height]);var w=L.toWorld([r.left,r.top]);var w2=L.toWorld([r.left+r.width,r.top+r.height]);o.push(i+' '+L.name.substr(0,14)+' ww='+Math.round(w2[0]-w[0])+' sw='+Math.round(b[0]-a[0])+' s='+Math.round(a[0])+','+Math.round(a[1])+'-'+Math.round(b[0])+','+Math.round(b[1])+' w='+Math.round(w[0])+','+Math.round(w[1])+','+Math.round(w[2]||0));}o.join('|');";
 var t=sp.valueAtTime(10,false).text; tmp.remove(); return JSON.stringify({status:"success", r:t.split("|")}); })();
