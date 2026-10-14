(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G7") c=it;} var log=[];
 // 1) camera: original zoom, opening aimed at the centred title
 for (var j=1;j<=c.numLayers;j++) if (c.layer(j) instanceof CameraLayer) c.layer(j).property("ADBE Camera Options Group").property("ADBE Camera Zoom").setValue(2666.66666666667);
 var n=c.layer("Null 1").property("ADBE Transform Group").property("ADBE Position"), last=n.keyValue(n.numKeys);
 for (var k=1;k<n.numKeys;k++){ var v=n.keyValue(k); v[0]=last[0]; n.setValueAtKey(k,v); } log.push("camera x locked to "+Math.round(last[0]));
 // 2) crossfade copies: identical text (restore the original line break), styles kept char by char
 var ATTR=["font","fontSize","fillColor","applyFill","strokeColor","applyStroke","strokeWidth","tracking","fauxItalic","autoLeading","leading"];
 for (var q=1;q<=c.numLayers;q++){ var L=c.layer(q); if(!(L instanceof TextLayer)) continue; var p=L.property("ADBE Text Properties").property("ADBE Text Document"), d=p.value;
   var idx=d.text.indexOf("moradia, alimenta"); if (idx<0) continue; var at=idx+"moradia,".length;
   var st=[]; for (var z=0;z<d.text.length;z++){ var cr=d.characterRange(z,z+1), a={}; for (var y=0;y<ATTR.length;y++){ try{ var vv=cr[ATTR[y]]; if(vv!==undefined&&vv!==null) a[ATTR[y]]=vv; }catch(e){} } st.push(a); }
   var just=d.justification, box=d.boxTextSize; d.text=d.text.substr(0,at)+"\r"+d.text.substr(at+1); d.justification=just; d.boxTextSize=box;
   for (var z2=0;z2<st.length;z2++){ var r=d.characterRange(z2,z2+1); for (var an in st[z2]){ try{ if(an==="leading"&&st[z2].autoLeading) continue; r[an]=st[z2][an]; }catch(e){} } }
   p.setValue(d); log.push("layer "+q+" line break restored"); }
 return JSON.stringify({status:"success",log:log}); })();
