/*
 Used by genomics-status at:
  /api/v1/flowcell_q30/:id,
  /api/v1/plot/q30.png
*/

function(doc) {
  var stats = doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"];
  var instrument = doc["RunInfo"]["Instrument"]
  var runmode = doc["RunParameters"]["RunMode"]

  var setup = [];
  for (read in doc["RunInfo"]["Reads"]) {
    if (doc["RunInfo"]["Reads"][read]["IsIndexedRead"] === "N") {
      setup.push(+doc["RunInfo"]["Reads"][read]["NumCycles"]);
    }
  }

  for (sample in stats) {
    var q30 = stats[sample]["% of >= Q30 Bases (PF)"];

    emit([doc["name"], runmode, stats[sample]["Lane"], stats[sample]["Index"]],
         {"sum": +q30, "count": 1, "instrument": instrument, "setup": setup});
  };
};
