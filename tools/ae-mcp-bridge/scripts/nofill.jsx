(function(){ var o=[];
 for (var i=1;i<=app.project.numItems;i++){var c=app.project.item(i); if(!(c instanceof CompItem) || !/^G\d+$/.test(c.name)) continue;
  for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); if(!(L instanceof TextLayer)) continue; var d=L.property("ADBE Text Properties").property("ADBE Text Document").value, n=0, first=-1;
   for (var k=0;k<d.text.length;k++){ var cr=d.characterRange(k,k+1), vis=true; try{ vis = cr.applyFill || cr.applyStroke; }catch(e){ vis=false; } if(!vis && !/\s/.test(d.text.charAt(k))){ n++; if(first<0) first=k; } }
   if (n) o.push(c.name+" #"+j+" '"+L.name.substr(0,20)+"' hidden chars="+n+" from "+first+"/"+d.text.length+": "+JSON.stringify(d.text.substr(first,60))); } }
 return JSON.stringify({status:"success",o:o}); })();
