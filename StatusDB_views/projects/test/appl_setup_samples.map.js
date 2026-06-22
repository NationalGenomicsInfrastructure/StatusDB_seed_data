function(doc) {
  if(doc["source"] != "lims") { exit; }
  if(doc["open_date"] < "2013-07-01") { exit; }
  if(doc["application"] == "bogus1") { exit; }
  if(doc["application"] == null) { exit; }
  var samples = doc["samples"];
  var numS = 0;
  for(s in samples) { numS++; }
  emit([
         doc["details"]["type"],
         doc["details"]["sequencing_platform"],
         doc["application"]
       ], 
        numS
      );
}