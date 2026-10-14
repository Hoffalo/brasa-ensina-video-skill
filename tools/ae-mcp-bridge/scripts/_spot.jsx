(function(){var c=null;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="CV12 cv da Ana")c=it;}
var L=null;for(var j=1;j<=c.numLayers;j++)if(c.layer(j).name==="Spotlight")L=c.layer(j);var mp=L.property("ADBE Mask Parade").property(1).property("ADBE Mask Shape");
function rr(R){var s=new Shape();s.vertices=[[R[0],R[1]],[R[2],R[1]],[R[2],R[3]],[R[0],R[3]]];s.closed=true;return s;}
var a=mp.valueAtTime(10.7,false);mp.setValueAtTime(10.75,a);var t=mp.valueAtTime(10.75,false);
var s=new Shape();var v=[];var cx=837.777778,cy=1335.555556;for(var k=0;k<a.vertices.length;k++)v.push([cx+(a.vertices[k][0]-cx)*0.01,cy+(a.vertices[k][1]-cy)*0.01]);s.vertices=v;s.inTangents=a.inTangents;s.outTangents=a.outTangents;s.closed=true;
for(var k2=0;k2<s.inTangents.length;k2++){s.inTangents[k2]=[a.inTangents[k2][0]*0.01,a.inTangents[k2][1]*0.01];s.outTangents[k2]=[a.outTangents[k2][0]*0.01,a.outTangents[k2][1]*0.01];}
mp.setValueAtTime(11.05,s);mp.setValueAtTime(20.85,s);
var o=[];for(var k3=1;k3<=mp.numKeys;k3++)o.push(mp.keyTime(k3).toFixed(2));return JSON.stringify({status:"success",o:o});})();