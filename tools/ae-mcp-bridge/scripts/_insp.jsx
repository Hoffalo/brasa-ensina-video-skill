(function(){
var want=$.global.INSP||[];var out=[];
function comp(n){for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==n)return it;}return null;}
for(var w=0;w<want.length;w++){var c=comp(want[w]);if(!c){out.push({name:want[w],missing:true});continue;}
 var L=[];for(var j=1;j<=c.numLayers;j++){var l=c.layer(j);var o={i:j,n:l.name,en:l.enabled,ip:Math.round(l.inPoint*100)/100,op:Math.round(l.outPoint*100)/100,p:l.parent?l.parent.index:0};
  try{o.d3=l.threeDLayer}catch(e){}
  if(l instanceof CameraLayer)o.t="cam";else if(l.nullLayer)o.t="null";else if(l instanceof TextLayer)o.t="text";else if(l instanceof ShapeLayer)o.t="shape";else if(l.source&&l.source instanceof CompItem)o.t="precomp:"+l.source.name;else o.t="av";
  if(o.t=="text"){try{var td=l.property("Source Text").value;o.txt=td.text.substr(0,90);o.font=td.font;o.fs=Math.round(td.fontSize);o.just=String(td.justification);var st=l.property("Source Text");o.stk=st.numKeys;}catch(e){}}
  try{var tr=l.property("ADBE Transform Group");var ks=[];for(var q=1;q<=tr.numProperties;q++){var pr=tr.property(q);if(pr.numKeys)ks.push(pr.name.substr(0,3)+":"+Math.round(pr.keyTime(1)*100)/100+"-"+Math.round(pr.keyTime(pr.numKeys)*100)/100+"("+pr.numKeys+")");}if(ks.length)o.k=ks.join(" ");}catch(e){}
  try{var fx=l.property("ADBE Effect Parade");if(fx&&fx.numProperties){var f=[];for(var q=1;q<=fx.numProperties;q++)f.push(fx.property(q).matchName.replace("ADBE ",""));o.fx=f.join(",");}}catch(e){}
  L.push(o);}
 out.push({name:c.name,w:c.width,h:c.height,dur:Math.round(c.duration*100)/100,fps:c.frameRate,layers:L});}
var f=new File("C:/Users/lolo/Documents/ae-mcp-bridge/insp.json");f.encoding="UTF-8";f.open("w");f.write(JSON.stringify(out));f.close();
return JSON.stringify({status:"success",n:out.length});})();
