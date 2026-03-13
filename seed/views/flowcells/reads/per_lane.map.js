/**
 * reads/per_lane
 */
function(doc) {
  var lanes = doc["illumina"]["run_summary"];
  for (l in lanes) {
    var reads = doc["illumina"]["run_summary"][l]["Clusters PF R1"];
    var mode = doc["RunParameters"]["RunMode"];
    if(mode == null && doc["RunParameters"]["SampleSheetFolder"].indexOf("MiSeq") != -1) {
      mode = "MiSeq";
    }
    emit([mode, doc["RunInfo"]["Id"], l],reads);
  }
}
