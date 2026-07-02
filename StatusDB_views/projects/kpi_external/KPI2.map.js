function(doc) {
  for (sample in doc["samples"]) {
    s = doc["samples"][sample];
    for (prep in s["library_prep"]){
      date = null;
      for (libval in s["library_prep"][prep]["library_validation"]){ 
        date = s["library_prep"][prep]["library_validation"][libval]['start_date'];
      } 
      if (s["library_prep"][prep]["workset_setup"]){
        emit([s["library_prep"][prep]["workset_setup"], doc["application"],date,s["scilife_name"]],s["library_prep"][prep]['prep_status']);
      }
    }
  } 
}