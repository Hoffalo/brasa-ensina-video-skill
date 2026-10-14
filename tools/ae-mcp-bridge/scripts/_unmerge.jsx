(function(){var X=$.global.X,c=null,o=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===X.comp)c=it;}
for(var j=c.numLayers;j>=1;j--){var L=c.layer(j);if(L.name===X.remove){L.remove();o.push("removed");continue;}
 for(var f=0;f<X.frags.length;f++){if(L.name.replace(/\s+$/,"")==="[off] "+X.frags[f]){L.name=L.name.substr(6);L.enabled=true;o.push("restored "+X.frags[f]);}}}
return JSON.stringify({status:"success",o:o});})();
