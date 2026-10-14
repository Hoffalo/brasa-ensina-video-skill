(function(){
  function comp(n){ for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && it.name===n) return it;} }
  function layer(c, pre){ for (var j=1;j<=c.numLayers;j++){ if (c.layer(j).name.indexOf(pre)===0) return c.layer(j);} }
  function realign(L, before){ var after=L.sourceRectAtTime(0,false); var a=L.property("ADBE Transform Group").property("ADBE Anchor Point"), v=a.value; v[0]+=after.left-before.left; v[1]+=after.top-before.top; a.setValue(v); }
  var out={};
  // 1) restore All Caps on the G1 Copy 4 title
  var L=layer(comp("G1 Copy 4"),"apostilamento"), p=L.property("ADBE Text Properties").property("ADBE Text Document"), d=p.value;
  var b=L.sourceRectAtTime(0,false);
  d.fontCapsOption=FontCapsOption.FONT_ALL_CAPS;
  p.setValue(d); realign(L,b);
  out.caps = p.value.fontCapsOption + " w=" + Math.round(L.sourceRectAtTime(0,false).width);
  // 2) restore line breaks in the hidden G20 number list
  var N=layer(comp("G20"),"1.2.3.4."), q=N.property("ADBE Text Properties").property("ADBE Text Document"), e2=q.value;
  var b2=N.sourceRectAtTime(0,false);
  e2.text=e2.text.replace(/\u0003/g,"\r"); e2.boxTextSize=[e2.fontSize*3, e2.boxTextSize[1]];
  q.setValue(e2); realign(N,b2);
  out.list = JSON.stringify(q.value.text) + " w=" + Math.round(N.sourceRectAtTime(0,false).width) + " h=" + Math.round(N.sourceRectAtTime(0,false).height);
  out.status="success";
  return JSON.stringify(out);
})();
