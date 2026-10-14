// Fit + centre a G0 card: text centre-justified, box resized to text (+padX/+padY), text centred on the box.
// $.global.CF2 = {comps:[...], text?:{comp:"multi\rline"}, padX:160, padY:130}
(function(){var cfg=$.global.CF2,o=[];function comp(n){for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===n)return it;}return null;}
for(var a=0;a<cfg.comps.length;a++){var c=comp(cfg.comps[a]);var T=null,B=null;for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L instanceof TextLayer)T=L;else if(L instanceof ShapeLayer)B=L;}
var tp=T.property("ADBE Text Properties").property("ADBE Text Document"),d=tp.value;if(cfg.text&&cfg.text[c.name])d.text=cfg.text[c.name];d.justification=ParagraphJustification.CENTER_JUSTIFY;tp.setValue(d);
var r=T.sourceRectAtTime(0,false),sc=T.property("ADBE Transform Group").property("ADBE Scale").value[0]/100;
var rect=null;(function wk(g){for(var q=1;q<=g.numProperties;q++){var p=g.property(q);if(p.matchName==="ADBE Vector Shape - Rect")rect=p;else if(p.propertyType!==PropertyType.PROPERTY&&p.numProperties)wk(p);}})(B.property("ADBE Root Vectors Group"));
rect.property("ADBE Vector Rect Size").setValue([r.width*sc+2*(cfg.padX||160),r.height*sc+2*(cfg.padY||130)]);
var br=B.sourceRectAtTime(0,false),bt=B.property("ADBE Transform Group"),bp=bt.property("ADBE Position").value,ba=bt.property("ADBE Anchor Point").value,bs=bt.property("ADBE Scale").value;
var bcx=bp[0]+(br.left+br.width/2-ba[0])*bs[0]/100,bcy=bp[1]+(br.top+br.height/2-ba[1])*bs[1]/100;
var tt=T.property("ADBE Transform Group");tt.property("ADBE Anchor Point").setValue([r.left+r.width/2,r.top+r.height/2]);
var P=tt.property("ADBE Position");if(P.numKeys){var cur=P.keyValue(1);for(var k=1;k<=P.numKeys;k++){var v=P.keyValue(k);P.setValueAtKey(k,[bcx+(v[0]-cur[0]),bcy+(v[1]-cur[1])]);}}else P.setValue([bcx,bcy]);
o.push(c.name+" box "+Math.round(r.width*sc)+"x"+Math.round(r.height*sc));}
app.project.save();return JSON.stringify({status:"success",o:o});})();
