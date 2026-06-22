// view for all control projects
// to be used by the GenStat page for controls

function (doc) {
  const re_positive_control = /p.ositive*/i;
  const re_negative_control = /n.egative*/i;
  
  if(doc["details"]["type"] === "Control") {
    if (re_positive_control.test(doc["project_name"])) {
      control_project = "positive control";}
    else if (re_negative_control.test(doc["project_name"])) {
      control_project = "negative control";}
    
    summary = {};
    for (var sample in doc["samples"]) {
      details = doc["samples"][sample];
      if (doc["samples"][sample].hasOwnProperty('library_prep')) {
        sample_lib_prep_details = {};
        for (var lib_prep in details["library_prep"]){
          lib_prep_details = {};
          lib_prep_details["customer_name"] = details["customer_name"];
          lib_prep_details["status_manual"] = details["details"]["status_(manual)"];
          lib_prep_details["passed_sequencing_qc"] = details["details"]["passed_sequencing_qc"];
          lib_prep_details["app_qc"] = details["details"]["app_qc"];
          lib_prep_details["workset_name"] = details["library_prep"][lib_prep]["workset_name"]; 
          lib_prep_details["workset_id"] = details["library_prep"][lib_prep]["workset_setup"];
          lib_prep_details["prep_status"] = details["library_prep"][lib_prep]["prep_status"];
          if(details["library_prep"][lib_prep].hasOwnProperty("sequenced_fc")){
            lib_prep_details["sequenced_fc"] = details["library_prep"][lib_prep]["sequenced_fc"]; 
          } else {
            lib_prep_details["sequenced_fc"] = "not sequenced";
          }
          sample_lib_prep_details[lib_prep_details["workset_id"]] = lib_prep_details;
        }
        summary[sample] = sample_lib_prep_details;
      }
      else {
        lib_prep_details = {};
        lib_prep_details["customer_name"] = details["customer_name"];
        lib_prep_details["status_manual"] = details["details"]["status_(manual)"];
        lib_prep_details["passed_sequencing_qc"] = details["details"]["passed_sequencing_qc"];
        lib_prep_details["app_qc"] = details["details"]["app_qc"];
        summary[sample] = {"no_workset": lib_prep_details};
      }
    }
    emit([control_project, doc["project_id"]], summary);
  }
}
