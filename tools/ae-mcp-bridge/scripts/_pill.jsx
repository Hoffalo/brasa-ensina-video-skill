(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===$.global.PC)c=it;}
function r(v){if(v instanceof Array){var a=[];for(var k=0;k<v.length;k++)a.push(Math.round(v[k]));return a.join(",");}return ""+Math.round(v);}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L instanceof CameraLayer)continue;var s=j+" "+L.name.substr(0,22)+" par="+(L.parent?L.parent.name:"-");
var tg=L.property("ADBE Transform Group");var p=tg.property("ADBE Position");
if(!p.dimensionsSeparated){var pv=p.numKeys?p.keyValue(p.numKeys):p.value;s+=" pos="+r(pv);}
s+=" anc="+r(tg.property("ADBE Anchor Point").value)+" sc="+r(tg.property("ADBE Scale").value);
if(L instanceof TextLayer){var d=L.property("ADBE Text Properties").property("ADBE Text Document").value;s+=" | "+d.font+" "+r(d.fontSize)+" j="+d.justification;}
if(L instanceof ShapeLayer){var rv=L.property("ADBE Root Vectors Group");(function w(g){for(var q=1;q<=g.numProperties;q++){var pp=g.property(q);if(pp.matchName==="ADBE Vector Shape - Rect"){var sz=pp.property("ADBE Vector Rect Size");s+=" rect="+r(sz.numKeys?sz.keyValue(sz.numKeys):sz.value)+"/k"+sz.numKeys;}else if(pp.propertyType!==PropertyType.PROPERTY&&pp.numProperties)w(pp);}})(rv);}
out.push(s);}return JSON.stringify({status:"success",o:out});})();
