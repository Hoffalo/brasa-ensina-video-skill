// Replace all layers of a comp with the layers of the same-named comp in a backup .aep (comp identity kept).
(function(){ var name=$.global.MCP_RESTORE.comp, file=$.global.MCP_RESTORE.file;
 var cur=null; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name===name){ cur=it; break; } }
 var curId=cur.id;
 var folder=app.project.importFile(new ImportOptions(new File(file)));
 function find(f){ for (var k=1;k<=f.numItems;k++){ var x=f.item(k); if (x instanceof CompItem && x.name===name) return x; if (x instanceof FolderItem){ var r=find(x); if(r) return r; } } return null; }
 var src=find(folder);
 for (var q=1;q<=app.project.numItems;q++) if (app.project.item(q).id===curId) cur=app.project.item(q);
 for (var j=cur.numLayers;j>=1;j--){ cur.layer(j).locked=false; cur.layer(j).remove(); }
 for (var s=src.numLayers;s>=1;s--) src.layer(s).copyToComp(cur);
 // re-link parents by name/index (copyToComp drops parenting across comps): rebuild from source
 function cp(sp, dp){ // copy a transform property (value or keys + eases) exactly
   if (sp.propertyType!==PropertyType.PROPERTY){ for (var i=1;i<=sp.numProperties;i++){ try{ cp(sp.property(i), dp.property(i)); }catch(e){} } return; }
   if (sp.propertyValueType===PropertyValueType.NO_VALUE || sp.propertyValueType===PropertyValueType.CUSTOM_VALUE) return;
   try{ while(dp.numKeys) dp.removeKey(1); }catch(e){}
   if (sp.numKeys){ for (var k=1;k<=sp.numKeys;k++) dp.setValueAtTime(sp.keyTime(k), sp.keyValue(k));
     for (var k2=1;k2<=sp.numKeys;k2++){ try{ dp.setInterpolationTypeAtKey(k2, sp.keyInInterpolationType(k2), sp.keyOutInterpolationType(k2)); dp.setTemporalEaseAtKey(k2, sp.keyInTemporalEase(k2), sp.keyOutTemporalEase(k2)); }catch(e){} }
   } else { try{ dp.setValue(sp.value); }catch(e){} }
   try{ if (sp.expression) { dp.expression=sp.expression; dp.expressionEnabled=sp.expressionEnabled; } }catch(e){}
 }
 for (var p=1;p<=src.numLayers;p++){ var S=src.layer(p); if (!S.parent) continue; var Ld=cur.layer(p);
   Ld.setParentWithJump(cur.layer(S.parent.index));
   var st=S.property("ADBE Transform Group"), dt=Ld.property("ADBE Transform Group");
   if (st.property("ADBE Position").dimensionsSeparated !== dt.property("ADBE Position").dimensionsSeparated) dt.property("ADBE Position").dimensionsSeparated = st.property("ADBE Position").dimensionsSeparated;
   cp(st, dt); }
 // keep the sources the copied layers use (solids/nulls live in the imported folder): move them into the main project
 var dest=null; for (var d=1;d<=app.project.rootFolder.numItems;d++){ var D=app.project.rootFolder.item(d); if (D instanceof FolderItem && D.name==="Solids"){ dest=D; break; } }
 if (!dest) dest=app.project.rootFolder;
 function inside(it,f){ var p=it.parentFolder; while(p){ if(p===f || p.id===f.id) return true; if(p===app.project.rootFolder) return false; p=p.parentFolder; } return false; }
 var moved=0; for (var m=1;m<=cur.numLayers;m++){ var L=cur.layer(m); if (L.source && !(L.source instanceof CompItem) && inside(L.source, folder)){ L.source.parentFolder=dest; moved++; } }
 var n=cur.numLayers; folder.remove();
 return JSON.stringify({status:"success",layers:n}); })();
