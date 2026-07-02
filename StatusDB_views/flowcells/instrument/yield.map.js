/*
 Used by genomics-status at:
  /api/v1/instrument_yield,
  /api/v1/instrument_yield.png
*/

function(doc) {
  var yields = []
  for (lane in doc["lanes"]) {
    if (doc["illumina"]["Demultiplex_Stats"] !== undefined) {
      var yield = 0
      for (sample in doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"]) {
        if (doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"][sample]["Lane"] === lane) {
          yield += 0.5*doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"][sample]["# Reads"].replace(/,/g,"")
        };
      };
    };
    yields.push(yield)
  };
  emit([doc["RunInfo"]["Date"], doc["RunInfo"]["Instrument"]], yields);
};
