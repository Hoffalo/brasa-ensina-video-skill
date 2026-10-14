// Compress stretched (non-hold) animation segments longer than MAXD back to house timing (DUR s). $.global.FS = {comps:[...], maxd:0.62, dur:0.45}
(function(){var cfg=$.global.FS,out=[];
for(var i=1;i<=app.project.numItems;i++){var c=app.project.item(i);if(!(c instanceof CompItem))continue;var hit=false;for(var n=0;n<cfg.comps.length;n++)if(c.name.indexOf(cfg.comps[n])===0)hit=true;if(!hit)continue;
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L.nullLayer||L instanceof CameraLayer||/^(Deep|BG)/.test(L.name))continue;
(function walk(g){for(var q=1;q<=g.numProperties;q++){var p;try{p=g.property(q);}catch(e){continue;}if(p.propertyType===PropertyType.PROPERTY){try{if(p.numKeys>1&&p.matchName!=="ADBE Text Document"){
 for(var k=1;k<p.numKeys;k++){var t1=p.keyTime(k),t2=p.keyTime(k+1);if(t2-t1<=cfg.maxd)continue;if(p.keyValue(k).toString()===p.keyValue(k+1).toString())continue;
  var nt=t1+cfg.dur;var v=p.keyValue(k+1),ie=null,oe=null,ii=p.keyInInterpolationType(k+1),oi=p.keyOutInterpolationType(k+1);try{ie=p.keyInTemporalEase(k+1);oe=p.keyOutTemporalEase(k+1);}catch(e){}
  p.removeKey(k+1);var ni=p.addKey(nt);p.setValueAtKey(ni,v);try{if(ie)p.setTemporalEaseAtKey(ni,ie,oe);p.setInterpolationTypeAtKey(ni,ii,oi);}catch(e){}
  // hold the value until the old time so later keys still make sense
  out.push(c.name.substr(0,3)+" "+L.name.substr(0,20)+" "+p.name+" "+Math.round(t1*100)/100+": "+Math.round((t2-t1)*100)/100+"s -> "+cfg.dur);}
}}catch(e){out.push("ERR "+L.name+" "+e.toString());}}else{try{if(p.numProperties)walk(p);}catch(e){}}}})(L);}}
return JSON.stringify({status:"success",o:out});})();
