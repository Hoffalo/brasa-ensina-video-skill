(function(){
  var c=null; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G1 Copy 6"){c=it;break;}}
  var L=null; for (var j=1;j<=c.numLayers;j++){ if (c.layer(j).name==="1. 2.") L=c.layer(j); }
  var p=L.property("ADBE Text Properties").property("ADBE Text Document"), d=p.value;
  var before=L.sourceRectAtTime(0,false);
  d.boxTextSize=[d.fontSize*3, d.boxTextSize[1]]; p.setValue(d);
  var after=L.sourceRectAtTime(0,false);
  // keep glyph top-left where it was
  var a=L.property("ADBE Transform Group").property("ADBE Anchor Point"), v=a.value; v[0]+=after.left-before.left; v[1]+=after.top-before.top; a.setValue(v);
  return JSON.stringify({status:"success", before:[before.left,before.top,before.width,before.height], after:[after.left,after.top,after.width,after.height]});
})();
