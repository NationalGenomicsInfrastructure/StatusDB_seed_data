/*
 Used by genomics-status at:
  /api/v1/phix_err_rate
*/

function(doc) {
  for (lane in doc["lanes"]) {
    var sum = 0;
    var count = 0;
    var yield = null;
    for (read in doc["RunInfo"]["Reads"]) {
      if (doc["RunInfo"]["Reads"][read]["IsIndexedRead"] === "N") {
        sum += 1*doc["illumina"]["Summary"]["read" + doc["RunInfo"]["Reads"][read]["Number"]][lane]["ErrRatePhiX"];
        count++;
      };
    };
    if (doc["illumina"]["Demultiplex_Stats"] !== undefined) {
      yield = 0
      for (sample in doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"]) {
        if (doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"][sample]["Lane"] === lane) {
          yield += 0.5*doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"][sample]["# Reads"].replace(/,/g,"")
        }
      }
    };
    emit([doc["name"], lane], {"err_rate_phix": (sum/count), "yield": yield});
  };
};  
