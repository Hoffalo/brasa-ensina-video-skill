(function(){ var want=$.global.MCP_COMPS, o={};
 for (var i=1;i<=app.project.numItems;i++){ var c=app.project.item(i); if(!(c instanceof CompItem) || ("|"+want.join("|")+"|").indexOf("|"+c.name+"|")<0) continue; var a=[];
  for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); var tg=L.property("ADBE Transform Group"), op=tg.property("ADBE Opacity"), t0=op.numKeys?op.keyTime(1):L.inPoint;
   var fx=tg.property("ADBE Scale"); var s2="";
   if (L instanceof TextLayer){ var d=L.property("ADBE Text Properties").property("ADBE Text Document").value; s2="TXT "+d.font.replace("-Extrabold","").replace("Lato-","")+" "+Math.round(d.fontSize)+" fill="+(d.applyFill?String(d.fillColor).split(",").map(function(x){return Math.round(x*100)/100;}).join(","):"none")+" \""+d.text.replace(/[\r\u0003]/g," / ")+"\""; }
   else if (L instanceof ShapeLayer){ s2="SHP"; }
   else s2=L instanceof CameraLayer?"CAM":"AV";
   var keys=[]; for (var q=1;q<=tg.numProperties;q++){ var p=tg.property(q); try{ if(p.numKeys){ var ks=[]; for(var k=1;k<=p.numKeys;k++) ks.push(Math.round(p.keyTime(k)*100)/100); keys.push(p.name.substr(0,3)+"@"+ks.join("/")); } }catch(e){} }
   a.push([Math.round(t0*100)/100, j, L.name.substr(0,20), s2.substr(0,110), keys.join(" "), L.parent?("par="+L.parent.index):""].join(" | ")); }
  a.sort(function(x,y){ return parseFloat(x)-parseFloat(y); }); o[c.name]=a; }
 return JSON.stringify({status:"success",o:o}); })();
