// Used by: genomics-status.scilifelab.se/q30

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

    emit([doc["name"], stats[sample]["Lane"], stats[sample]["Index"]],
         {"sum": +q30, "count": 1, "instrument": instrument, "setup": setup});
  };
};
