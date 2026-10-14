(function(){var cfg=$.global.X,o=[];for(var i=1;i<=app.project.numItems;i++){var c=app.project.item(i);if(!(c instanceof CompItem))continue;var ok=false;for(var a=0;a<cfg.comps.length;a++)if(cfg.comps[a]===c.name)ok=true;if(!ok)continue;
for(var j=1;j<=c.numLayers;j++){var fx=c.layer(j).property("ADBE Effect Parade");if(!fx)continue;for(var f=fx.numProperties;f>=1;f--)if(fx.property(f).matchName==="ADBE Turbulent Displace"){fx.property(f).remove();o.push(c.name);}}}
app.project.save();return JSON.stringify({status:"success",o:o});})();
