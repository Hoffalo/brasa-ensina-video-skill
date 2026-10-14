(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===$.global.AN)c=it;}
function g(v){if(v instanceof Array){var a=[];for(var q=0;q<v.length;q++)a.push(Math.round(v[q]));return "["+a.join(",")+"]";}return ""+Math.round(v*100)/100;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);out.push("== "+j+" "+L.name.substr(0,18)+" in="+Math.round(L.inPoint*100)/100+" out="+Math.round(L.outPoint*100)/100);
var groups=[L.property("ADBE Transform Group"),L.property("ADBE Effect Parade")];
for(var gi=0;gi<2;gi++){var G=groups[gi];if(!G)continue;
(function walk(P,pre){for(var q=1;q<=P.numProperties;q++){var p;try{p=P.property(q);}catch(e){continue;}
if(p.propertyType===PropertyType.PROPERTY){var nk=0;try{nk=p.numKeys;}catch(e){}var ex=false;try{ex=p.expressionEnabled;}catch(e){}
if(nk>0||ex){var s="   "+pre+p.name+":";for(var k=1;k<=nk;k++){try{s+=" "+Math.round(p.keyTime(k)*100)/100+"="+g(p.keyValue(k));}catch(e){}}if(ex)s+=" EXPR "+p.expression.substr(0,80);out.push(s);}}
else{try{if(p.numProperties)walk(p,pre+p.name+"/");}catch(e){}}}})(G,"");}}
return JSON.stringify({status:"success",o:out});})();
