function (doc) {
    var info = {}; // The object that will be emitted

    var instrument_generated_files = {};
    if (doc.hasOwnProperty('instrument_generated_files')) {
        instrument_generated_files = doc['instrument_generated_files'];
    }

    var run_parameters = {};
    if (instrument_generated_files.hasOwnProperty('RunParameters.json')){
        run_parameters = instrument_generated_files['RunParameters.json'];
    }

    // Will not emit anything if the NGI_run_id is not available
    if (doc.hasOwnProperty('NGI_run_id')) {
        var NGI_run_id = doc['NGI_run_id'];
    
        info['doc_id'] = doc['_id'];
        // Default values
        info['RunDate'] = "";
        info['RunName'] = "";
        info['RunType'] = "";
        info['Side'] = "";
        info['Cycles'] = {};
        info['ThroughputSelection'] = "";
        info['KitConfiguration'] = "";
        info['ChemistryVersion'] = "";

        if (run_parameters !== null){
            if (run_parameters.hasOwnProperty('run_date')) {
                info['RunDate'] = run_parameters['run_date'];
            }
            if (run_parameters.hasOwnProperty('RunName')) {
                info['RunName'] = run_parameters['RunName'];
            }
            if (run_parameters.hasOwnProperty('RunType')) {
                info['RunType'] = run_parameters['RunType'];
            }
            if (run_parameters.hasOwnProperty('Side')) {
                info['Side'] = run_parameters['Side'];
            }
            if (run_parameters.hasOwnProperty('Cycles')) {
                info['Cycles'] = run_parameters['Cycles'];
            }
            if (run_parameters.hasOwnProperty('ThroughputSelection')) {
                info['ThroughputSelection'] = run_parameters['ThroughputSelection'];
            }
            if (run_parameters.hasOwnProperty('KitConfiguration')) {
                info['KitConfiguration'] = run_parameters['KitConfiguration'];
            }
            if (run_parameters.hasOwnProperty('ChemistryVersion')) {
                info['ChemistryVersion'] = run_parameters['ChemistryVersion'];
            }
        }

        // Check if it is finished
        info["Outcome"] = "ongoing";
        var run_uploaded = {};
        if (instrument_generated_files.hasOwnProperty('RunUploaded.json')){
            run_uploaded = instrument_generated_files['RunUploaded.json'];
            if ((run_uploaded !== null ) && (run_uploaded.hasOwnProperty('outcome'))){
                info['Outcome'] = run_uploaded['outcome'];
            }
        }

        emit(NGI_run_id, info);
    }
}