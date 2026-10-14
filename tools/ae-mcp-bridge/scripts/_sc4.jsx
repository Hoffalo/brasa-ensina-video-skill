(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G39")c=it;}
var tmp=c.layers.addText("x");var sp=tmp.property("ADBE Text Properties").property("ADBE Text Document");
for(var j=2;j<=c.numLayers;j++){var L=c.layer(j);if(!/^(Valores|.15 e)/.test(L.name))continue;
sp.expression="var L=thisComp.layer("+j+");var r=L.sourceRectAtTime(7,false);var a=L.toComp([0,0]);var b=L.toComp([100,0]);var w=L.toWorld([0,0]);var w2=L.toWorld([100,0]);'h='+Math.round(r.height)+' w='+Math.round(r.width)+' px/100='+Math.round(b[0]-a[0])+' world/100='+Math.round(w2[0]-w[0])+' wz='+Math.round(w[2]);";
out.push(L.name.substr(0,12)+" "+sp.valueAtTime(7,false).text);}
tmp.remove();return JSON.stringify({status:"success",o:out});})();
