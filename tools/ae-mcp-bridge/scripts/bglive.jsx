// Make the house BG alive (reference: paises baratos): Turbulent Displace on the BG solid, Evolution 0 -> 170.7/s.
// $.global.BL = {comps:[...]}
(function(){var cfg=$.global.BL,o=[];function comp(n){for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===n)return it;}return null;}
for(var a=0;a<cfg.comps.length;a++){var c=comp(cfg.comps[a]);if(!c)continue;
 for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!/^Deep Royal/.test(L.name))continue;
  var fx=L.property("ADBE Effect Parade"),td=null;for(var f=1;f<=fx.numProperties;f++)if(fx.property(f).matchName==="ADBE Turbulent Displace")td=fx.property(f);
  if(!td)td=fx.addProperty("ADBE Turbulent Displace");
  for(var q0=1;q0<=td.numProperties;q0++){var pn=td.property(q0).name;if(pn==="Amount")td.property(q0).setValue(cfg.amount||18);if(pn==="Size")td.property(q0).setValue(cfg.size||160);}var ev=null;for(var q=1;q<=td.numProperties;q++)if(td.property(q).name==="Evolution")ev=td.property(q);
  while(ev.numKeys)ev.removeKey(1);ev.setValueAtTime(0,0);ev.setValueAtTime(c.duration,170.7*c.duration);
  L.property("ADBE Transform Group").property("ADBE Scale").setValue([396,396,396]);
  o.push(c.name+" ok");}}
return JSON.stringify({status:"success",o:o});})();
