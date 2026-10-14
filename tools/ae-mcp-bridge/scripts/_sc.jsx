(function(){var cfg=$.global.X,c=null,o=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!(L instanceof TextLayer))continue;var d=L.property("ADBE Text Properties").property("ADBE Text Document").value;var T=L.property("ADBE Transform Group");o.push(j+" "+L.name.substr(0,30)+" fs="+d.fontSize+" sc="+T.property("ADBE Scale").value.toString()+" par="+(L.parent?L.parent.name:"-"));}
return JSON.stringify({status:"success",o:o});})();
