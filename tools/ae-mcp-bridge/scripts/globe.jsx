(function(){ var c; for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name==="G45 - Abertura (Claude)") c=it;} var o=[];
 function dumpProps(g,d,out){ for (var i=1;i<=g.numProperties;i++){ var p=g.property(i), pad=new Array(d+1).join("  "), s=pad+p.name;
   try{ if(p.propertyType===PropertyType.PROPERTY && p.propertyValueType!==PropertyValueType.NO_VALUE && p.propertyValueType!==PropertyValueType.CUSTOM_VALUE && p.propertyValueType!==PropertyValueType.SHAPE){ s+=" = "+String(p.value).substr(0,50); if(p.numKeys) { s+=" KEYS:"; for(var k=1;k<=p.numKeys;k++) s+=" "+Math.round(p.keyTime(k)*100)/100+"→"+String(p.keyValue(k)).substr(0,25); } if(p.expressionEnabled) s+=" EXPR: "+p.expression.replace(/\s+/g," ").substr(0,160); } }catch(e){}
   if (p.propertyType===PropertyType.PROPERTY){ if (/=|EXPR/.test(s)) out.push(s); } else { out.push(s); if(d<5 && !/Material Options|Vec3D/.test(p.matchName)) dumpProps(p,d+1,out); } } }
 var want=/Globo|Meridiano 0|Meridiano 1$|Paralelo 0|Paralelo 30|Pin Alemanha/;
 for (var j=1;j<=c.numLayers;j++){ var L=c.layer(j); if(!want.test(L.name)) continue; o.push("=== "+L.name+(L.parent?" (parent "+L.parent.name+")":"")+" 3D="+L.threeDLayer+" in="+L.inPoint);
   var out=[]; dumpProps(L.property("ADBE Transform Group"),1,out); if (L.property("ADBE Root Vectors Group")) dumpProps(L.property("ADBE Root Vectors Group"),1,out);
   var fx=L.property("ADBE Effect Parade"); if (fx) dumpProps(fx,1,out); o=o.concat(out.filter(function(x){return !/Blend Mode|Composite|Miter|Line Cap|Line Join|Dashes|Taper|Wave|Shape Direction|Opacity = 100$|Rotation = 0$|Skew|Anchor Point = 0,0$|Scale = 100,100$/.test(x);})); }
 return JSON.stringify({status:"success",o:o}); })();
