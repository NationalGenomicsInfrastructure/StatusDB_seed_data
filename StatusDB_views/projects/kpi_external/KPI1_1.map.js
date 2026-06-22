function(doc) {
if (doc['source']=="lims") {
samples={}
  for (sample in doc["samples"]) {
    s = doc["samples"][sample];
    run = "F";
    for (prep in s["library_prep"]){
      if (s["library_prep"][prep]["sample_run_metrics"]){ run = "T"}
} 
	samples[s["scilife_name"]] = [s["incoming_QC_status"],run]
  } 
emit([doc["open_date"],doc["project_name"],doc["application"]],samples)
}

}