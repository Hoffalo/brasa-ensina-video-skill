(function(){var c=null;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G35")c=it;}
var tb=null;for(var j=1;j<=c.numLayers;j++)if(c.layer(j).name==="Shape Layer 1")tb=c.layer(j);var o=[];
function v(p){try{return String(p.value);}catch(e){return "ERR("+e.toString()+")";}}
var root=tb.property("ADBE Root Vectors Group");for(var q=1;q<=root.numProperties;q++){var g=root.property(q),tr=g.property("ADBE Vector Transform Group");
 o.push(g.name+" gpos="+v(tr.property("ADBE Vector Position"))+" gscale="+v(tr.property("ADBE Vector Scale"))+" ganch="+v(tr.property("ADBE Vector Anchor")));
 var r=g.property("ADBE Vectors Group").property("ADBE Vector Shape - Rect");if(r){o.push("  size "+v(r.property("ADBE Vector Rect Size"))+" pos "+v(r.property("ADBE Vector Rect Position")));}}
return JSON.stringify({status:"success",o:o});})();
