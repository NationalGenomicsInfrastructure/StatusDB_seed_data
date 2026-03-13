/**
 * reads/per_lane
 */
function(doc) {
//  var lanes = doc["illumina"]["run_summary"];
  var num_lanes = 0;
//  for (l in lanes) {
//    num_lanes++;
//  }

  var date = doc["RunParameters"]["RunStartDate"];
  var mode = doc["RunParameters"]["RunMode"];
  if(mode == null && doc["RunParameters"]["SampleSheetFolder"].indexOf("MiSeq") != -1) {
    mode = "MiSeq";
  }
  if (mode == "HighOutput") {
    num_lanes = 8;
  } else if (mode == "RapidRun") {
    num_lanes = 2;
  } else if (mode == "MiSeq") {
    num_lanes = 1;
  }
  emit([date, mode, doc["RunInfo"]["Id"]],num_lanes);
//  emit([date, mode, doc["RunInfo"]["Id"]],lanes);

//  for (l in lanes) {
//    var reads = doc["illumina"]["run_summary"][l]["Clusters PF R1"];
//    var mode = doc["RunParameters"]["RunMode"];
//    if(mode == null && doc["RunParameters"]["SampleSheetFolder"].indexOf("MiSeq") != -1) {
//      mode = "MiSeq";
//    }
//    emit([mode, doc["RunInfo"]["Id"], l],reads);
//  }

}
