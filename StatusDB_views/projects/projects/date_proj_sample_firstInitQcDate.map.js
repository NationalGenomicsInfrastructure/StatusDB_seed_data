function(doc) {
if (doc['source']=="lims") {
samples={}
  for (sample in doc["samples"]) {
      s = doc["samples"][sample];
    samples[s["scilife_name"]] = s["first_initial_qc_start_date"]
  } 
emit([doc["application"],doc["open_date"],doc["project_name"]],samples)
}

}
