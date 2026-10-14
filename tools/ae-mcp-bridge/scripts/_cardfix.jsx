(function(){var cfg=$.global.CF,c=null;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
var T=null,B=null;for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L instanceof TextLayer)T=L;else if(L instanceof ShapeLayer)B=L;}
var r=T.sourceRectAtTime(0,false),w=r.width*T.property("ADBE Transform Group").property("ADBE Scale").value[0]/100;
var rect=null;(function wk(g){for(var q=1;q<=g.numProperties;q++){var p=g.property(q);if(p.matchName==="ADBE Vector Shape - Rect")rect=p;else if(p.propertyType!==PropertyType.PROPERTY&&p.numProperties)wk(p);}})(B.property("ADBE Root Vectors Group"));
var grp=rect.parentProperty.parentProperty,gs=grp.property("ADBE Vector Transform Group").property("ADBE Vector Scale");
var sz=rect.property("ADBE Vector Rect Size"),v=sz.value,sx=gs.value[0]/100;
gs.setValue([100,gs.value[1]]);sz.setValue([w+320,v[1]]);app.project.save();
return JSON.stringify({status:"success",w:w,box:[w+320,v[1]]});})();
