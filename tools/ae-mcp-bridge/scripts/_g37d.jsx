(function(){var c;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G37")c=it;}
function L(n){for(var j=1;j<=c.numLayers;j++)if(c.layer(j).name===n)return c.layer(j);}
var src=L("need-aware").property("ADBE Transform Group").property("ADBE Position"),b=L("Box 1").property("ADBE Transform Group").property("ADBE Position");
var k1=src.nearestKeyIndex(8.48),k2=src.nearestKeyIndex(9.27),dx=src.keyValue(k1)[0]-src.keyValue(k2)[0];var v=b.valueAtTime(10,false);
b.setValueAtTime(src.keyTime(k1),[v[0]+dx,v[1],v[2]]);b.setValueAtTime(src.keyTime(k2),v);
var a=b.nearestKeyIndex(src.keyTime(k1)),bb=b.nearestKeyIndex(src.keyTime(k2));try{b.setTemporalEaseAtKey(a,src.keyInTemporalEase(k1),src.keyOutTemporalEase(k1));b.setTemporalEaseAtKey(bb,src.keyInTemporalEase(k2),src.keyOutTemporalEase(k2));}catch(e){}
return JSON.stringify({status:"success",n:b.numKeys});})();
