/**
 * Total yield per flowcell, based on Demultiplex counts, taking read length into account
 */
function(doc) {
  tot = 0;
  for (s in doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"]) {
    y = doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"][s]["Yield (Mbases)"];
    if (y == null) {
      y = "0";
    }
    tot += parseInt(y.replace(",",""))*1e6;
  }
  emit([doc["RunParameters"]["RunMode"],doc["RunInfo"]["Date"],doc["RunInfo"]["Id"]],tot);
}
