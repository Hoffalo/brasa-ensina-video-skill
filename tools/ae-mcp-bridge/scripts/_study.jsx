(function(){var cfg=$.global.X,out={};function r(v){if(v instanceof Array){var a=[];for(var i=0;i<v.length;i++)a.push(Math.round(v[i]*10)/10);return a;}return typeof v==="number"?Math.round(v*100)/100:String(v).substr(0,40);}
for(var i=1;i<=app.project.numItems;i++){var c=app.project.item(i);if(!(c instanceof CompItem))continue;var ok=false;for(var k=0;k<cfg.comps.length;k++)if(cfg.comps[k]===c.name)ok=true;if(!ok)continue;
 var C={size:c.width+"x"+c.height,dur:r(c.duration),layers:[]};
 for(var j=1;j<=c.numLayers;j++){var L=c.layer(j),o={n:L.name.substr(0,40),en:L.enabled,ip:r(L.inPoint),op:r(L.outPoint)};
  if(L instanceof CameraLayer){o.type="cam";var co=L.property("ADBE Camera Options Group");o.zoom=r(co.property("ADBE Camera Zoom").value);o.dof=co.property("ADBE Camera Depth of Field").value;o.par=L.parent?L.parent.name:"-";}
  else if(L.nullLayer)o.type="null";else if(L instanceof TextLayer){o.type="text";var d=L.property("ADBE Text Properties").property("ADBE Text Document").value;o.font=d.font;o.size=Math.round(d.fontSize);o.txt=d.text.replace(/[\r\n]+/g," / ").substr(0,50);}
  else if(L instanceof ShapeLayer)o.type="shape";else o.type="av:"+(L.source?L.source.name.substr(0,25):"");
  o.d3=L.threeDLayer;if(L.parent)o.parent=L.parent.name;
  var keyed={};
  (function walk(g,path){for(var q=1;q<=g.numProperties;q++){var p;try{p=g.property(q);}catch(e){continue;}
    if(p.propertyType===PropertyType.PROPERTY){try{if(p.numKeys>0){var ks=[];for(var kk=1;kk<=Math.min(p.numKeys,8);kk++){var e1="";try{e1=Math.round(p.keyOutTemporalEase(kk)[0].influence)+"/"+Math.round(p.keyInTemporalEase(kk)[0].influence);}catch(e){}ks.push([r(p.keyTime(kk)),r(p.keyValue(kk)),e1]);}keyed[(path+"/"+p.name).substr(-45)]=ks;}else if(p.expressionEnabled&&p.expression)keyed[(path+"/"+p.name).substr(-45)+" EXPR"]=p.expression.substr(0,80);}catch(e){}}
    else{try{if(p.numProperties)walk(p,path+"/"+p.name);}catch(e){}}}})(L,"");
  o.keys=keyed;
  try{var tg=L.property("ADBE Transform Group");o.pos=r(tg.property("ADBE Position").value);o.sc=r(tg.property("ADBE Scale").value);}catch(e){}
  var fx=L.property("ADBE Effect Parade"),fl=[];if(fx)for(var f=1;f<=fx.numProperties;f++)fl.push(fx.property(f).name);if(fl.length)o.fx=fl;
  C.layers.push(o);}
 out[c.name]=C;}
var f2=new File("C:/Users/lolo/Documents/ae-mcp-bridge/study_pb.json");f2.encoding="UTF-8";f2.open("w");f2.write(JSON.stringify(out));f2.close();
return JSON.stringify({status:"success",n:1});})();
