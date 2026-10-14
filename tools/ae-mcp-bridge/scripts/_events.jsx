(function(){var names=$.global.EV,out=[];
for(var i=1;i<=app.project.numItems;i++){var c=app.project.item(i);if(!(c instanceof CompItem))continue;var hit=false;for(var n=0;n<names.length;n++)if(c.name.indexOf(names[n])===0)hit=true;if(!hit)continue;
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!L.enabled||/^(Deep Royal|BG)/.test(L.name))continue;var first=1e9,txt=[],pos=[];
(function walk(g){for(var q=1;q<=g.numProperties;q++){var p;try{p=g.property(q);}catch(e){continue;}if(p.propertyType===PropertyType.PROPERTY){try{if(p.numKeys>0){if(p.matchName==="ADBE Text Document"){for(var k=2;k<=p.numKeys;k++)txt.push(Math.round(p.keyTime(k)*1000)/1000);}else if((L.nullLayer||L instanceof CameraLayer)){for(var k2=1;k2<=p.numKeys;k2++)pos.push(Math.round(p.keyTime(k2)*1000)/1000);}else first=Math.min(first,p.keyTime(1));}}catch(e){}}else{try{if(p.numProperties)walk(p);}catch(e){}}}})(L);
var t="";if(L instanceof TextLayer){try{t=L.property("ADBE Text Properties").property("ADBE Text Document").value.text.replace(/[\r\n\u0003]+/g," ").substr(0,40);}catch(e){}}
out.push({comp:c.name.substr(0,3),layer:L.name.substr(0,30),type:(L.nullLayer?"null":(L instanceof CameraLayer?"cam":(L instanceof TextLayer?"text":"shape"))),first:first<1e9?Math.round(first*1000)/1000:null,txt:txt,keys:pos,text:t});}}
return JSON.stringify({status:"success",o:out});})();
