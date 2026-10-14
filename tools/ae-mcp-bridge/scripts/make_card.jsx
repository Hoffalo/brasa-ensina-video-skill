// Duplicate the G0 boxed-title card (transparent) with a new UPPERCASE term; widen the box if the text needs it.
// $.global.CD = {src:"G0", name, text}
(function(){var cfg=$.global.CD,src=null,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.src)src=it;}
for(var i2=app.project.numItems;i2>=1;i2--){var o=app.project.item(i2);if(o instanceof CompItem&&o.name===cfg.name)o.remove();}
var c=src.duplicate();c.name=cfg.name;var T=null,B=null;for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L instanceof TextLayer)T=L;else if(L instanceof ShapeLayer)B=L;}
var tp=T.property("ADBE Text Properties").property("ADBE Text Document"),d=tp.value;d.text=cfg.text;tp.setValue(d);T.name=cfg.text;
var r=T.sourceRectAtTime(0,false),w=r.width*T.property("ADBE Transform Group").property("ADBE Scale").value[0]/100;
var rect=null;(function wk(g){for(var q=1;q<=g.numProperties;q++){var p=g.property(q);if(p.matchName==="ADBE Vector Shape - Rect")rect=p;else if(p.propertyType!==PropertyType.PROPERTY&&p.numProperties)wk(p);}})(B.property("ADBE Root Vectors Group"));
var sz=rect.property("ADBE Vector Rect Size"),v=sz.value;var grp=rect.parentProperty.parentProperty;var gs=grp.property("ADBE Vector Transform Group").property("ADBE Vector Scale");
gs.setValue([100,gs.value[1]]);sz.setValue([w+320,v[1]]);out.push("box w="+Math.round(w+320));  // resize the rect, never scale it (scaling pinches the corners)
out.push(cfg.name+" text w="+Math.round(w)+" comp "+c.width+"x"+c.height);return JSON.stringify({status:"success",o:out});})();
