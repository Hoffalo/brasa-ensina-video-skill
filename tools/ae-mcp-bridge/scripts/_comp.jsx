(function(){var cfg=$.global.CM,c=null,o=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
for(var n=0;n<cfg.layers.length;n++){var L=c.layer(cfg.layers[n]);var p=L.property("ADBE Text Properties").property("ADBE Text Document"),d=p.value;
 var had=null;try{had=d.composerEngine;}catch(e){}try{o.push(L.name.substr(0,15)+" every="+d.everyLineComposer);d.everyLineComposer=false;p.setValue(d);o.push(" -> "+p.value.everyLineComposer);}catch(e){o.push("ERR "+e);}}
return JSON.stringify({status:"success",o:o});})();
