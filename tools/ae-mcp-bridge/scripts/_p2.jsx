(function(){var out=[],c;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G24")c=it;}
var ls=[11,12,9];for(var j=0;j<ls.length;j++){var L=c.layer(ls[j]);out.push("== "+L.name);
var fx=L.property("ADBE Effect Parade");for(var e=1;e<=fx.numProperties;e++){var E=fx.property(e);var s=E.matchName;for(var q=1;q<=E.numProperties;q++){try{var p=E.property(q);if(p.numKeys>0)s+=" "+p.name+"["+p.numKeys+"k "+p.keyValue(1)+" -> "+p.keyValue(p.numKeys)+"]";}catch(x){}}out.push(s);}
var an=L.property("ADBE Text Properties").property("ADBE Text Animators");out.push("animators "+an.numProperties);
for(var a=1;a<=an.numProperties;a++){var A=an.property(a).property("ADBE Text Animator Properties");for(var q2=1;q2<=A.numProperties;q2++){var p2=A.property(q2);try{out.push("  "+p2.name+"="+p2.value+(p2.numKeys?" keys":""));}catch(x){}}}
var tg=L.property("ADBE Transform Group");for(var t=1;t<=tg.numProperties;t++){var P=tg.property(t);try{if(P.numKeys)out.push("  T "+P.name+" "+P.numKeys+"k "+P.keyValue(1)+" -> "+P.keyValue(P.numKeys)+" @"+P.keyTime(1)+"-"+P.keyTime(P.numKeys));}catch(x){}}}
return JSON.stringify({status:"success",o:out});})();
