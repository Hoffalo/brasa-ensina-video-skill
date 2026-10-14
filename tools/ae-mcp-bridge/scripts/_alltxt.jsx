(function(){var out=[];for(var i=1;i<=app.project.numItems;i++){var c=app.project.item(i);if(!(c instanceof CompItem)||!/^G\d/.test(c.name))continue;var t=[];
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L instanceof TextLayer&&L.enabled){try{t.push(L.property("ADBE Text Properties").property("ADBE Text Document").value.text.replace(/[\r\n\u0003]+/g," "));}catch(e){}}}
out.push(c.name+" ("+Math.round(c.duration*10)/10+"s): "+t.join(" | "));}
return JSON.stringify({status:"success",o:out});})();
