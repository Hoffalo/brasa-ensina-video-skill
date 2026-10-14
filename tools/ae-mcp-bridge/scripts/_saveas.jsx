(function(){var f=new File("C:/Users/lolo/Documents/Projetos/BRASA/BRASA Ensina/Bolsas EUA BE/Bolsas EUA BE/cv Motions (Claude edits).aep");
app.project.save(f);var n=[];for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&/^G3[89]m/.test(it.name))n.push(it.name);}
return JSON.stringify({status:"success",file:app.project.file.fsName,found:n});})();
