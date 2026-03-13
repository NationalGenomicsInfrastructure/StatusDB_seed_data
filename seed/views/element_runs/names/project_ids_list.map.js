function (doc) {
    // Function to match and extract project ID
    function extractProjectId(str) {
        const match = str.match(/(p|P)\d+/);
        return match ? match[0] : null;
    }
    // Fetch key
    var project_ids = [];
    var p_id = null;
    if('Element' in doc && 'Demultiplex_Stats' in doc['Element'] && 'Index_Assignment' in doc['Element']['Demultiplex_Stats']){
      if(doc['Element']['Demultiplex_Stats']['Index_Assignment']!==null){
        doc['Element']['Demultiplex_Stats']['Index_Assignment'].forEach(function(sample) {
          p_id = extractProjectId(sample['SampleName'])
          if(p_id!==null && project_ids.indexOf(p_id) === -1 ){
            project_ids.push(p_id)
          }
        })
      }
    }
    else{
      if('instrument_generated_files' in doc && 'RunManifest.json' in doc['instrument_generated_files'] && 'Samples' in doc['instrument_generated_files']['RunManifest.json']){
        doc['instrument_generated_files']['RunManifest.json']['Samples'].forEach(function(sample) {
          p_id = extractProjectId(sample['SampleName'])
          if(p_id!==null && project_ids.indexOf(p_id) === -1 ){
            project_ids.push(p_id)
          }
        })
      }
    }
    emit(doc.NGI_run_id, project_ids);
}