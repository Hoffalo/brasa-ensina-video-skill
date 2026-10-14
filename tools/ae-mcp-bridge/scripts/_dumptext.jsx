(function(){var cfg=$.global.X,o=[];for(var i=1;i<=app.project.numItems;i++){var c=app.project.item(i);if(!(c instanceof CompItem))continue;var ok=false;for(var k=0;k<cfg.comps.length;k++)if(cfg.comps[k]===c.name)ok=true;if(!ok)continue;
o.push("== "+c.name+" "+c.width+"x"+c.height+" "+c.duration.toFixed(1)+"s");
for(var j=1;j<=c.numLayers;j++){var L=c.layer(j),s=j+" "+L.name+(L.enabled?"":" [off]")+(L.threeDLayer?" 3D":"")+" in="+L.inPoint.toFixed(2)+" out="+L.outPoint.toFixed(2);
if(L instanceof TextLayer){var d=L.property("ADBE Text Properties").property("ADBE Text Document").value;s+=" TXT["+d.font+" "+Math.round(d.fontSize)+(d.boxText?" box":"")+" j="+d.justification+"] "+d.text.replace(/[\r\n]+/g," / ").substr(0,160);}
else if(L instanceof AVLayer&&L.source)s+=" SRC="+L.source.name;
if(L instanceof CameraLayer){try{s+=" DOF="+L.property("ADBE Camera Options Group").property("ADBE Camera Depth of Field").value;}catch(e){}}
o.push(s);}}return JSON.stringify({status:"success",o:o});})();
