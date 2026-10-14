(function(){var cfg=$.global.CS,c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!(L instanceof TextLayer)||!new RegExp(cfg.re).test(L.name))continue;
var an=L.property("ADBE Text Properties").property("ADBE Text Animators");out.push(L.name.substr(0,14)+" anims="+an.numProperties);
for(var a=1;a<=an.numProperties;a++){var A=an.property(a).property("ADBE Text Animator Properties");for(var q=1;q<=A.numProperties;q++){out.push("  prop "+A.property(q).matchName);}}
var fx=L.property("ADBE Effect Parade");for(var e=1;e<=fx.numProperties;e++)out.push("  fx "+fx.property(e).matchName);}
return JSON.stringify({status:"success",o:out});})();
