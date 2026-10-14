// Restore G25's text layers from the backup .aep (camera, null and background are untouched).
(function () {
    var cur = null; for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === "G25" && it.parentFolder === app.project.rootFolder || (it instanceof CompItem && it.name === "G25" && !cur)) cur = it; }
    var curId = cur.id;
    var io = new ImportOptions(new File("C:/Users/lolo/Downloads/Motions (backup antes Claude G21-G22).aep"));
    var folder = app.project.importFile(io);
    function find(f) { for (var k = 1; k <= f.numItems; k++) { var x = f.item(k); if (x instanceof CompItem && x.name === "G25") return x; if (x instanceof FolderItem) { var r = find(x); if (r) return r; } } return null; }
    var src = find(folder);
    for (var q = 1; q <= app.project.numItems; q++) if (app.project.item(q).id === curId) cur = app.project.item(q);
    var removed = 0;
    for (var j = cur.numLayers; j >= 1; j--) { var L = cur.layer(j); if (L instanceof TextLayer || (L instanceof ShapeLayer && /^Box/.test(L.name))) { L.locked = false; L.remove(); removed++; } }
    var copied = [];
    for (var s = src.numLayers; s >= 1; s--) { var S = src.layer(s); if (S instanceof TextLayer) { S.copyToComp(cur); copied.push(S.name); } }
    var cam = null, nul = null;
    for (var m = 1; m <= cur.numLayers; m++) { var M = cur.layer(m); if (M instanceof CameraLayer) cam = M; if (M.name === "Null 1") nul = M; }
    cam.moveToBeginning(); nul.moveToBeginning();
    folder.remove();
    var out = []; for (var z = 1; z <= cur.numLayers; z++) out.push(z + " " + cur.layer(z).name.substr(0, 30));
    return JSON.stringify({ status: "success", removed: removed, copied: copied.length, layers: out });
})();
