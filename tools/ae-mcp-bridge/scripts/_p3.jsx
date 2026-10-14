(function(){var out=[],c;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G24")c=it;}
var ls=[11,17,9,16];for(var j=0;j<ls.length;j++){var L=c.layer(ls[j]);var s=L.name.substr(0,12)+": ";
try{var tg=L.property("ADBE Transform Group");s+=" x="+tg.property("ADBE Position_0").valueAtTime(12,false)+" anch="+tg.property(1).value+" sc="+tg.property(6).value;}catch(z){s+=" terr";}
try{var r=L.sourceRectAtTime(12,false);s+=" rect="+[r.left,r.top,r.width,r.height].join(",");}catch(w){s+=" rerr";}out.push(s);}
return JSON.stringify({status:"success",o:out});})();
