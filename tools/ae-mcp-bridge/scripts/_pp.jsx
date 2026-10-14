(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G26")c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);var tg=L.property("ADBE Transform Group"),p=tg.property("ADBE Position");var s=j+" "+L.name.substr(0,14)+" 3d="+L.threeDLayer+" sep="+p.dimensionsSeparated+" par="+(L.parent?L.parent.name:"-");
try{if(p.dimensionsSeparated){var x=tg.property("ADBE Position_0");s+=" X="+x.value+" k="+x.numKeys+" ex="+x.expressionEnabled;if(x.numKeys)s+=" ["+x.keyValue(1)+".."+x.keyValue(x.numKeys)+"]";}else{s+=" P="+p.value+" k="+p.numKeys+" ex="+p.expressionEnabled;}}catch(e){s+=" err";}
out.push(s);}return JSON.stringify({status:"success",o:out});})();
