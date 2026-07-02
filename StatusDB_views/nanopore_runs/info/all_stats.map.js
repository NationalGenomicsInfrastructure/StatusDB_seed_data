function(doc) {

    function last(list) {
        len = list.length
        return list[len - 1];
    }
    
    // Fetch key
    run_name = last(doc['run_path'].split("/"))
    
    // Start building val dict
    var all_stats = new Object();
    all_stats["TACA_run_path"] = doc['run_path']
    all_stats["TACA_run_status"] = doc['run_status']
    
    // If the MinKNOW .json report has been appended to the db entry
    if (doc.hasOwnProperty('protocol_run_info')) {
        // Specification of projects and samples
        all_stats['experiment_name'] = doc['protocol_run_info']['user_info']['protocol_group_id']; // Should correspond to project ID by convention
        all_stats['sample_name'] = doc['protocol_run_info']['user_info']['sample_id']; // Should correspond to sample or pool ID by convention

        // Hardware
        if (doc['host']['product_name'] == "PromethION 24" ) {
            // PromethION
            all_stats['instrument'] = doc['host']['product_name'];
            all_stats['position'] = doc['protocol_run_info']['device']['device_id'];
        } else if (doc['host']['product_name'] === "" ){
            // MinION
            all_stats['instrument'] = doc['protocol_run_info']['device']['device_id'];
        }
        all_stats['flow_cell_type'] = doc['protocol_run_info']['meta_info']['tags']['flow cell']['string_value'];
        all_stats['flow_cell_id'] = doc['protocol_run_info']['user_info']['user_specified_flow_cell_id'];
        all_stats['prep_kit'] = doc['protocol_run_info']['meta_info']['tags']['kit']["string_value"];
        
        args = doc['protocol_run_info']['args']
        if (args.indexOf('--barcoding' != -1)) {
            bc_kit_str = args[args.indexOf('--barcoding')+1]
            all_stats["barcoding_kit"] = bc_kit_str.split('\"')[1]
        }
        
        // Run metadata
        all_stats["run_id"] = doc['protocol_run_info']['run_id']
        all_stats['start_date'] = doc['protocol_run_info']['start_time'].split("T")[0];
        all_stats['end_date'] = doc['protocol_run_info']['end_time'].split("T")[0];
    
        // Dangerously assume (may need fixing) that last acquisition is the correct one, i.e.:
        //   "acquisition_run_info" --> "config_summary" --> "purpose" : "SEQUENCING"
        last_acquisition = last(doc['acquisitions'])
    
        // Read counts
        yield_summary = last_acquisition['acquisition_run_info']['yield_summary']
        all_stats["read_count"] = yield_summary['read_count']
        all_stats["basecalled_pass_read_count"] = yield_summary['basecalled_pass_read_count']    
        all_stats["basecalled_fail_read_count"] = yield_summary['basecalled_fail_read_count']
        
        // Base yield
        last_snapshot = last(last_acquisition["acquisition_output"][0]["plot"][0]["snapshots"][0]["snapshots"])["yield_summary"]
    
        all_stats["basecalled_pass_bases"] = last_snapshot["basecalled_pass_bases"]
        all_stats["basecalled_fail_bases"] = last_snapshot["basecalled_fail_bases"]
        
        // N50
        last_read_lengths = last(last_acquisition["read_length_histogram"])
        if (last_read_lengths &&
            last_read_lengths["plot"] &&
            last_read_lengths["plot"]["histogram_data"] &&
            last_read_lengths["plot"]["histogram_data"][0]) {
          all_stats["n50"] = last_read_lengths["plot"]["histogram_data"][0]["n50"];
        } else {
          all_stats["n50"] = "";
        }
        
    }

    all_stats["pore_count_history"] = doc["pore_count_history"];
    all_stats["lims"] = doc["lims"];
    all_stats["pore_activity"] = doc["pore_activity"];

    emit(run_name, all_stats);
    
}