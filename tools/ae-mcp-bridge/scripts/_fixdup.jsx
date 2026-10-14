(function(){var c=null;for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==="CV12 cv da Ana")c=it;}var o=[];
var pages=[],rigs=[];for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(L.name==="CV pagina")pages.push(L);if(L.name==="Card rig")rigs.push(L);}
o.push("pages "+pages.length+" rigs "+rigs.length);
if(pages.length===2){var nw=pages[0],old=pages[1];for(var j2=1;j2<=c.numLayers;j2++){var L2=c.layer(j2);if(L2.parent===nw){L2.parent=old;o.push("repar "+L2.name);}}nw.remove();}
if(rigs.length===2){rigs[0].remove();}
var sp=null;for(var j3=1;j3<=c.numLayers;j3++)if(c.layer(j3).name==="Spotlight")sp=c.layer(j3);var pg=null;for(var j4=1;j4<=c.numLayers;j4++)if(c.layer(j4).name==="CV pagina")pg=c.layer(j4);sp.moveBefore(pg);
for(var j5=1;j5<=c.numLayers;j5++)o.push(j5+" "+c.layer(j5).name+(c.layer(j5).parent?" <"+c.layer(j5).parent.name:""));
return JSON.stringify({status:"success",o:o});})();
