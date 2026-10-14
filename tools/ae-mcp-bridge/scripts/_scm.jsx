// $.global.SCM = {comp, from: name regex, to: name regex} -> copy scale of 'from' layer to 'to' layer
(function(){var cfg=$.global.SCM,c;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
function L(re){for(var j=1;j<=c.numLayers;j++)if(new RegExp(re).test(c.layer(j).name))return c.layer(j);}
var a=L(cfg.from),b=L(cfg.to),sa=a.property("ADBE Transform Group").property("ADBE Scale"),sb=b.property("ADBE Transform Group").property("ADBE Scale");
var fa=a.property("ADBE Text Properties").property("ADBE Text Document").value.fontSize,fb=b.property("ADBE Text Properties").property("ADBE Text Document").value.fontSize;
var before=sb.value;var v=sa.value;var k=fa/fb;sb.setValue([v[0]*k,v[1]*k,v[2]*k]);
return JSON.stringify({status:"success",before:before,after:sb.value,fa:fa,fb:fb});})();
