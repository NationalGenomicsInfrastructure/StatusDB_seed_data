function(doc) {
  var stats = doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"];
  for (sample in stats) {
    var stat = Object();
    stat["sample"] = stats[sample];
    stat["instrument"] = doc["RunInfo"]["Instrument"];
    stat["setup"] = doc["RunInfo"]["Reads"];

    emit([doc["name"], stat["sample"]["Lane"], stat["sample"]["Index"]], stat);
  };
};
