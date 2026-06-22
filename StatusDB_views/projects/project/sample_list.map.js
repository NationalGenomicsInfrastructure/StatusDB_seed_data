function(doc) {
  samples = [];
  for (sample in doc["samples"]) {
    s = doc["samples"][sample]
    if (s["scilife_name"]) {
      samples.push(s["scilife_name"])
    }
    else if (s["customer_name"]) {
      samples.push(s["customer_name"])
    }
    else {
      samples.push(sample)
    }
  }
  emit(doc["project_id"], samples);
}

