(function(){var Y=[1,0.8,0.01],out=[];var names=$.global.YL;
for(var i=1;i<=app.project.numItems;i++){var c=app.project.item(i);if(!(c instanceof CompItem))continue;var hit=false;for(var n=0;n<names.length;n++)if(c.name===names[n])hit=true;if(!hit)continue;
 for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);
  if(L instanceof TextLayer){var tp=L.property("ADBE Text Properties").property("ADBE Text Document");if(tp.numKeys)continue;var d=tp.value;if(!d.text)continue;d.fillColor=Y;tp.setValue(d);out.push(c.name+" text "+L.name);}
  else if(L instanceof ShapeLayer){(function walk(g){for(var q=1;q<=g.numProperties;q++){var p=g.property(q);if(p.matchName==="ADBE Vector Stroke Color"||p.matchName==="ADBE Vector Fill Color"){if(!p.numKeys){p.setValue(Y);out.push(c.name+" "+p.matchName);}}else if(p.numProperties)walk(p);}})(L.property("ADBE Root Vectors Group"));}
 }}
app.project.save();return JSON.stringify({status:"success",o:out});})();
