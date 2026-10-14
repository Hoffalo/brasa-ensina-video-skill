(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===$.global.SB.comp)c=it;}
var tmp=c.layers.addText("x");var sp=tmp.property("ADBE Text Properties").property("ADBE Text Document");
for(var j=2;j<=c.numLayers;j++){var L=c.layer(j);if(L instanceof CameraLayer||L.nullLayer)continue;
var fx=[],fp=L.property("ADBE Effect Parade");for(var e=1;e<=fp.numProperties;e++)if(fp.property(e).matchName==="ADBE Geometry2")fx.push(e);
sp.expression="var L=thisComp.layer("+j+");var r=L.sourceRectAtTime(time,false);if(!(L instanceof TextLayer)){r={left:r.left,top:r.top,width:r.width,height:r.height};}var fx=["+fx.join(",")+"];var ox=0,oy=0;for(var k=0;k<fx.length;k++){var E=L.effect(fx[k]);ox+=E(2)[0]-E(1)[0];oy+=E(2)[1]-E(1)[1];}var a=L.toComp([r.left+ox,r.top+oy]);var b=L.toComp([r.left+r.width+ox,r.top+r.height+oy]);Math.round(a[0])+','+Math.round(a[1])+' '+Math.round(b[0])+','+Math.round(b[1])+' op'+Math.round(L.opacity);";
out.push(L.name.substr(0,16)+": "+sp.valueAtTime($.global.SB.t,false).text);}
tmp.remove();return JSON.stringify({status:"success",o:out});})();
