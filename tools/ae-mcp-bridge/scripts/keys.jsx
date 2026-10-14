(function(){ var names=["g5 copy 2","G26","G27","G29","G30","G33","G34","G35","G36","G1 Copy 10","G37"], o={};
 for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(!(it instanceof CompItem)) continue; if(("|"+names.join("|")+"|").indexOf("|"+it.name+"|")<0) continue;
  var ks=[]; for (var j=1;j<=it.numLayers;j++){ var L=it.layer(j); if(/^Null/.test(L.name)){ var p=L.property("ADBE Transform Group").property("ADBE Position"); for(var k=1;k<=p.numKeys;k++) ks.push(Math.round(p.keyTime(k)*100)/100);} }
  var d3=[]; for (var j2=1;j2<=it.numLayers;j2++){ if(it.layer(j2).threeDLayer) d3.push(j2);} o[it.name]={camKeys:ks, threeD:d3.join(",")}; }
 return JSON.stringify(o); })();
