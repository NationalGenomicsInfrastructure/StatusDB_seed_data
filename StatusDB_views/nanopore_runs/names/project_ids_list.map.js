function (doc) {

    // Function to match and extract project ID
    function extractProjectId(str) {
        const match = str.match(/(p|P)\d+/);
        return match ? match[0] : null;
    }
    
    // Fetch key
    var project_ids = [];
    var p_id = null;
    const run_path = doc['run_path'];
    const run_name = run_path.split("/")[2];
    if('lims' in doc && 'loading' in doc['lims'] && 'sample_data' in doc['lims']['loading'][0]){
        doc['lims']['loading'][0]['sample_data'].forEach(function(sample) {
            if (project_ids.indexOf(sample['project_id']) === -1) {
                project_ids.push(sample['project_id'])
            }
        })
    }
    // Fallback conditions for older ONT FCs
    else if(doc['run_status']=='ongoing' || doc['run_status']=='interrupted'){
        const experiment_name = run_path.split("/")[0];
        const sample_name = run_path.split("/")[1];
        p_id = extractProjectId(experiment_name) || extractProjectId(sample_name)
    }
    else{
        const group_id = doc['protocol_run_info']['user_info']['protocol_group_id']; // Should correspond to project ID by convention
        const sample_id = doc['protocol_run_info']['user_info']['sample_id'];
        p_id = extractProjectId(group_id) || extractProjectId(sample_id)
    }

    if(p_id){
        project_ids.push(p_id)
    }
    
    emit(run_name, project_ids);
}