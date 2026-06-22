function(doc) {
if (doc['source']=="lims") {
samples={}
  for (sample in doc["samples"]) {
      s = doc["samples"][sample];
    samples[s["scilife_name"]] = [s["reads_requested_(millions)"],s["status"]]
  } 
emit([doc["open_date"],doc["project_name"],doc["application"]],samples)
}

}
