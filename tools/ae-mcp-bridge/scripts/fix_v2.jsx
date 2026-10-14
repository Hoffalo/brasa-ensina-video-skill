// Fit G0.x card text inside 1500px (shrink font, refit box) + raise planilha cell texts to row centre.
(function(){var out=[];function comp(n){for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===n)return it;}return null;}
var cards=["G0.1 - Menos burocracia","G0.2 - Bolsa ICDF","G0.3 - Dica BRASA"],MAXW=1500;
for(var ci=0;ci<cards.length;ci++){var c=comp(cards[ci]);if(!c){out.push("missing "+cards[ci]);continue;}var T=null,B=null;
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L instanceof TextLayer)T=L;else if(L instanceof ShapeLayer)B=L;}
var tp=T.property("ADBE Text Properties").property("ADBE Text Document"),sc=T.property("ADBE Transform Group").property("ADBE Scale").value[0]/100;
var w=T.sourceRectAtTime(1,false).width*sc;var w0=w;
if(w>MAXW){var d=tp.value;d.fontSize=d.fontSize*MAXW/w;tp.setValue(d);w=T.sourceRectAtTime(1,false).width*sc;}
var rect=null;(function wk(g){for(var q=1;q<=g.numProperties;q++){var p=g.property(q);if(p.matchName==="ADBE Vector Shape - Rect")rect=p;else if(p.propertyType!==PropertyType.PROPERTY&&p.numProperties)wk(p);}})(B.property("ADBE Root Vectors Group"));
var v=rect.property("ADBE Vector Rect Size").value,gs=rect.parentProperty.parentProperty.property("ADBE Vector Transform Group").property("ADBE Vector Scale");
var sx=Math.max(45.35,(w+320)/v[0]*100);gs.setValue([sx,gs.value[1]]);out.push(cards[ci]+" w "+Math.round(w0)+"->"+Math.round(w)+" boxW "+Math.round(v[0]*sx/100));}
var P=comp("G51b - Planilha (Claude)"),n=0;
for(var k=1;k<=P.numLayers;k++){var L2=P.layer(k);if(L2.name.indexOf("Celula ")!==0&&L2.name.indexOf("Valor ")!==0)continue;var p2=L2.property("ADBE Transform Group").property("ADBE Position");
if(p2.numKeys){for(var q2=1;q2<=p2.numKeys;q2++){var vv=p2.keyValue(q2);vv[1]-=19;p2.setValueAtKey(q2,vv);}}else{var v3=p2.value;v3[1]-=19;p2.setValue(v3);}n++;}
out.push("planilha cells raised "+n);app.project.save();return JSON.stringify({status:"success",o:out});})();
