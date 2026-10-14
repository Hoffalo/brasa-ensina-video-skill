// Deep dump of a comp: layers, text styles, shapes, effects (non-default-ish params), every keyframe with eases.
(function(){var cfg=$.global.X,c=null,out=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name===cfg.comp)c=it;}
function r(v){if(v instanceof Array){var a=[];for(var i=0;i<v.length;i++)a.push(Math.round(v[i]*100)/100);return "["+a.join(",")+"]";}if(typeof v==="number")return String(Math.round(v*1000)/1000);try{return String(v).substr(0,30);}catch(e){return "?";}}
function keys(p,path){var s=[];for(var k=1;k<=p.numKeys;k++){var ie=p.keyInTemporalEase(k),oe=p.keyOutTemporalEase(k);var it2=p.keyInInterpolationType(k)==KeyframeInterpolationType.HOLD?"H":"";
 s.push(r(p.keyTime(k))+"="+(p.matchName==="ADBE Text Document"?("'"+p.keyValue(k).text.substr(0,20)+"'"):r(p.keyValue(k)))+" e"+Math.round(ie[0].influence)+"/"+Math.round(oe[0].influence)+it2);}
 return "    K "+path+": "+s.join(" | ");}
function walk(g,path,L){for(var q=1;q<=g.numProperties;q++){var p;try{p=g.property(q);}catch(e){continue;}var pp=path+"/"+p.name;
 if(p.propertyType===PropertyType.PROPERTY){try{if(p.numKeys>0)out.push(keys(p,pp));else if(p.expressionEnabled)out.push("    X "+pp+": "+p.expression.substr(0,120));}catch(e){}}
 else{try{if(p.numProperties)walk(p,pp,L);}catch(e){}}}}
out.push(c.name+" "+c.width+"x"+c.height+" "+r(c.duration)+"s fps"+r(c.frameRate)+" bg "+r(c.bgColor));
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j),t=L instanceof TextLayer?"TXT":L instanceof ShapeLayer?"SHP":L instanceof CameraLayer?"CAM":L.nullLayer?"NUL":"AV";
 var tg=L.property("ADBE Transform Group"),s="#"+j+" ["+t+"] "+L.name+(L.enabled?"":" (off)")+" in"+r(L.inPoint)+" out"+r(L.outPoint)+(L.threeDLayer?" 3D":"")+(L.parent?" parent="+L.parent.name:"")+" blend="+L.blendingMode;
 try{s+=" pos"+r(tg.property("ADBE Position").value)+" sc"+r(tg.property("ADBE Scale").value)+" anch"+r(tg.property("ADBE Anchor Point").value)+" op"+r(tg.property("ADBE Opacity").value);}catch(e){}
 if(L.source&&!(L instanceof TextLayer))try{s+=" src="+L.source.name.substr(0,40)+" "+L.source.width+"x"+L.source.height;}catch(e){}
 out.push(s);
 if(L instanceof TextLayer){var d=L.property("ADBE Text Properties").property("ADBE Text Document").value;
  out.push("    T '"+d.text.replace(/[\r\n\u0003]/g,"/").substr(0,90)+"' font="+d.font+" size="+r(d.fontSize)+" fill="+r(d.fillColor)+" just="+d.justification+" track="+d.tracking+" lead="+r(d.leading)+(d.boxText?" box"+r(d.boxTextSize):"")+(d.applyStroke?" stroke"+r(d.strokeColor)+"/"+d.strokeWidth:""));
  try{var tl=d.text.length,runs=[],prev="";for(var ci=0;ci<tl;ci++){var cs=d.characterRange(ci,ci+1);var k=cs.font+"|"+r(cs.fillColor)+"|"+r(cs.fontSize);if(k!==prev){runs.push(ci+":"+k);prev=k;}}if(runs.length>1)out.push("    R "+runs.join("  "));}catch(e){}}
 if(L instanceof ShapeLayer){(function sw(g,ind){for(var q=1;q<=g.numProperties;q++){var p=g.property(q);if(!p)continue;var m=p.matchName;
   if(m==="ADBE Vector Shape - Rect")out.push(ind+"rect size"+r(p.property("ADBE Vector Rect Size").value)+" round"+r(p.property("ADBE Vector Rect Roundness").value)+" pos"+r(p.property("ADBE Vector Rect Position").value));
   else if(m==="ADBE Vector Shape - Ellipse")out.push(ind+"ellipse "+r(p.property("ADBE Vector Ellipse Size").value));
   else if(m==="ADBE Vector Shape - Group")out.push(ind+"path");
   else if(m==="ADBE Vector Graphic - Fill")out.push(ind+"fill "+r(p.property("ADBE Vector Fill Color").value)+" op"+r(p.property("ADBE Vector Fill Opacity").value));
   else if(m==="ADBE Vector Graphic - Stroke")out.push(ind+"stroke "+r(p.property("ADBE Vector Stroke Color").value)+" w"+r(p.property("ADBE Vector Stroke Width").value));
   else if(m==="ADBE Vector Filter - Trim")out.push(ind+"trim s"+r(p.property(1).value)+" e"+r(p.property(2).value)+" o"+r(p.property(3).value));
   else if(m==="ADBE Vector Filter - Repeater")out.push(ind+"repeater copies"+r(p.property(1).value));
   else if(m==="ADBE Vector Group"){out.push(ind+"group '"+p.name+"' sc"+r(p.property("ADBE Vector Transform Group").property("ADBE Vector Scale").value));sw(p.property("ADBE Vectors Group"),ind+"  ");}
   }})(L.property("ADBE Root Vectors Group"),"    S ");}
 var fx=L.property("ADBE Effect Parade");if(fx)for(var e=1;e<=fx.numProperties;e++){var f=fx.property(e),ps=[];for(var q2=1;q2<=Math.min(f.numProperties,14);q2++){try{var v=f.property(q2).value;if(v!==undefined&&v!==null)ps.push(f.property(q2).name.substr(0,14)+"="+r(v));}catch(x){}}out.push("    FX "+f.matchName+" "+f.name+": "+ps.join("; "));}
 walk(L,"",L);}
return JSON.stringify({status:"success",o:out});})();
