// Inventory of text layers: comp, layer, box/point, justification, line count, font, size, text start.
(function(){var cfg=$.global.X,o=[];var J={};J[ParagraphJustification.LEFT_JUSTIFY]="L";J[ParagraphJustification.CENTER_JUSTIFY]="C";J[ParagraphJustification.RIGHT_JUSTIFY]="R";
J[ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT]="JL";J[ParagraphJustification.FULL_JUSTIFY_LASTLINE_CENTER]="JC";J[ParagraphJustification.FULL_JUSTIFY_LASTLINE_RIGHT]="JR";J[ParagraphJustification.FULL_JUSTIFY_LASTLINE_FULL]="JF";
for(var i=1;i<=app.project.numItems;i++){var c=app.project.item(i);if(!(c instanceof CompItem))continue;var ok=false;for(var a=0;a<cfg.comps.length;a++)if(cfg.comps[a]===c.name)ok=true;if(!ok)continue;
 for(var j=1;j<=c.numLayers;j++){var L=c.layer(j);if(!(L instanceof TextLayer))continue;var d=L.property("ADBE Text Properties").property("ADBE Text Document").value;
  var lines=d.text.split(/[\r\n\u0003]/).length;var r=L.sourceRectAtTime(c.duration/2,false);
  o.push([c.name,j,L.name.substr(0,26),L.enabled?"on":"off",d.boxText?"BOX":"pt",J[d.justification]||d.justification,lines,d.font,Math.round(d.fontSize),Math.round(r.height/Math.max(1,d.fontSize*1.2)),d.text.replace(/[\r\n\u0003]/g,"/").substr(0,50)].join(" | "));}}
return JSON.stringify({status:"success",o:o});})();
