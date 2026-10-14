(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name===$.global.MCP_C) c=it;} var o=[];
 function d(L){ var tg=L.property("ADBE Transform Group"), s=L.index+" "+L.name+" parent="+(L.parent?L.parent.name:"-")+" 3d="+L.threeDLayer;
  for (var q=1;q<=tg.numProperties;q++){ var p=tg.property(q); try{ if(p.numKeys){ var ks=[]; for(var k=1;k<=p.numKeys;k++) ks.push(Math.round(p.keyTime(k)*100)/100+":"+String(p.keyValue(k)).substr(0,22)); s+="\n   "+p.name+" "+ks.join(" ; "); } else if(p.propertyValueType!==PropertyValueType.NO_VALUE) s+="\n   "+p.name+"="+String(p.value).substr(0,30); }catch(e){} }
  var fx=L.property("ADBE Effect Parade"); for (var k2=1;k2<=fx.numProperties;k2++){ var e=fx.property(k2); s+="\n   FX "+e.matchName; for (var m=1;m<=e.numProperties;m++){ var pp=e.property(m); try{ if(pp.numKeys){ s+=" | "+pp.name+" keys:"; for(var z=1;z<=pp.numKeys;z++) s+=Math.round(pp.keyTime(z)*100)/100+"="+String(pp.keyValue(z)).substr(0,20)+" "; } else if (/Color|Opacity/.test(pp.name)) s+=" | "+pp.name+"="+String(pp.value).substr(0,20); }catch(e){} } }
  if (L instanceof TextLayer){ var t=L.property("ADBE Text Properties").property("ADBE Text Document").value; s+="\n   TEXT fill="+(t.applyFill?String(t.fillColor):"none")+" font="+t.font; }
  return s; }
 for (var j=1;j<=c.numLayers;j++) if (/CUSTOS ESCONDIDOS/.test(c.layer(j).name)) o.push(d(c.layer(j)));
 return JSON.stringify({status:"success",o:o}); })();
