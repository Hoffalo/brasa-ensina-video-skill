(function(){ var o={file: app.project.file? app.project.file.fsName:null, dirty: app.project.dirty, boxes:{}};
 var names=["g5 copy 2","G26","G27","G28","G29","G30","G31","G33","G34","G35","G36","G1 Copy 10","G37","G5 Copy 4","g16 copy 2","G1 Copy 9"];
 for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(!(it instanceof CompItem)) continue; if(("|"+names.join("|")+"|").indexOf("|"+it.name+"|")<0) continue;
  var b=0,bt=0,t=0; for(var j=1;j<=it.numLayers;j++){var L=it.layer(j); if(L instanceof ShapeLayer && /^Box/.test(L.name)) b++; if(L instanceof TextLayer){t++; if(L.property("ADBE Text Properties").property("ADBE Text Document").value.boxText) bt++;}}
  o.boxes[it.name]=it.numLayers+" layers, "+b+" boxes, "+bt+"/"+t+" box-text"; }
 return JSON.stringify(o); })();
