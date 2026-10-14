(function(){ var o={file: app.project.file? app.project.file.fsName:null, dirty: app.project.dirty, tree:[]};
 function walk(f, d){ for (var i=1;i<=f.numItems;i++){ var it=f.item(i), pad=""; for(var k=0;k<d;k++) pad+="  ";
   var t = it instanceof CompItem ? "comp "+it.width+"x"+it.height+" "+Math.round(it.duration*100)/100+"s L"+it.numLayers : (it instanceof FolderItem ? "folder" : (it.mainSource instanceof SolidSource ? "solid" : "footage"));
   o.tree.push(pad+it.name+"  ["+t+"]"); if (it instanceof FolderItem) walk(it, d+1); } }
 walk(app.project.rootFolder, 0); return JSON.stringify(o); })();
