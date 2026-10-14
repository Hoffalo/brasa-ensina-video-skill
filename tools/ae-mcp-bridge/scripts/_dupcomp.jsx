(function(){var cfg=$.global.DC,src=null,o=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.src)src=it;}
for(var n=0;n<cfg.names.length;n++){for(var k=app.project.numItems;k>=1;k--){var x=app.project.item(k);if(x instanceof CompItem&&x.name===cfg.names[n])x.remove();}var c=src.duplicate();c.name=cfg.names[n];if(cfg.dur){c.duration=cfg.dur;
 // template layers often end at the template's length: extend camera / null / BG to the new duration
 for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);try{if(L.outPoint<cfg.dur)L.outPoint=cfg.dur+0.5;}catch(e){o.push("ext fail "+L.name);}try{if(L.inPoint>0&&(L.nullLayer||L instanceof CameraLayer||/^(Deep Royal|BG)/.test(L.name)))L.inPoint=0;}catch(e){o.push("in fail "+L.name);}}}
 o.push(c.name);}
return JSON.stringify({status:"success",o:o});})();
