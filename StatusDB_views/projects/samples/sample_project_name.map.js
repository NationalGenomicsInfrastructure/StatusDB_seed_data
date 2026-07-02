function(doc) {
  for (sample in doc["samples"]) {
      emit([sample], doc["project_name"])
    }
}
