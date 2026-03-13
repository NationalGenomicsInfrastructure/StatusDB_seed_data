function(doc) {
  for (lane in doc["illumina"]["Summary"]["read1"]) {
    if (doc["illumina"]["Summary"]["read1"][lane]["ClustersRaw"]) {
      emit([doc["name"],lane], {"clusters_raw": doc["illumina"]["Summary"]["read1"][lane]["ClustersRaw"], "clusters_pf": doc["illumina"]["Summary"]["read1"][lane]["ClustersPF"]});
    }
  }
}
