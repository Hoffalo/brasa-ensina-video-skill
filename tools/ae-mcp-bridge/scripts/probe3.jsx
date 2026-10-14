// On a throwaway duplicate: set a box-type TextDocument onto a point layer and see if it converts.
(function () {
    var o = {};
    var comp = null;
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === "G5 Copy 5") { comp = it; break; } }
    var dup = comp.layer(5).duplicate();
    var tmp = null;
    try {
        var prop = dup.property("ADBE Text Properties").property("ADBE Text Document");
        var od = prop.value;
        tmp = comp.layers.addBoxText([1200, 300], od.text);
        var bd = tmp.property("ADBE Text Properties").property("ADBE Text Document").value;
        o.tmpBox = bd.boxText;
        prop.setValue(bd);
        var nd = prop.value;
        o.dupNowBox = nd.boxText;
        if (nd.boxText) o.size = String(nd.boxTextSize);
        o.lang = app.isoLanguage;
    } catch (e) { o.err = String(e) + " line " + e.line; }
    if (tmp) tmp.remove();
    dup.remove();
    return JSON.stringify(o);
})();
