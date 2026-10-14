(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G37")c=it;}
function L(n){for(var j=1;j<=c.numLayers;j++)if(c.layer(j).name===n)return c.layer(j);}
var src=L("need-aware").property("ADBE Transform Group").property("ADBE Position"),b=L("Box 1").property("ADBE Transform Group").property("ADBE Position");
var k1=src.nearestKeyIndex(8.48),k2=src.nearestKeyIndex(9.27),dx=src.keyValue(k1)[0]-src.keyValue(k2)[0];var v=b.value;
b.setValueAtTime(src.keyTime(k1),[v[0]+dx,v[1],v[2]]);b.setValueAtTime(src.keyTime(k2),v);
for(var q=1;q<=2;q++){var sk=q===1?k1:k2;try{b.setTemporalEaseAtKey(q,src.keyInTemporalEase(sk),src.keyOutTemporalEase(sk));}catch(e){}}
// camera zoom: undo the earlier fit factors so rests can be refitted
var z=null;for(var j=1;j<=c.numLayers;j++)if(c.layer(j) instanceof CameraLayer)z=c.layer(j).property("ADBE Camera Options Group").property("ADBE Camera Zoom");
var ks=[];for(var k=1;k<=z.numKeys;k++){var t=z.keyTime(k);var f=(t>1.7&&t<24.7)?1/0.722:(t>25.5?1/0.756:1);z.setValueAtKey(k,z.keyValue(k)*f);ks.push(Math.round(t*100)/100+"="+Math.round(z.keyValue(k)));}
return JSON.stringify({status:"success",dx:dx,zoom:ks});})();
