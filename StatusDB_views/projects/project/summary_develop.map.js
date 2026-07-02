/*
 Used by genomics-status at:
  /api/v1/projects,
  /api/v1/project_fields,
  /api/v1/project_summary/:id
*/

// Used for the project list at http://genomics-status.scilifelab.se/projects

function(doc) {
  var passed_samples = 0;
  var final_number_of_samples = 0;
  for (sample in doc["samples"]) {
    if (doc["samples"][sample]["status"] === "P") {
      if (sample !== "Unexpectedbarcode") {
        passed_samples++;
      };
    };
    if ("details" in doc["samples"][sample]){
      if (doc["samples"][sample]["details"]["status_(manual)"] !== "Aborted"){
        final_number_of_samples++;
      };
    };
  };

  var summary = Object();

  /* Details will contain all project level udfs */
  summary["details"] = doc["details"];
  /* Project summary will contain all temporary process/project level udfs */
  summary["project_summary"] = doc["project_summary"];
  summary["application"] = doc["application"];
  summary["no_samples"] = doc["no_of_samples"];
  summary["final_number_of_samples"] = final_number_of_samples;
  summary["ordered_reads"] = doc["min_m_reads_per_sample_ordered"];
  summary["project_name"] = doc["project_name"]
  summary["open_date"] = doc["open_date"];
  summary["project_name"] = doc["project_name"];
  //Check for PI contact information
  if ("contact" in doc) {
    summary["contact"] = doc["contact"];
  }

  if ("source" in doc) {
    summary["source"] = doc["source"];
  }
  else {
    summary["source"] = "gdocs";
  }

  summary["passed_samples"] = passed_samples
  summary["reference_genome"] = doc["reference_genome"]
  summary["customer_reference"] = doc["customer_reference"]
  summary["uppnex_id"] = doc["uppnex_id"]
  summary["close_date"] = doc["close_date"]

  if ((summary["source"] == "lims") && (!("close_date" in doc))){
    emit(["open", doc["project_id"]], summary);
  } else {
    emit(["closed", doc["project_id"]], summary);
  }
}
