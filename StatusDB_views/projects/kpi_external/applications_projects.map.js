function(doc) {
  if(doc["source"] == "lims" && doc["details"]["type"] == "Production") {
	/* skip some bad apples */
	if(doc["application"] == null) { exit; }
	if(doc["application"].indexOf("bogus") != -1) { exit; }

        var od = doc["open_date"];
        var ad = doc["details"]["aborted"];
        if (od == ad) { exit; } // omit aborted projects that were never opened
	/* emit application & project id */
	emit(doc["application"], [doc["project_id"], od]);
  }
}
