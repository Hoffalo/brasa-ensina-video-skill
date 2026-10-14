(function(){var c,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name.indexOf("G45")===0)c=it;}
function g(v){if(v instanceof Array){var a=[];for(var q=0;q<v.length;q++)a.push(Math.round(v[q]*100)/100);return "["+a.join(",")+"]";}if(typeof v==="number")return ""+Math.round(v*100)/100;return ""+v;}
function walk(P,pre,depth){for(var q=1;q<=P.numProperties;q++){var p;try{p=P.property(q);}catch(e){continue;}
if(p.propertyType===PropertyType.PROPERTY){var s=null;try{var nk=p.numKeys,ex=p.expressionEnabled;if(nk>0){s=pre+p.name+": ";for(var k=1;k<=nk;k++)s+=Math.round(p.keyTime(k)*100)/100+"="+g(p.keyValue(k))+" ";}else if(ex){s=pre+p.name+" EXPR: "+p.expression.replace(/\s+/g," ").substr(0,200);}else if(p.isModified&&p.propertyValueType!==PropertyValueType.NO_VALUE&&p.propertyValueType!==PropertyValueType.CUSTOM_VALUE&&p.propertyValueType!==PropertyValueType.SHAPE){s=pre+p.name+"="+g(p.value);}}catch(e){}if(s)out.push(s);}
else{var nm=p.name;try{if(p.numProperties&&depth<8)walk(p,pre+nm+"/",depth+1);}catch(e){}}}}
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!/Glob|Meridian|Paralel|Pin|Disco/i.test(L.name))continue;
out.push("== "+j+" "+L.name+" type="+(L instanceof ShapeLayer?"shape":L.nullLayer?"null":L instanceof TextLayer?"text":"av")+" 3d="+L.threeDLayer+" par="+(L.parent?L.parent.name:"-")+" in="+Math.round(L.inPoint*100)/100+" out="+Math.round(L.outPoint*100)/100);
walk(L,"  ",0);}
out.push("comp "+c.name+" "+c.width+"x"+c.height+" dur="+c.duration);
return JSON.stringify({status:"success",o:out});})();
