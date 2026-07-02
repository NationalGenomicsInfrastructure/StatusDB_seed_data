function(doc) {
  var projects = {};
  var total = {};
  var undemux = {};
  var index = {};
  if ("Demultiplex_Stats" in doc["illumina"]) {

    for (sample in doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"]) {
      lane = doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"][sample]["Lane"];
      proj = doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"][sample]["Project"].replace("__",".");
      idx = doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"][sample]["Index"].replace("-","");
      count = parseInt(doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"][sample]["# Reads"].replace(",",""));

      if (!(lane in total)) {
        total[lane] = 0;
        projects[lane] = {};
        index[lane] = {};
      }

      total[lane] += count;
      if (proj == "Undetermined_indices") {
        undemux[lane] = count;
      }
      else {
        projects[lane][proj] = 1;
        index[lane][idx.length.toString()] = idx.length;
      }
    }
    for (var lane in total) {
      emit([Object.keys(projects[lane]).join(),doc["name"],lane],{"index_length": Object.keys(index[lane]).join(), "fraction_undemultiplexed": undemux[lane]/total[lane]});
    }
  }
};
