(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G24")c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!(L instanceof TextLayer))continue;var p=L.property("ADBE Text Properties").property("ADBE Text Document"),d=p.value;
if(/^De €140/.test(d.text)||/€7,000/.test(d.text)){var n=d.text.length,st=[];for(var q=0;q<n;q++){var cr=d.characterRange(q,q+1);st.push({f:cr.font,c:cr.fillColor,s:cr.fontSize});}
var nt=d.text.replace(/^De /,"de ");d.text=nt;p.setValue(d);d=p.value;for(var q2=0;q2<n;q2++){var r=d.characterRange(q2,q2+1);r.font=st[q2].f;r.fillColor=st[q2].c;r.fontSize=st[q2].s;r.fontCapsOption=FontCapsOption.FONT_NORMAL_CAPS;}p.setValue(d);out.push(p.value.text);}}
return JSON.stringify({status:"success",o:out});})();
