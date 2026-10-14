(function(){var cfg=$.global.X,o=[];for(var i=1;i<=app.project.numItems;i++){var c=app.project.item(i);if(!(c instanceof CompItem)||c.name!==cfg.comp)continue;
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L instanceof TextLayer){var p=L.property("ADBE Text Properties").property("ADBE Text Document"),d=p.value;d.fillColor=[1,0.8,0.01];p.setValue(d);o.push("txt");}
(function w(g){for(var q=1;q<=g.numProperties;q++){var pp=g.property(q);if(pp.matchName==="ADBE Vector Stroke Color"||pp.matchName==="ADBE Vector Fill Color"){pp.setValue([1,0.8,0.01]);o.push(pp.matchName);}else if(pp.propertyType!==PropertyType.PROPERTY&&pp.numProperties)w(pp);}})(L.property("ADBE Root Vectors Group")||L);}}
app.project.save();return JSON.stringify({status:"success",o:o});})();
