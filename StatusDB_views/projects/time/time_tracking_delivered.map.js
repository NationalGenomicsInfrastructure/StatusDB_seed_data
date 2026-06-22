function(doc) {
  if (doc.details && doc.details.all_raw_data_delivered) {
    // Calculate dates from samples data
    var library_prep_start = '9999-99-99';
    var qc_library_finished = '0000-00-00';
    var sequencing_start_date = '9999-99-99';
    
    if (doc.samples) {
      for (var sample in doc.samples) {
        // Find first library prep start
        if (doc.samples[sample].first_prep_start_date) {
          if (library_prep_start > doc.samples[sample].first_prep_start_date) {
            library_prep_start = doc.samples[sample].first_prep_start_date;
          }
        }
        
        if (doc.samples[sample].library_prep) {
          for (var lib in doc.samples[sample].library_prep) {
            var lib_prep_doc = doc.samples[sample].library_prep[lib];
            
            // Find first library prep start (alternative location)
            if (lib_prep_doc.prep_start_date) {
              if (library_prep_start > lib_prep_doc.prep_start_date) {
                library_prep_start = lib_prep_doc.prep_start_date;
              }
            }
            
            // Find last QC library finished
            if (lib_prep_doc.library_validation) {
              for (var lib_val in lib_prep_doc.library_validation) {
                var lib_val_doc = lib_prep_doc.library_validation[lib_val];
                if (lib_val_doc.finish_date && qc_library_finished < lib_val_doc.finish_date) {
                  qc_library_finished = lib_val_doc.finish_date;
                }
              }
            }
            
            // Find first sequencing start
            if (lib_prep_doc.sample_run_metrics) {
              for (var run_metric in lib_prep_doc.sample_run_metrics) {
                var run_metric_doc = lib_prep_doc.sample_run_metrics[run_metric];
                if (run_metric_doc.sequencing_start_date && sequencing_start_date > run_metric_doc.sequencing_start_date) {
                  sequencing_start_date = run_metric_doc.sequencing_start_date;
                }
              }
            }
          }
        }
      }
    }
    
    emit([doc.details.all_raw_data_delivered, doc.project_id], {
      // Dates
      open_date: doc.open_date,
      queued: doc.details.queued,
      library_prep_start: library_prep_start != '9999-99-99' ? library_prep_start : undefined,
      qc_library_finished: qc_library_finished != '0000-00-00' ? qc_library_finished : undefined,
      sequencing_start_date: sequencing_start_date != '9999-99-99' ? sequencing_start_date : undefined,
      all_samples_sequenced: doc.details.all_samples_sequenced,
      all_raw_data_delivered: doc.details.all_raw_data_delivered,
      best_practice_analysis_completed: doc.details.best_practice_analysis_completed,
      close_date: doc.close_date,
      
      // Metadata
      project_name: doc.project_name,
      application: doc.application,
      library_construction_method: doc.details.library_construction_method,
      sequencing_platform: doc.details.sequencing_platform,
      sequence_units_ordered: doc.details["sequence_units_ordered_(lanes)"],
      type: doc.details.type
    });
  }
}
