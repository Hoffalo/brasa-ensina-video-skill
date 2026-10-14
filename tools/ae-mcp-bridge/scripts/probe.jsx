(function () {
    var o = { version: app.version };
    var names = ["Convert to Paragraph Text", "Convert To Paragraph Text", "Convert to Point Text"];
    o.cmds = {};
    for (var i = 0; i < names.length; i++) { try { o.cmds[names[i]] = app.findMenuCommandId(names[i]); } catch (e) { o.cmds[names[i]] = String(e); } }
    // Check whether CharacterRange is writable and which fonts exist
    try {
        var f = app.fonts.getFontsByPostScriptName("Lato-Regular"); o.latoRegular = f.length;
        var f2 = app.fonts.getFontsByPostScriptName("Lato-Italic"); o.latoItalic = f2.length;
    } catch (e) { o.fontErr = String(e); }
    return JSON.stringify(o);
})();
