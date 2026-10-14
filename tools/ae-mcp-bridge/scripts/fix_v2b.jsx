(function(){var out=[];function comp(n){for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===n)return it;}return null;}
function txt(c){for(var j=1;j<=c.numLayers;j++)if(c.layer(j) instanceof TextLayer)return c.layer(j);}
var g0=comp("G0"),fs=txt(g0).property("ADBE Text Properties").property("ADBE Text Document").value.fontSize;out.push("G0 "+g0.width+"x"+g0.height+" fs "+fs);
var c=comp("G0.1 - Menos burocracia"),T=txt(c),B=null;for(var j=1;j<=c.numLayers;j++)if(c.layer(j) instanceof ShapeLayer)B=c.layer(j);
var tp=T.property("ADBE Text Properties").property("ADBE Text Document"),d=tp.value;d.fontSize=fs;tp.setValue(d);
var w=T.sourceRectAtTime(1,false).width*T.property("ADBE Transform Group").property("ADBE Scale").value[0]/100;
var rect=null;(function wk(g){for(var q=1;q<=g.numProperties;q++){var p=g.property(q);if(p.matchName==="ADBE Vector Shape - Rect")rect=p;else if(p.propertyType!==PropertyType.PROPERTY&&p.numProperties)wk(p);}})(B.property("ADBE Root Vectors Group"));
var v=rect.property("ADBE Vector Rect Size").value,gs=rect.parentProperty.parentProperty.property("ADBE Vector Transform Group").property("ADBE Vector Scale");
var sx=Math.max(45.35,(w+320)/v[0]*100);gs.setValue([sx,gs.value[1]]);out.push("G0.1 w "+Math.round(w)+" boxW "+Math.round(v[0]*sx/100)+" comp "+c.width);
app.project.save();return JSON.stringify({status:"success",o:out});})();
