function(doc) {
if (doc['source']=="lims") {
  samples={}
    for (sample in doc["samples"]) {
    s = doc["samples"][sample];
    samples[s["scilife_name"]]={}
    for (prep in s["library_prep"]) {
      samples[s["scilife_name"]][prep]=s["library_prep"][prep]["prep_status"]
}
}

emit([doc["application"],doc["project_name"]],samples)

  
}

}
