/*
 Used by genomics-status at:
  /api/v1/instrument_error_rates
  /api/v1/instrument_error_rates.png
*/

function(doc) {
  var error_rates = [];
  for (lane in doc["lanes"]) {
    for (read in doc["RunInfo"]["Reads"]) {
      if (doc["RunInfo"]["Reads"][read]["IsIndexedRead"] === "N") {
        error_rates.push(+doc["illumina"]["Summary"]["read" + doc["RunInfo"]["Reads"][read]["Number"]][lane]["ErrRatePhiX"]);
      };
    };
  };
  emit([doc["RunInfo"]["Date"], doc["RunInfo"]["Instrument"]], error_rates);
};
