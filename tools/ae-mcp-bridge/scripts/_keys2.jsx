(function(){var cfg=$.global.K2,c=null,out=[];app.project.save();
for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);
(function walk(g,path){for(var q=1;q<=g.numProperties;q++){var p;try{p=g.property(q);}catch(e){continue;}
if(p.propertyType===PropertyType.PROPERTY){var s="";try{if(p.numKeys){s+=" keys:";for(var k=1;k<=p.numKeys;k++)s+=Math.round(p.keyTime(k)*100)/100+"="+String(p.keyValue(k)).substr(0,20)+" ";}}catch(e){}
try{if(p.expressionEnabled&&p.expression)s+=" EXPR:"+p.expression.substr(0,80);}catch(e){}
if(s)out.push(j+" "+L.name.substr(0,22)+" | "+path+"/"+p.name+s);}else walk(p,path+"/"+p.name);}})(L,"");
var ms=L.property("ADBE Mask Parade");if(ms&&ms.numProperties)out.push(j+" masks:"+ms.numProperties);
try{if(L.trackMatteType!=TrackMatteType.NO_TRACK_MATTE)out.push(j+" matte "+L.trackMatteType);}catch(e){}}
return JSON.stringify({status:"success",o:out});})();
