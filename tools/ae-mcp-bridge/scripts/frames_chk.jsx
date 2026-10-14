(function(){
  var shots={"G1 Copy 4":[6.4],"G5 Copy 2":[2.6]}; var dir=Folder.myDocuments.fsName+"/ae-mcp-bridge/frames/"; var s=[];
  for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && shots[it.name]){ for(var k=0;k<shots[it.name].length;k++){ var f=new File(dir+"chk_"+it.name.replace(/ /g,"_")+"_"+shots[it.name][k]+".png"); it.saveFrameToPng(shots[it.name][k],f); s.push(f.name);} } }
  return JSON.stringify({status:"success",saved:s});
})();
