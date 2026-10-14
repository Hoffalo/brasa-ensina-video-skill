(function(){var names=$.global.BC,out=[];
for(var i=1;i<=app.project.numItems;i++){var c=app.project.item(i);if(!(c instanceof CompItem))continue;var hit=false;for(var n=0;n<names.length;n++)if(c.name.indexOf(names[n])===0)hit=true;if(!hit)continue;
out.push("== "+c.name+" dur="+Math.round(c.duration*100)/100);
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);var first=1e9,last=-1;
(function walk(g){for(var q=1;q<=g.numProperties;q++){var p;try{p=g.property(q);}catch(e){continue;}if(p.propertyType===PropertyType.PROPERTY){try{if(p.numKeys>0){first=Math.min(first,p.keyTime(1));last=Math.max(last,p.keyTime(p.numKeys));}}catch(e){}}else{try{if(p.numProperties)walk(p);}catch(e){}}}})(L);
var t="";if(L instanceof TextLayer){try{t=L.property("ADBE Text Properties").property("ADBE Text Document").value.text.replace(/[\r\n\u0003]+/g," ").substr(0,40);}catch(e){}}
out.push(j+" "+L.name.substr(0,26)+" | in="+Math.round(L.inPoint*100)/100+" out="+Math.round(L.outPoint*100)/100+" keys="+(first<1e9?Math.round(first*100)/100+"-"+Math.round(last*100)/100:"-")+(t?" | "+t:""));}}
return JSON.stringify({status:"success",o:out});})();
