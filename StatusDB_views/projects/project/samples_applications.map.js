function(doc) {
  no_of_samples = +doc["no_of_samples"] || 0
  emit(doc["application"], no_of_samples);
}
