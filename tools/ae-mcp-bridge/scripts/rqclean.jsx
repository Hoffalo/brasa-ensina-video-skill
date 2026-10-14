(function(){ var rq=app.project.renderQueue, removed=0, tpl=[];
 for (var q=rq.numItems;q>=1;q--){ var R=rq.item(q); if (R.comp.name==="G25" && Math.abs(R.timeSpanStart-0.3)<0.01) { tpl=R.outputModule(1).templates; R.remove(); removed++; } }
 return JSON.stringify({status:"success",removed:removed,count:rq.numItems,templates:tpl}); })();
