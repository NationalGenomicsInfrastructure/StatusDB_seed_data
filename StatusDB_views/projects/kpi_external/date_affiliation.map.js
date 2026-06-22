function(doc) {
  if(doc["details"]["type"] != "Production") { exit; }
  if(doc["source"] != "lims") { exit; }
  if(doc["application"] == null) { exit; }
  if(doc["application"].indexOf("bogus") != -1) { exit; }

  var od = doc["open_date"];
  if (od == null) { exit; }
  var ad = doc["details"]["aborted"];
  if (od == ad) { exit; } // omit aborted projects that were never opened
  emit([od,doc["affiliation"]], doc["project_id"]);
}
