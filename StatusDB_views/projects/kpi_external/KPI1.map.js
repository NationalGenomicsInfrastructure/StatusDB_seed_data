function(doc) {
  if(doc["source"] != "lims") { 
    exit; 
  } 
  var date;
  for (sample in doc["samples"]) {
    s = doc["samples"][sample];
    run = "F";
    //var date = "0000-00-00";
    for (prep in s["library_prep"]){
      if (s["library_prep"][prep]["sample_run_metrics"]){ 
        run = "T";
        // 2013-09-24 NJ: Take the dilution_and_pooling_start_date
        //                as date instead of open_date 
        for (runid in s["library_prep"][prep]["sample_run_metrics"]) {
           var newdate = s["library_prep"][prep]["sample_run_metrics"][runid]["dillution_and_pooling_start_date"];
           if(date == undefined || newdate < date) { date = newdate; }
        }
    }
} 
   if (run == "T"){
//  emit([doc["open_date"],doc["application"],s["scilife_name"]],s["incoming_QC_status"])
  emit([date,doc["application"],s["scilife_name"]],s["incoming_QC_status"])
    }
  } 
}