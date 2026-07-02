/*
Used by genomics-status at:
 /api/v1/projects,
*/

// Used for the project list at http://genomics-status.scilifelab.se/projects
var inc = function (prop, def) {
    if (prop === undefined) {
        prop = def;
    } else {
        prop += def;
    }
    return prop;
};

var key_count = function (obj) {
    var n_keys = 0;
    for (var key in obj) {
      n_keys++;
    }
    return n_keys;
};

function(doc) {
    var summary = {};
    // final_number_of_samples emitted only if 'status_(manual)' is set for all
    var final_number_of_samples = 0;
    var is_final = true;
    if (doc["samples"] === undefined) {
        is_final = false;
    }

    // Temporary objects for counting purposes
    var lib_repreps = {};
    var pools = {};
    var lanes = {};
    var progress = {}; // possible keys: "Aborted", "In Progress", "Finished"


    // Dates
    var first_initial_qc_start_date = "9999-99-99";
    var sequencing_start_date = "9999-99-99";
    var qc_library_finished = "0000-00-00";
    var library_prep_start = "9999-99-99";

    summary["passed_samples"]=0;
    for (var sample in doc["samples"]) {
        var seen=false;

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

                        // counting passed samples
                        if (run_metric_doc["sequencing_start_date"]> latest_seq) {
                          latest_seq=run_metric_doc["sequencing_start_date"];
                          if (run_metric_doc['seq_qc_flag'] == "PASSED" && !seen) {
                              summary["passed_samples"] += 1;
                              seen=true;
                          }
                        }

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


        // samples > [sample] > details
        if ("details" in doc["samples"][sample]){

            // final_number_of_samples
            var status = doc["samples"][sample]["details"]["status_(manual)"];
            if (status !== "Aborted"){
                final_number_of_samples += 1;
            };
            if (status !== undefined){
                summary[status] = inc(summary[status],1)
            } else {
                is_final = false;
            }

            // passed_initial_qc
            var initial_qc = doc["samples"][sample]["details"]["passed_initial_qc"];
            if (initial_qc == "True") {
                progress["passed_initial_qc"] = inc(progress["passed_initial_qc"], 1);
            } else if (initial_qc == "False") {
                progress["passed_initial_qc"] = inc(progress["passed_initial_qc"], 0);
            }

            // samples > [sample] > library_prep
            var lib_qc = undefined;
            for (var prep in doc["samples"][sample]["library_prep"]) {
                if (prep !== 'A') {
                    lib_repreps[prep] = 1;
                }
                // [library_prep] > sample_run_metrics
                for (lane in doc["samples"][sample]["library_prep"][prep]["sample_run_metrics"]) {
                    lanes[lane.split("_").slice(0,3).join("_")] = 1;
                }

                prep_status = doc["samples"][sample]["library_prep"][prep]["prep_status"];
                if (prep_status == "PASSED") {
                    lib_qc = inc(lib_qc,1);
                } else if (prep_status == "FAILED") {
                    lib_qc = inc(lib_qc,0);
                }
            }

            // Library QC
            if (lib_qc !== undefined) {
                progress["passed_library_qc"] = inc(progress["passed_library_qc"], Math.min(1,lib_qc));
            }

            // number_of_pools
            if (doc["samples"][sample]["details"]["pooling"] !== undefined) {
                pools[doc["samples"][sample]["details"]["pooling"]] = 1;
            }
        }
    }

    // X/Y passed QC
    if (is_final) {
        if (progress["passed_library_qc"] !== undefined) {
            summary["passed_library_qc"] = String(progress["passed_library_qc"]) + "/" + String(final_number_of_samples) + " P";
        }
        if (progress["passed_initial_qc"] !== undefined) {
            summary["passed_initial_qc"] = String(progress["passed_initial_qc"]) + "/" + String(final_number_of_samples) + " P";
        }
        if (summary["passed_samples"] !== undefined) {
            summary["passed_seq_qc"] = String(summary["passed_samples"]) + "/" + String(final_number_of_samples) + " P"
        }
    }

    summary["summary_dates"] = Object()
    // Omit dates if not set
    if (library_prep_start != "9999-99-99") {
        summary["summary_dates"]["library_prep_start"] = library_prep_start
    }
    if (qc_library_finished != "0000-00-00") {
        summary["summary_dates"]["qc_library_finished"] = qc_library_finished
    }
    if (sequencing_start_date != "9999-99-99") {
        summary["summary_dates"]["sequencing_start_date"] = sequencing_start_date
    }
    if (first_initial_qc_start_date != "9999-99-99") {
        summary["summary_dates"]["first_initial_qc_start_date"] = first_initial_qc_start_date
    }

    // Count objects, emit only if count !== 0
    summary["library_repreps"] = key_count(lib_repreps) || undefined;
    summary["number_of_pools"] = key_count(pools) || undefined;
    summary["lanes_sequenced"] = key_count(lanes) || undefined;

    /* Details will contain all project level udfs */
    summary["details"] = doc["details"];

    /* Status fields */
    summary["status_fields"] = doc["status_fields"];

    /* Project summary will contain all temporary process/project level udfs */
    summary["project_summary"] = doc["project_summary"];
    summary["application"] = doc["application"];
    summary["no_samples"] = doc["no_of_samples"];
    summary["ordered_reads"] = doc["min_m_reads_per_sample_ordered"];
    summary["open_date"] = doc["open_date"];
    summary["project_name"] = doc["project_name"];
    summary["affiliation"] = doc["affiliation"];
    summary["order_details"] = doc["order_details"];
    summary["delivery_projects"] = doc["delivery_projects"];
    summary["priority"] = doc["priority"];
    //Check for PI contact information
    if ("contact" in doc) {
        summary["contact"] = doc["contact"];
    }

    if ("source" in doc) {
        summary["source"] = doc["source"];
    } else {
        summary["source"] = "gdocs";
    }

    if (is_final) {
        summary["final_number_of_samples"] = final_number_of_samples;
    }

    summary["reference_genome"] = doc["reference_genome"]
    summary["customer_reference"] = doc["customer_reference"]
    if ("uppnex_id" in doc){
        summary["delivery_type"] = doc["uppnex_id"]
    } else if("delivery_type" in doc) {
        summary["delivery_type"] = doc["delivery_type"]
    }
    summary["uppnex_id"] = doc["uppnex_id"]
    summary["close_date"] = doc["close_date"]

    if ("invoice_spec_generated" in doc){
      var date_string = 'No invoicing'
      if (doc["invoice_spec_generated"]!=='No invoicing'){
        var date = new Date(doc["invoice_spec_generated"])
        date_string = date.toISOString().slice(0,10) + ', ' + date.toISOString().slice(11,19)
      }
      summary["invoice_spec_generated"] = date_string
    }
    if ("invoice_spec_downloaded" in doc){
      var date = new Date(doc["invoice_spec_downloaded"])
      summary["invoice_spec_downloaded"] = date.toISOString().slice(0,10)
    }

    if (doc.hasOwnProperty("escalations") && doc.escalations.length >0){
        summary["pending_reviews"]=doc.escalations;
    }

    emit([doc["status_fields"]["status"].toLowerCase(), doc["project_id"]], summary);
}
