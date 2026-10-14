// Light glow (user: the glow must be LIGHTER than the background, never a dark/olive halo): Glow Colors = A & B with
// pale colours, so the halo brightens. $.global.GL = {comps:[...], a:[r,g,b], b:[r,g,b], radius, intensity}
(function(){var cfg=$.global.GL,o=[];
for(var i=1;i<=app.project.numItems;i++){var c=app.project.item(i);if(!(c instanceof CompItem))continue;var hit=false;for(var a=0;a<cfg.comps.length;a++)if(cfg.comps[a]===c.name)hit=true;if(!hit)continue;var n=0;
for(var j=1;j<=c.numLayers;j++){var fx=c.layer(j).property("ADBE Effect Parade");if(!fx)continue;for(var f=1;f<=fx.numProperties;f++){var g=fx.property(f);if(g.matchName!=="ADBE Glo2")continue;
g.property(7).setValue(2);g.property(8).setValue(1);g.property(9).setValue(1);g.property(11).setValue(0.5);g.property(12).setValue(cfg.a.concat([1]));g.property(13).setValue(cfg.b.concat([1]));
if(cfg.radius)g.property(3).setValue(cfg.radius);if(cfg.intensity)g.property(4).setValue(cfg.intensity);n++;}}o.push(c.name+" "+n);}
return JSON.stringify({status:"success",o:o});})();
