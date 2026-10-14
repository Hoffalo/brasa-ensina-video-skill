(function(){var o=[app.project.file?app.project.file.fsName:"nofile"];var c=null;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="CV12 tres decisoes")c=it;}
o.push(c.width+"x"+c.height+" "+c.frameRate+" "+c.duration);
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j),p=L.property("ADBE Transform Group").property("ADBE Position");var s=j+" "+L.name+" 3d="+L.threeDLayer+" in="+L.inPoint.toFixed(2)+" out="+L.outPoint.toFixed(2)+" par="+(L.parent?L.parent.name:"-");
try{s+=" pos="+(p.numKeys?("keys:"+p.numKeys+" k1="+p.keyValue(1)+" @"+p.keyTime(1)+(p.numKeys>1?" k2="+p.keyValue(2)+" @"+p.keyTime(2):"")):p.value);}catch(e){}
o.push(s);}
return JSON.stringify({status:"success",o:o});})();
