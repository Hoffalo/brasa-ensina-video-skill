(function(){var c=null;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G35")c=it;}
var L=null;for(var j=1;j<=c.numLayers;j++)if(c.layer(j).name==="Shape Layer 1")L=c.layer(j);
var m=L.property("ADBE Mask Parade").property(1).property("ADBE Mask Shape"),o=[];
var ts=[4.933,5.8,7.117,7.833];for(var k=0;k<ts.length;k++){var v=m.valueAtTime(ts[k],false).vertices,ys=[];for(var q=0;q<v.length;q++)ys.push(Math.round(v[q][1]));o.push(ts[k]+": "+ys.join(","));}
var g=L.property("ADBE Root Vectors Group"),gs=[];for(var q2=1;q2<=g.numProperties;q2++){var G=g.property(q2),tr=G.property("ADBE Vector Transform Group");gs.push(G.name+" pos "+tr.property("ADBE Vector Position").value+" en "+G.enabled);
 var vc=G.property("ADBE Vectors Group");for(var z=1;z<=vc.numProperties;z++){var P=vc.property(z);gs.push("   "+P.matchName+" en "+P.enabled+(P.matchName==="ADBE Vector Graphic - Fill"?" op "+P.property("ADBE Vector Fill Opacity").value:""));}}
return JSON.stringify({status:"success",mask:o,groups:gs,mode:L.property("ADBE Mask Parade").property(1).maskMode});})();
