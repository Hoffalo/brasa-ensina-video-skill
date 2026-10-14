(function(){var c=null,o={};for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===$.global.BX)c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!(L instanceof TextLayer))continue;var d=L.property("ADBE Text Properties").property("ADBE Text Document").value;
o[j+" "+L.name.substr(0,25)]={box:d.boxText?d.boxTextSize:null,sc:L.property("ADBE Transform Group").property("ADBE Scale").value[0],fs:d.fontSize,j:String(d.justification).replace("ParagraphJustification.","")};}
return JSON.stringify({status:"success",o:o});})();
