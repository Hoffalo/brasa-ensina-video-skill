(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===$.global.RC)c=it;}
for(var j=c.numLayers;j>=1;j--){var L=c.layer(j);if(L instanceof TextLayer&&/^\s*$/.test(L.property("ADBE Text Properties").property("ADBE Text Document").value.text)){out.push(L.name);L.remove();}}
var names=[];for(var k=1;k<=c.numLayers;k++)names.push(k+" "+c.layer(k).name.substr(0,20));return JSON.stringify({status:"success",removed:out,layers:names});})();
