(function(){var cfg=$.global.CS,c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!(L instanceof TextLayer)||!new RegExp(cfg.re).test(L.name))continue;var d=L.property("ADBE Text Properties").property("ADBE Text Document").value;var s=L.name.substr(0,16)+":",prev="";
for(var q=0;q<d.text.length;q++){var r=d.characterRange(q,q+1);var k=r.font+" "+Math.round(r.fontSize*10)/10+" "+(r.fillColor?r.fillColor.join(",").substr(0,12):"")+" bs"+r.baselineShift+" hs"+r.horizontalScale+" vs"+r.verticalScale;if(k!==prev){s+=" ["+q+"] "+k;prev=k;}}out.push(s);}
return JSON.stringify({status:"success",o:out});})();
