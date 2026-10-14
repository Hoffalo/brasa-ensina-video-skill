(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G7") c=it;} var a=[];
 for (var j=5;j<=8;j++){ var L=c.layer(j), d=L.property("ADBE Text Properties").property("ADBE Text Document").value, m="";
  for (var k=0;k<d.text.length;k++){ var cr=d.characterRange(k,k+1), v=false; try{ v=cr.applyFill; }catch(e){} var ch=d.text.charAt(k); m += ch==="\r" ? "|" : (v ? ch : (ch===" "?"_":"~")); }
  var op=L.property("ADBE Transform Group").property("ADBE Opacity"), p=L.property("ADBE Transform Group").property("ADBE Position"), ks="";
  for (var q=1;q<=op.numKeys;q++) ks+=" op"+Math.round(op.keyTime(q)*100)/100+"="+op.keyValue(q);
  for (var q2=1;q2<=p.numKeys;q2++) ks+=" p"+Math.round(p.keyTime(q2)*100)/100+"="+Math.round(p.keyValue(q2)[1]);
  a.push(j+" ["+m+"] in="+Math.round(L.inPoint*100)/100+ks); }
 return JSON.stringify({status:"success",a:a}); })();
