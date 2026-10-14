(function(){ var o=[];
 for (var i=1;i<=app.project.numItems;i++){ var c=app.project.item(i); if(!(c instanceof CompItem) || !/^G\d/.test(c.name)) continue;
  var t=[], cams=0, d3=0; for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); if (L instanceof CameraLayer) cams++; if (L.threeDLayer) d3++;
   if (L instanceof TextLayer){ var s=L.property("ADBE Text Properties").property("ADBE Text Document").value.text.replace(/[\r\u0003]+/g," / "); if (s) t.push(s.substr(0,40)); } }
  o.push(c.name+" ["+c.width+"x"+c.height+", "+Math.round(c.duration*10)/10+"s, cam="+cams+", 3D="+d3+"/"+c.numLayers+"] :: "+t.join(" | ").substr(0,260)); }
 return JSON.stringify({status:"success",o:o}); })();
