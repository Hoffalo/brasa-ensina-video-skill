(function(){ var want=$.global.MCP_COMPS, o={};
 for (var i=1;i<=app.project.numItems;i++){ var c=app.project.item(i); if(!(c instanceof CompItem) || ("|"+want.join("|")+"|").indexOf("|"+c.name+"|")<0) continue; var a=["fps="+c.frameRate+" dur="+Math.round(c.duration*100)/100];
  for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j), s=j+" ";
   s+= L instanceof CameraLayer ? "CAM" : L instanceof TextLayer ? "TXT" : L instanceof ShapeLayer ? "SHP" : L.nullLayer ? "NUL" : (L.source && L.source.mainSource instanceof SolidSource) ? "SOL" : "AV";
   s+=(L.threeDLayer?" 3D":" 2D")+(L.enabled?"":" OFF")+" '"+L.name.substr(0,22)+"'";
   if (L.parent) s+=" parent="+L.parent.index;
   var p=L.property("ADBE Transform Group").property("ADBE Position"), v=p.numKeys?p.keyValue(p.numKeys):p.value; s+=" pos="+[Math.round(v[0]),Math.round(v[1]),Math.round(v[2]||0)].join(",")+(p.numKeys?"(k"+p.numKeys+")":"");
   if (L instanceof CameraLayer) s+=" zoom="+Math.round(L.property("ADBE Camera Options Group").property("ADBE Camera Zoom").value);
   if (L instanceof TextLayer){ var d=L.property("ADBE Text Properties").property("ADBE Text Document").value; s+=" font="+d.font+" "+Math.round(d.fontSize)+(d.boxText?" box":"")+" just="+d.justification; try{ s+=" fill="+(d.applyFill?String(d.fillColor):"none"); }catch(e){} }
   var fx=L.property("ADBE Effect Parade"); if (fx && fx.numProperties){ var f=[]; for (var k=1;k<=fx.numProperties;k++) f.push(fx.property(k).matchName.replace("ADBE ","")); s+=" fx="+f.join(","); }
   var ex=[]; var tg=L.property("ADBE Transform Group"); for (var q=1;q<=tg.numProperties;q++){ try{ if(tg.property(q).expressionEnabled) ex.push(tg.property(q).name); }catch(e){} } if (ex.length) s+=" EXPR:"+ex.join(",");
   a.push(s); }
  o[c.name]=a; }
 return JSON.stringify({status:"success",o:o}); })();
