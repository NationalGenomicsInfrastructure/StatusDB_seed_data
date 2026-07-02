function(doc) {
  for (sample in doc["samples"]) {
    for (prep in doc["samples"][sample]["library_prep"]) {
      run_metrics = doc["samples"][sample]["library_prep"][prep]["sample_run_metrics"]
      for (rm in run_metrics) {
        break
      }
      date = rm.split("_")[1]
      emit([parseInt("20" + date[0] + date[1]), prep], sample)
    }
  }
}
