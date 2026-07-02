/*
 Used by genomics-status at:
  /api/v1/instrument_cluster_density,
  /api/v1/instrument_cluster_density.png
*/

function(doc) {
  var clusters = []
  for (lane in doc["illumina"]["Summary"]["read1"]) {
    if (doc["illumina"]["Summary"]["read1"][lane]["ClustersRaw"]) {
      clusters.push(+doc["illumina"]["Summary"]["read1"][lane]["ClustersRaw"])
    }
  }
  emit([doc["RunInfo"]["Date"], doc["RunInfo"]["Instrument"]], clusters);
}
