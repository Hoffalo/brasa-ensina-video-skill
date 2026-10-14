(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===$.global.SB.comp)c=it;}
var tmp=c.layers.addText("x");var sp=tmp.property("ADBE Text Properties").property("ADBE Text Document");
for(var j=2;j<=c.numLayers;j++){var L=c.layer(j);if(L instanceof CameraLayer||L.nullLayer)continue;
sp.expression="try{var L=thisComp.layer("+j+");var r=L.sourceRectAtTime(time,false);var a=L.toComp([r.left,r.top]);var b=L.toComp([r.left+r.width,r.top+r.height]);Math.round(a[0])+','+Math.round(a[1])+' '+Math.round(b[0])+','+Math.round(b[1])+' op'+Math.round(L.opacity);}catch(e){'ERR '+e.message}";
out.push(j+" "+L.name.substr(0,16)+": "+sp.valueAtTime($.global.SB.t,false).text);}
tmp.remove();return JSON.stringify({status:"success",o:out});})();
