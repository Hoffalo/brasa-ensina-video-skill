(function(){var out=[],c;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G39")c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!(L instanceof TextLayer))continue;var s=L.name.substr(0,14)+": ";
var E=L.property("ADBE Effect Parade").property("ADBE Geometry2");if(E){for(var q=1;q<=E.numProperties;q++){var p=E.property(q),v=null;try{v=p.value;}catch(x){continue;}if(v===null||v===undefined)continue;s+=q+"="+(v instanceof Array?v.join("/"):v)+" ";}}
var tg=L.property("ADBE Transform Group");s+="| z="+L.property("ADBE Transform Group").property("ADBE Position").value[2]+" anch="+tg.property("ADBE Anchor Point").value.join("/")+" sc="+tg.property("ADBE Scale").value.join("/");out.push(s);}
return JSON.stringify({status:"success",o:out});})();
