function(doc) {
  if(doc["source"] != "lims") { exit; }
  if(doc["open_date"] < "2013-07-01") { exit; }
  if(doc["application"] == "bogus1") { exit; }
  if(doc["application"] == null) { exit; }
  emit([
         doc["details"]["type"],
         doc["details"]["sequencing_platform"],
         doc["application"]
       ], 
       doc["details"]["sequence_units_ordered_(lanes)"]
      );
}