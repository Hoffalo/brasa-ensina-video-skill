(function(){
var f=new File("C:/Users/lolo/Documents/Projetos/BRASA/BRASA Ensina/Motions.aep");
var io=new ImportOptions(f);io.importAs=ImportAsType.PROJECT;
var fld=app.project.importFile(io);
fld.name="_import shared Motions";
// find G38/G39 inside the imported folder
function walk(folder,acc){for(var i=1;i<=folder.numItems;i++){var it=folder.item(i);if(it instanceof FolderItem)walk(it,acc);else acc.push(it);}return acc;}
var all=walk(fld,[]);var keep={};var res=[];
function mark(c){if(keep[c.id])return;keep[c.id]=1;for(var j=1;j<=c.numLayers;j++){var l=c.layer(j);if(l.source){keep[l.source.id]=1;if(l.source instanceof CompItem)mark(l.source);}}}
var g={};for(var i=0;i<all.length;i++){var it=all[i];if(it instanceof CompItem&&(it.name=="G38"||it.name=="G39")){g[it.name]=it;mark(it);}}
g.G38.name="G38m tipos de bolsa";g.G39.name="G39m need-blind";
var del=0;for(var i=all.length-1;i>=0;i--){if(!keep[all[i].id]){all[i].remove();del++;}}
return JSON.stringify({status:"success",deleted:del,kept:all.length-del});})();
