(function(){var o=[];var names=$.global.RE;for(var i=1;i<=app.project.numItems;i++){var c=app.project.item(i);if(!(c instanceof CompItem))continue;var hit=false;for(var n=0;n<names.length;n++)if(c.name===names[n])hit=true;if(!hit)continue;
for(var j=c.numLayers;j>=1;j--){var L=c.layer(j);if(!(L instanceof ShapeLayer))continue;var g=L.property("ADBE Root Vectors Group");if(g.numProperties===0){o.push(c.name+" removed empty '"+L.name+"'");L.remove();}}}
return JSON.stringify({status:"success",o:o});})();
