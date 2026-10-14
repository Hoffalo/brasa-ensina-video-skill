(function(){var cfg=$.global.RC,c=null,o=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
var keep={};for(var k=0;k<cfg.keep.length;k++)keep[cfg.keep[k]]=1;
for(var j=c.numLayers;j>=1;j--){var L=c.layer(j);if(L.nullLayer||L instanceof CameraLayer||/^(Deep Royal Blue|BG)/.test(L.name)||keep[L.name])continue;o.push(L.name);L.remove();}
return JSON.stringify({status:"success",removed:o});})();
