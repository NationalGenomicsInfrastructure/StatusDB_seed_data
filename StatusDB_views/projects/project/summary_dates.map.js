/* Used by genomics-status at
   /api/v1/projects
   /api/v1/project_fields
   /api/v1/project_summary/:id
 */

function(doc) {
  /* Emit once per library prep to enable reduce */
  for (sample in doc["samples"]) {
    var emit_summary = Object();
    /* Find first initial QC start date */
    var first_initial_qc_start_date = "9999-99-99";
    if ("initial_qc" in doc["samples"][sample]){
      first_initial_qc_start_date = doc["samples"][sample]["initial_qc"]["start_date"]
    }
    else if ("first_initial_qc_start_date" in doc["samples"][sample]){
      first_initial_qc_start_date = doc["samples"][sample]["first_initial_qc_start_date"]
    }
    if ("first_prep_start_date" in doc["samples"][sample]){
          emit_summary["library_prep_start"] = doc["samples"][sample]["first_prep_start_date"];
	}
    if ("library_prep" in doc["samples"][sample]) {
      for (lib_prep in doc["samples"][sample]["library_prep"]) {
        var lib_prep_doc = doc["samples"][sample]["library_prep"][lib_prep];

        /*  Find first sequencing start */
        var sequencing_start_date = "9999-99-99";
        for (sample_run_metric in lib_prep_doc["sample_run_metrics"]) {
          var run_metric_doc = lib_prep_doc["sample_run_metrics"][sample_run_metric];
          if (sequencing_start_date > run_metric_doc["sequencing_start_date"]) {
            sequencing_start_date = run_metric_doc["sequencing_start_date"];
          }
        }

        /* Find last QC library finished */
        var qc_library_finished = "0000-00-00"
          for (lib_val in lib_prep_doc["library_validation"]) {
            var lib_val_doc = lib_prep_doc["library_validation"][lib_val];
            if (qc_library_finished < lib_val_doc["finish_date"]) {
              qc_library_finished = lib_val_doc["finish_date"];
            }
          }
        if ("prep_start_date" in lib_prep_doc){
          emit_summary["library_prep_start"] = lib_prep_doc["prep_start_date"];
        }
        if (!(sequencing_start_date == "9999-99-99")) {
          emit_summary["sequencing_start_date"] = sequencing_start_date;
        }
        if (!(qc_library_finished == "0000-00-00")) {
          emit_summary["qc_library_finished"] = qc_library_finished
        }
        if (!(first_initial_qc_start_date == "9999-99-99")) {
          emit_summary["first_initial_qc_start_date"] = first_initial_qc_start_date
        }
        emit([doc["project_id"]], emit_summary);
      }
    }
    else if (!(first_initial_qc_start_date == "9999-99-99")){
       emit_summary["first_initial_qc_start_date"] = first_initial_qc_start_date;
       emit([doc["project_id"]], emit_summary);
    }
  }
}
