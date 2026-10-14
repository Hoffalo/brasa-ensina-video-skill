// G35: join Box 1 and the Ano table into one box that grows with the table reveal; table outer border off;
// a separator line where the box bottom was. Screen->world on Box 1's plane: k = 0.524, origin (159,435)->(886.9,-225.1).
(function(){var c=null,o=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="G35")c=it;}
function L(n){for(var j=1;j<=c.numLayers;j++)if(c.layer(j).name===n)return c.layer(j);return null;}
var K=0.524,WX=function(sx){return 886.9+(sx-159)*K;},WY=function(sy){return -225.1+(sy-435)*K;};
var X0=122,X1=836,TOP=435,B0=714,BA=851,BB=1000;
var bx=L("Box 1"),grp=bx.property("ADBE Root Vectors Group").property("Box").property("ADBE Vectors Group"),rc=grp.property("ADBE Vector Shape - Rect");
var sz=rc.property("ADBE Vector Rect Size"),rp=rc.property("ADBE Vector Rect Position");
var cx=WX((X0+X1)/2),cy0=WY((TOP+B0)/2),w=(X1-X0)*K;
var lp=bx.property("ADBE Transform Group").property("ADBE Position"),lv=lp.value;lp.setValue([cx,cy0,lv[2]]);
function hb(b){return [w,(b-TOP)*K];} function yo(b){return [0,WY((TOP+b)/2)-cy0];}
while(sz.numKeys)sz.removeKey(1);while(rp.numKeys)rp.removeKey(1);
var T=[[0,B0],[4.933,B0],[5.8,BA],[7.117,BA],[7.833,BB]];
for(var k=0;k<T.length;k++){sz.setValueAtTime(T[k][0],hb(T[k][1]));rp.setValueAtTime(T[k][0],yo(T[k][1]));}
function ease(p){for(var q=1;q<=p.numKeys;q++){p.setTemporalEaseAtKey(q,[new KeyframeEase(0,100)],[new KeyframeEase(0,20)]);}}
try{ease(sz);}catch(e){} try{ease(rp);}catch(e){}
// table: outer border off, column line extended to the new bottom (2D layer: screen = 540 + y*0.9324 around its centre)
var tb=L("Shape Layer 1"),tv=tb.property("ADBE Root Vectors Group");
tv.property("Rectangle 1").enabled=false;
var r2=tv.property("Rectangle 2").property("ADBE Vectors Group").property("ADBE Vector Shape - Rect"),ext=(BB-991)/0.9324;
var s2=r2.property("ADBE Vector Rect Size").value;r2.property("ADBE Vector Rect Size").setValue([s2[0],s2[1]+ext]);
var p2=r2.property("ADBE Vector Rect Position").value;r2.property("ADBE Vector Rect Position").setValue([p2[0],p2[1]+ext/2]);
// separator: 2D line at the old box bottom, from 4.933 (it coincides with the bottom edge as the box starts to grow)
var sep=c.layers.addShape();sep.name="Separador";sep.moveBefore(tb);
var g=sep.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"),vc=g.property("ADBE Vectors Group");
var sh=vc.addProperty("ADBE Vector Shape - Group"),s=new Shape();s.vertices=[[X0,B0],[X1,B0]];s.closed=false;sh.property("ADBE Vector Shape").setValue(s);
var st=vc.addProperty("ADBE Vector Graphic - Stroke");st.property("ADBE Vector Stroke Color").setValue([1,0.8,0.01]);st.property("ADBE Vector Stroke Width").setValue(1.955/K);
sep.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0,0]);sep.property("ADBE Transform Group").property("ADBE Position").setValue([0,0]);
sep.inPoint=4.933;
var gl=bx.property("ADBE Effect Parade").property(1);if(gl){var ng=sep.property("ADBE Effect Parade").addProperty(gl.matchName);for(var q=1;q<=gl.numProperties;q++){try{ng.property(q).setValue(gl.property(q).value);}catch(e){}}}
app.project.save();return JSON.stringify({status:"success",o:["box w "+Math.round(w)+" cx "+Math.round(cx),"col ext "+Math.round(ext)]});})();
