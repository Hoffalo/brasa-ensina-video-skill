// Put the G6 list items back to the right of their numbers (their x was pulled onto the numbers' edge).
(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G6") c=it;}
 var tmp=c.layers.addText("x"), sp=tmp.property("ADBE Text Properties").property("ADBE Text Document");
 function L(re){ for (var j=1;j<=c.numLayers;j++) if (re.test(c.layer(j).name)) return c.layer(j); }
 var nums=L(/^1\./), med=L(/^Medicina/), mba=L(/^MBA/);
 sp.expression="function b(l){var r=l.sourceRectAtTime(time,false);return [l.toWorld([r.left,r.top])[0], l.toWorld([r.left+r.width,r.top])[0]];} JSON.stringify([b(thisComp.layer("+nums.index+")), b(thisComp.layer("+med.index+")), b(thisComp.layer("+mba.index+"))]);";
 var r=eval(sp.valueAtTime(9,false).text); tmp.remove();
 var target=r[0][1]+28, out=[];
 var ls=[med,mba]; for (var q=0;q<2;q++){ var d=target-r[q+1][0], p=ls[q].property("ADBE Transform Group").property("ADBE Position");
   if (p.dimensionsSeparated) { p = ls[q].property("ADBE Transform Group").property("ADBE Position_0");
     if (p.numKeys){ for (var k0=1;k0<=p.numKeys;k0++) p.setValueAtKey(k0, p.keyValue(k0)+d); } else p.setValue(p.value+d); }
   else if (p.numKeys){ for (var k=1;k<=p.numKeys;k++){ var v=p.keyValue(k); v[0]+=d; p.setValueAtKey(k,v);} } else { var w=p.value; w[0]+=d; p.setValue(w);} out.push(ls[q].name.substr(0,8)+" +"+Math.round(d)); }
 return JSON.stringify({status:"success",log:out}); })();
