(function(){ app.project.save(); return JSON.stringify({status:"success", file: app.project.file.fsName, dirty: app.project.dirty}); })();
