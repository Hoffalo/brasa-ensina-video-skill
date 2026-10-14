// Add the house Glow to text + shape layers: a SLIGHT, LIGHT bloom (user). Glow Colors = A & B with pale yellow/warm
// white, radius 80, intensity 1. "Original Colors" made a dark olive halo on the green BG. Never on G0 cards. $.global.AG = {comps:[...]}
(function(){var cfg=$.global.AG,o=[];function comp(n){for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===n)return it;}return null;}
for(var a=0;a<cfg.comps.length;a++){var c=comp(cfg.comps[a]);if(!c)continue;var n=0;
 for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!(L instanceof TextLayer)&&!(L instanceof ShapeLayer))continue;if(/^Deep Royal/.test(L.name))continue;
  var fx=L.property("ADBE Effect Parade"),has=false;for(var f=1;f<=fx.numProperties;f++)if(fx.property(f).matchName==="ADBE Glo2")has=true;if(has)continue;
  var g=fx.addProperty("ADBE Glo2"),big=/^(Titulo|Col\d head)/.test(L.name)||c.width>3000;
  g.property(1).setValue(2);g.property(2).setValue(203);g.property(3).setValue(80);g.property(4).setValue(1);g.property(5).setValue(1);g.property(6).setValue(3);g.property(7).setValue(2);g.property(8).setValue(1);g.property(12).setValue([1,0.97,0.82,1]);g.property(13).setValue([1,0.9,0.5,1]);n++;}
 o.push(c.name+" +"+n);}
app.project.save();return JSON.stringify({status:"success",o:o});})();
