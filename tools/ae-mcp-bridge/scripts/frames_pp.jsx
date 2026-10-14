(function(){
  var shots={"g5 copy 2":[6,10,24,30,35],"G26":[4,8,11.5],"G27":[4,10,16,24],"G28":[4.5],"G29":[3,9,14,20],"G30":[26,30,33],"G31":[5.5],"G33":[3,8],"G34":[5,11],"G35":[4,11,17],"G36":[3,7,10],"G1 Copy 10":[5,12,20,24],"G37":[4,10]};
  var tag=$.global.MCP_TAG||"pp", dir=Folder.myDocuments.fsName+"/ae-mcp-bridge/frames/", s=[];
  for (var i=1;i<=app.project.numItems;i++){var it=app.project.item(i); if(it instanceof CompItem && shots.hasOwnProperty(it.name)){
    if ($.global.MCP_ONLY && ("|"+$.global.MCP_ONLY.join("|")+"|").indexOf("|"+it.name+"|")<0) continue;
    for(var k=0;k<shots[it.name].length;k++){ var f=new File(dir+tag+"_"+it.name.replace(/ /g,"_")+"_"+shots[it.name][k]+".png"); it.saveFrameToPng(shots[it.name][k],f); s.push(f.name);} } }
  return JSON.stringify({status:"success",n:s.length});
})();
