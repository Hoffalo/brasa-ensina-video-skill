(function(){
  var shots={"G5 Copy 2":[8],"G5 Copy 4":[13],"G17":[4.5],"g16 copy 2":[7,11],"g16 copy 3":[1.5,6,10,13],"G1 Copy 3":[6],"G1 Copy 9":[6]}; var dir=Folder.myDocuments.fsName+"/ae-mcp-bridge/frames/"; var s=[];
  for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && shots[it.name]){ for(var k=0;k<shots[it.name].length;k++){ var f=new File(dir+"rev_"+it.name.replace(/ /g,"_")+"_"+shots[it.name][k]+".png"); it.saveFrameToPng(shots[it.name][k],f); s.push(f.name);} } }
  return JSON.stringify({status:"success",saved:s});
})();
