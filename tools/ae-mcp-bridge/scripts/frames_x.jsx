(function(){
  var shots=$.global.MCP_SHOTS, tag=$.global.MCP_TAG||"x", dir=Folder.myDocuments.fsName+"/ae-mcp-bridge/frames/", s=[];
  for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && shots.hasOwnProperty(it.name)){
    for(var k=0;k<shots[it.name].length;k++){ var f=new File(dir+tag+"_"+it.name.replace(/ /g,"_")+"_"+shots[it.name][k]+".png"); it.saveFrameToPng(shots[it.name][k],f); s.push(f.name);} } }
  return JSON.stringify({status:"success",n:s.length});
})();
