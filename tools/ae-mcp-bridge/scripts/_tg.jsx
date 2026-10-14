(function(){var c;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G24")c=it;}
var out=[];for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!(L instanceof TextLayer))continue;var fp=L.property("ADBE Effect Parade");for(var e=1;e<=fp.numProperties;e++){if(fp.property(e).matchName==="ADBE Geometry2"){fp.property(e).enabled=$.global.EN;out.push(L.name.substr(0,10));}}}
return JSON.stringify({status:"success",o:out.length});})();
