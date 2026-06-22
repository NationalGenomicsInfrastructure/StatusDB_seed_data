
function(doc) {
  if(doc.details.hasOwnProperty('portal_id') && ("contract_sent" in doc["details"])){
    var summary = {};
    var orderer = null;
    var portal_id = null;
    var close_date = "XXXX-XX-XX";
    if ("close_date" in doc) {
      close_date = doc["close_date"];
    } else if (!(("source" in doc) && (doc["source"] == "lims")))  {
    // Gdocs - better be closed by now (>2023)
      close_date = "1111-11-11";
    }

    if ("order_details" in doc) {
      orderer = doc["order_details"]["owner"]["email"]
      portal_id = doc["order_details"]["identifier"]
    }
    summary["orderer"] = orderer
    summary["portal_id"] = portal_id
    summary["order_year"] = ""
  
    summary["project_id"] = doc.project_id;
    summary["project_name"] = doc.project_name;
    summary["proj_dates"] = {}
    //From details
    var date = null;
    const dates_arr = [["samples_received", "Samples Received"], ["queued", "Reception Control Finished"], ["all_samples_sequenced", "All Samples Sequenced"], 
                            ["all_raw_data_delivered", "All Raw Data Delivered"]];

    dates_arr.forEach(function (item, index) {
        date = item[0] in doc["details"] ? doc["details"][item[0]]: "";
        if (date!==""){
            if(date in summary["proj_dates"]){
                summary["proj_dates"][date].push(item[1]);
            }
            else{
                summary["proj_dates"][date] = [item[1]];
            }
        }
    });

    if("contract_sent" in doc["details"]){
        summary["order_year"] = doc["details"]["contract_sent"].split("-")[0]
    }
  
    //Status
    summary["status"] = doc["status_fields"]["status"];
  
    //Summary Dates
    var first_initial_qc_start_date = "9999-99-99";
    var sequencing_start_date = "9999-99-99";
    var qc_library_finished = "0000-00-00";
    var library_prep_start = "9999-99-99";
  
    for (var sample in doc["samples"]) {
    // Find first library prep start (1st)
      if ("first_prep_start_date" in doc["samples"][sample]){
        if (library_prep_start > doc["samples"][sample]["first_prep_start_date"]) {
          library_prep_start = doc["samples"][sample]["first_prep_start_date"];
        }
      }
  
        //Sequencing QC
      if (doc["samples"][sample].hasOwnProperty('library_prep')) {
        var latest_seq="0";
        for (var lib in doc["samples"][sample]['library_prep']){
            var lib_prep_doc = doc["samples"][sample]['library_prep'][lib];
            if (lib_prep_doc.hasOwnProperty('sample_run_metrics')){
                    for (var runid in lib_prep_doc['sample_run_metrics']) {
                        var run_metric_doc = lib_prep_doc['sample_run_metrics'][runid];
                        // Find sequencing start date
                        if (sequencing_start_date > run_metric_doc["sequencing_start_date"]) {
                            sequencing_start_date = run_metric_doc["sequencing_start_date"];
                        }
                    }
              }
              // Find last QC library finished
              for (var lib_val in lib_prep_doc["library_validation"]) {
                  var lib_val_doc = lib_prep_doc["library_validation"][lib_val];
                  if (qc_library_finished < lib_val_doc["finish_date"]) {
                      qc_library_finished = lib_val_doc["finish_date"];
                  }
              }
              // Find first library prep start (2nd)
              if ("prep_start_date" in lib_prep_doc){
                  if (library_prep_start > lib_prep_doc["prep_start_date"]) {
                      library_prep_start = lib_prep_doc["prep_start_date"];
                  }
              }
          }
        }
  
        // Find first initial QC start date
        if ("initial_qc" in doc["samples"][sample]) {
            if (first_initial_qc_start_date > doc["samples"][sample]["initial_qc"]["start_date"]) {
                first_initial_qc_start_date = doc["samples"][sample]["initial_qc"]["start_date"];
            }
        } else if ("first_initial_qc_start_date" in doc["samples"][sample]) {
            if (first_initial_qc_start_date > doc["samples"][sample]["first_initial_qc_start_date"]) {
                first_initial_qc_start_date = doc["samples"][sample]["first_initial_qc_start_date"];
            }
        }
    }
  
    // Omit dates if not set
    if (qc_library_finished != "0000-00-00") {
        if(qc_library_finished in summary["proj_dates"]){
            summary["proj_dates"][qc_library_finished].push("Library QC Finished");
        }
        else{
            summary["proj_dates"][qc_library_finished] = ["Library QC Finished"];
        }
    }
  
    emit([close_date, summary["project_id"]], summary);
    }
  }
  