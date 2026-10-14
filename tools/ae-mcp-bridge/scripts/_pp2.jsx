(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G26")c=it;}
for(var j=3;j<=9;j++){var L=c.layer(j);var p=L.property("ADBE Transform Group").property("ADBE Position");var v;try{v=p.value;out.push(j+" "+v[0]+" "+v[1]+" "+(v.length>2?v[2]:""));}catch(e){out.push(j+" ERR "+e.toString());}}
return JSON.stringify({status:"success",o:out});})();
