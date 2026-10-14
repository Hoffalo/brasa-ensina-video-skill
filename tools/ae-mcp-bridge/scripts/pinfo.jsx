(function(){ var o={file: app.project.file ? app.project.file.fsName : null, dirty: app.project.dirty, comps: []};
 for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem) o.comps.push(it.name+" ("+it.numLayers+")");}
 return JSON.stringify(o); })();
