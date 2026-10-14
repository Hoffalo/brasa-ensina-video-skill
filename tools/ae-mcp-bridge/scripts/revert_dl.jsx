(function(){
  var f = app.project.file;
  if (!f || f.fsName.indexOf("Downloads") < 0) return JSON.stringify({status:"error", message:"unexpected project open: " + (f ? f.fsName : "none")});
  var path = f.fsName;
  app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
  app.open(new File(path));
  var o = {status:"success", file: app.project.file.fsName, dirty: app.project.dirty, check: []};
  var names = ["G0","G30","G32","G33","G34","G35","G36"];
  for (var i=1;i<=app.project.numItems;i++){ var it=app.project.item(i);
    if (it instanceof CompItem && ("|"+names.join("|")+"|").indexOf("|"+it.name+"|")>=0) {
      for (var j=1;j<=it.numLayers;j++) if (it.layer(j) instanceof TextLayer) { var d=it.layer(j).property("ADBE Text Properties").property("ADBE Text Document").value; o.check.push(it.name+": box="+d.boxText+" just="+(d.justification===ParagraphJustification.CENTER_JUSTIFY?"CENTER":d.justification)); }
    } }
  return JSON.stringify(o);
})();
