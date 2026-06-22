function(doc) {
  // Only output production documents
  if(doc["details"]["type"] != "Production") { exit; }

  // Get sequencing platform for stratification
  var application = doc["application"]


  // Find arrival date (if present)
  var open_date = "0000-00-00"
  if (doc["open_date"] > open_date) {
    open_date = doc["open_date"]
  }

  for (sample in doc["samples"]){
    // Find queue date (if present)
    var queued = "0000-00-00"
    if (doc["details"]["queued"] > queued) {
      queued = doc["details"]["queued"]
    }

    for (library_prep in doc["samples"][sample]["library_prep"]) {
      var LP = doc["samples"][sample]["library_prep"][library_prep]

      // Find QC library finish date by looking at the final library validation.
      var final_validation = "0000-00-00"
      for (lv in LP["library_validation"]) {
        var lib_val_fin = LP["library_validation"][lv]["finish_date"]
        if (lib_val_fin > final_validation) {
          final_validation = lib_val_fin
        }
      }

      // Find the time a sample is sequenced at by looking at sample runs
      // sequencing _start_ date. This is confusing, but it is how Maya 
      // specified it.
      //var final_sequence_date = "0000-00-00"
      //for (sample_run_metrics in LP["sample_run_metrics"]) {
      //  final_sequence_date = LP["sample_run_metrics"][sample_run_metrics]["sequencing_start_date"]
      //}

      // NJ 2013-08-23: updated original code above to work with new 
      // key "sequencing_finish_date" 
      var final_sequence_date = "0000-00-00"
      for (sample_run_metrics in LP["sample_run_metrics"]) {
        final_sequence_date = LP["sample_run_metrics"][sample_run_metrics]["sequencing_finish_date"]
      }


      // Collect dates to a KPI object
      var KPI = Object()
      KPI["Arrival date"] = open_date
      KPI["Queue date"] = queued
      KPI["QC library finished"] = final_validation
      KPI["All samples sequenced"] = final_sequence_date

      emit([application, doc["project_name"], doc["project_id"], sample, library_prep], KPI)
    }

    // If no library preps have been entered to the project, set all library prep
    // and sample sequencing dates to "0000-00-00"
    if (!("library_prep" in doc["samples"][sample])) {
      var KPI = Object()
      KPI["Arrival date"] = open_date
      KPI["Queue date"] = queued
      KPI["QC library finished"] = "0000-00-00"
      KPI["All samples sequenced"] = "0000-00-00"
     
      emit([application, doc["project_name"], doc["project_id"], sample, null], KPI)
    }
  }

  // If no samples have been entered to the project, set all library prep
  // and sample sequencing dates to "0000-00-00"
  if (!("samples" in doc)) {
    var KPI = Object()
    KPI["Arrival date"] = open_date
    KPI["Queue date"] = queued
    KPI["QC library finished"] = "0000-00-00"
    KPI["All samples sequenced"] = "0000-00-00"

    emit([application, doc["project_name"], doc["project_id"], null, null], KPI)
  }
}