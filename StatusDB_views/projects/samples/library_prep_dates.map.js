function(doc) {
  for (sample in doc["samples"]) {
    for (prep in doc["samples"][sample]["library_prep"]) {
      library_validation = doc["samples"][sample]["library_prep"][prep]["library_validation"]
      for (lv in library_validation) {
      l=library_validation[lv]
      emit([sample, prep], l)}
    }
  }
}
