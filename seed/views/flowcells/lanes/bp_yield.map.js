/**
 * Total yield per lane, takes the read length into account
 */
function(doc) {
  nreads = 0
  for (r in doc["RunInfo"]["Reads"]) {
    if (doc["RunInfo"]["Reads"][r]["IsIndexedRead"] === "N") {
      nreads += 1;
    }
  }
  var lanes = doc["illumina"]["run_summary"];
  for (l in lanes) {
    lane_yield = 0;
    for (var r=1; r<=nreads; r++) {
      y = doc["illumina"]["run_summary"][l]["Yield PF (Gb) R" + r.toString()];
      if (y == null) {
        y = 0;
      }
      lane_yield += y;
    }
    var mode = doc["RunParameters"]["RunMode"];
    if(mode == null && doc["RunParameters"]["SampleSheetFolder"].indexOf("MiSeq") != -1) {
      mode = "MiSeq";
    }
    emit([mode, doc["RunInfo"]["Id"], l],lane_yield*1e9);
  }
}
