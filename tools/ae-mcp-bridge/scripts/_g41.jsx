(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G41")c=it;}
var names=["Need-Blind ou Need-Aware?","Atendem 100% da necessidade?","Quais bolsas de mérito oferecem?","Prazo da universidade"],T=18,CX=$.global.CX;
function meas(L){var tmp=c.layers.addText("x"),sp=tmp.property("ADBE Text Properties").property("ADBE Text Document");
sp.expression="var L=thisComp.layer("+L.index+");var r=L.sourceRectAtTime(time,false);var a=L.toComp([r.left,r.top]),b=L.toComp([r.left+r.width,r.top+r.height]);var p0=L.toComp([0,0]),p1=L.toComp([100,0]),w0=L.toWorld([0,0]),w1=L.toWorld([100,0]);[a[0],a[1],b[0],b[1],(p1[0]-p0[0])/(w1[0]-w0[0])].join(',');";
var v=sp.valueAtTime(T,false).text.split(",");tmp.remove();for(var k=0;k<v.length;k++)v[k]=parseFloat(v[k]);return v;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!(L instanceof TextLayer))continue;var nm=L.property("ADBE Text Properties").property("ADBE Text Document").value.text;var hit=false;for(var n=0;n<names.length;n++)if(nm===names[n])hit=true;if(!hit)continue;
var m0=meas(L);var p=L.property("ADBE Text Properties").property("ADBE Text Document"),d=p.value;d.fontSize=d.fontSize*$.global.FS;p.setValue(d);
var m1=meas(L);var dxPx=CX-(m1[0]+m1[2])/2,dyPx=(m0[1]+m0[3])/2-(m1[1]+m1[3])/2;var r=m1[4];
var pos=L.property("ADBE Transform Group").property("ADBE Position");function sh(v){return [v[0]+dxPx/r,v[1]+dyPx/r].concat(v.length>2?[v[2]]:[]);}
if(pos.numKeys){for(var k=1;k<=pos.numKeys;k++)pos.setValueAtKey(k,sh(pos.keyValue(k)));}else pos.setValue(sh(pos.value));
var m2=meas(L);out.push(nm.substr(0,14)+" "+Math.round(m2[0])+"-"+Math.round(m2[2]));}
return JSON.stringify({status:"success",o:out});})();
