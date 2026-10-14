// Import comps from another .aep into the open project, keep only them + their dependencies, rename.
// $.global.MG = {file, comps:[[srcName, newName],...]}
(function(){var cfg=$.global.MG,o=[];var before={};for(var i=1;i<=app.project.numItems;i++)before[app.project.item(i).id]=1;
var fld=app.project.importFile(new ImportOptions(new File(cfg.file)));
var newItems=[];for(var i2=1;i2<=app.project.numItems;i2++){var it=app.project.item(i2);if(!before[it.id])newItems.push(it);}
var keep={},want=[];
function dep(c){if(keep[c.id])return;keep[c.id]=1;if(c instanceof CompItem){for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);try{if(L.source)dep(L.source);}catch(e){}}}}
for(var a=0;a<cfg.comps.length;a++){var hit=null;for(var b=0;b<newItems.length;b++)if(newItems[b] instanceof CompItem&&newItems[b].name===cfg.comps[a][0])hit=newItems[b];if(!hit){o.push("missing "+cfg.comps[a][0]);continue;}dep(hit);want.push([hit,cfg.comps[a][1]]);}
var rm=0;for(var c2=newItems.length-1;c2>=0;c2--){var x=newItems[c2];if(x instanceof FolderItem)continue;if(!keep[x.id]){try{x.remove();rm++;}catch(e){}}}
for(var w=0;w<want.length;w++){want[w][0].name=want[w][1];want[w][0].parentFolder=app.project.rootFolder;o.push("kept "+want[w][1]);}
// drop empty imported folders
for(var r=0;r<5;r++){for(var c3=app.project.numItems;c3>=1;c3--){var f=app.project.item(c3);if(f instanceof FolderItem&&!before[f.id]&&f.numItems===0)f.remove();}}
app.project.save();return JSON.stringify({status:"success",removed:rm,o:o});})();
