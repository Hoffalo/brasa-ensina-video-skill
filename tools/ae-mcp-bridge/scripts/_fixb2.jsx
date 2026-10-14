(function(){var c;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G20")c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!(L instanceof TextLayer))continue;var p=L.property("ADBE Text Properties").property("ADBE Text Document"),d=p.value;
if(/b2$/.test(d.text)){var t=d.text,n=t.length;var cr=d.characterRange(n-2,n);var f=cr.font,fc=cr.fillColor,fs=cr.fontSize;d.text=t.replace(/b2$/,"B2");p.setValue(d);d=p.value;cr=d.characterRange(n-2,n);cr.font=f;cr.fillColor=fc;cr.fontSize=fs;p.setValue(d);return JSON.stringify({status:"success",t:p.value.text});}}
return JSON.stringify({status:"none"});})();
