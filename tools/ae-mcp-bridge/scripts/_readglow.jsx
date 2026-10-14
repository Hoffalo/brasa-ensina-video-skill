(function(){var cfg=$.global.X,o={};var before={};for(var i=1;i<=app.project.numItems;i++)before[app.project.item(i).id]=1;
app.project.importFile(new ImportOptions(new File(cfg.file)));
var news=[];for(var i2=1;i2<=app.project.numItems;i2++){var it=app.project.item(i2);if(!before[it.id])news.push(it);}
for(var n=0;n<news.length;n++){var c=news[n];if(!(c instanceof CompItem)||c.name!==cfg.comp)continue;
 for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);var fx=L.property("ADBE Effect Parade");if(!fx)continue;for(var f=1;f<=fx.numProperties;f++){var g=fx.property(f);if(g.matchName!=="ADBE Glo2")continue;var p={};for(var q=1;q<=g.numProperties;q++){try{var pp=g.property(q);if(pp.propertyType===PropertyType.PROPERTY)p[q+" "+pp.name]=pp.value.toString();}catch(e){}}o[L.name]=p;}}
 var cam=null,nl=null;for(var j2=1;j2<=c.numLayers;j2++){if(c.layer(j2) instanceof CameraLayer)cam=c.layer(j2);}
 if(cam){var co=cam.property("ADBE Camera Options Group");o.cam={zoom:co.property("ADBE Camera Zoom").value,pos:cam.property("ADBE Transform Group").property("ADBE Position").value.toString()};}}
for(var r=news.length-1;r>=0;r--){try{news[r].remove();}catch(e){}}
return JSON.stringify({status:"success",o:o});})();
