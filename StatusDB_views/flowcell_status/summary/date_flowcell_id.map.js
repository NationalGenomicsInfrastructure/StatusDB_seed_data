function(doc) {
  if (doc.flowcell_id && doc.events) {
    var summary = {
      backed_up_to_pdc: false,
      backed_up_to_pdc_timestamp: null,
      transfer_started: false,
      transfer_started_timestamp: null,
      transferred_to_hpc: false,
      transferred_to_hpc_timestamp: null,
      sequencing_started: false,
      sequencing_started_timestamp: null,
      sequencing_finished: false,
      sequencing_finished_timestamp: null,
      cleaned_from_pdc: false,
      cleaned_from_pdc_timestamp: null,
      cleaned_from_ngi_data: false,
      cleaned_from_ngi_data_timestamp: null,
      cleaned_from_miarka: false,
      cleaned_from_miarka_timestamp: null,
      retrieved_from_pdc: false,
      retrieved_from_pdc_timestamp: null,
      samplesheet_updated: false,
      samplesheet_updated_timestamp: null
    };

    if (doc.runfolder_id) {
      summary.runfolder_id = doc.runfolder_id;
    }

    doc.events.forEach(function(event) {
      switch (event.event_type) {
        case "backed_up_to_pdc":
          summary.backed_up_to_pdc = true;
          if (!summary.backed_up_to_pdc_timestamp || event.timestamp < summary.backed_up_to_pdc_timestamp) {
            summary.backed_up_to_pdc_timestamp = event.timestamp;
          }
          break;
        case "transfer_started_to_hpc":
          summary.transfer_started = true;
          if (!summary.transfer_started_timestamp || event.timestamp < summary.transfer_started_timestamp) {
            summary.transfer_started_timestamp = event.timestamp;
          }
          break;
        case "transferred_to_hpc":
          summary.transferred_to_hpc = true;
          if (!summary.transferred_to_hpc_timestamp || event.timestamp < summary.transferred_to_hpc_timestamp) {
            summary.transferred_to_hpc_timestamp = event.timestamp;
          }
          break;
        case "sequencing_started":
          summary.sequencing_started = true;
          if (!summary.sequencing_started_timestamp || event.timestamp < summary.sequencing_started_timestamp) {
            summary.sequencing_started_timestamp = event.timestamp;
          }
          break;
        case "sequencing_finished":
          summary.sequencing_finished = true;
          if (!summary.sequencing_finished_timestamp || event.timestamp < summary.sequencing_finished_timestamp) {
            summary.sequencing_finished_timestamp = event.timestamp;
          }
          break;
        case "cleaned_from_pdc":
          summary.cleaned_from_pdc = true;
          if (!summary.cleaned_from_pdc_timestamp || event.timestamp < summary.cleaned_from_pdc_timestamp) {
            summary.cleaned_from_pdc_timestamp = event.timestamp;
          }
          break;
        case "cleaned_from_ngi_data":
          summary.cleaned_from_ngi_data = true;
          if (!summary.cleaned_from_ngi_data_timestamp || event.timestamp < summary.cleaned_from_ngi_data_timestamp) {
            summary.cleaned_from_ngi_data_timestamp = event.timestamp;
          }
          break;
        case "cleaned_from_miarka":
          summary.cleaned_from_miarka = true;
          if (!summary.cleaned_from_miarka_timestamp || event.timestamp < summary.cleaned_from_miarka_timestamp) {
            summary.cleaned_from_miarka_timestamp = event.timestamp;
          }
          break;
        case "retrieved_from_pdc":
          summary.retrieved_from_pdc = true;
          if (!summary.retrieved_from_pdc_timestamp || event.timestamp < summary.retrieved_from_pdc_timestamp) {
            summary.retrieved_from_pdc_timestamp = event.timestamp;
          }
          break;
        case "samplesheet_updated":
          summary.samplesheet_updated = true;
          if (!summary.samplesheet_updated_timestamp || event.timestamp < summary.samplesheet_updated_timestamp) {
            summary.samplesheet_updated_timestamp = event.timestamp;
          }
          break;
      }
    });

    // RunParameters parsing
    if (doc.hasOwnProperty("files")){
      if (doc["files"].hasOwnProperty('RunParameters.xml')) {
        if (doc["files"]["RunParameters.xml"].hasOwnProperty('RunParameters')){
          var runparameters = doc["files"]['RunParameters.xml']['RunParameters'];

          if (runparameters.hasOwnProperty('Setup')){
            summary["mode"] = runparameters['Setup']["RunMode"];
            summary["type"] = runparameters['Setup']['ApplicationName'];
            summary["fctype"] = runparameters['Setup']['Flowcell'];
            summary["appver"] = runparameters['Setup']['ApplicationVersion'];
            //Miseq
            if(runparameters.hasOwnProperty('ReagentKitVersion')){
              summary["kitver"]=runparameters['ReagentKitVersion'];
            }
          }else{
            if (runparameters.hasOwnProperty('ApplicationName')){
              summary["type"] = runparameters['ApplicationName'];
              summary["mode"] = runparameters["RunMode"];
            }else if (runparameters.hasOwnProperty('InstrumentType')){
              // NovaSeq X Plus
              summary["type"] = runparameters['InstrumentType'];
              summary["mode"] = runparameters["RecipeName"];
            }
            if (runparameters.hasOwnProperty('Flowcell')){
              summary["fctype"] = runparameters['Flowcell'];
            }else{
              summary["fctype"] = runparameters['FlowCellName'];
            }
            summary["fctype"] = runparameters['Flowcell'];
            summary["appver"] = runparameters['ApplicationVersion'];
          }
        }
      }
    }

    // to define tresholds for number of clusters
    summary['run_mode']='';

    if (doc.hasOwnProperty("files") && doc["files"].hasOwnProperty('RunParameters.xml') && doc["files"]["RunParameters.xml"].hasOwnProperty('RunParameters')){
      var runparameters = doc["files"]['RunParameters.xml']['RunParameters'];
      
      if (runparameters.hasOwnProperty('InstrumentType') && runparameters['InstrumentType'].indexOf('MiSeqi100Plus')!=-1) {
        // MiSeqi100
        summary['run_mode']=runparameters['InstrumentType'] + ' ' + runparameters['RecipeName'].split("/")[0];
      } else if (runparameters.hasOwnProperty('ReagentKitVersion') && runparameters.hasOwnProperty('RunParametersVersion') && runparameters['RunParametersVersion'].indexOf('MiSeq') != -1) {
        // Old MiSeq
        if (doc.hasOwnProperty('lims_data') && doc['lims_data'].hasOwnProperty('run_type') && doc['lims_data']['run_type']!='null') {
          summary['run_mode']='MiSeq ' + doc['lims_data']['run_type'];
        }
        else {
          if (runparameters.hasOwnProperty('Setup') && runparameters['Setup'].hasOwnProperty('SupportMultipleSurfacesInUI') && runparameters['Setup'].hasOwnProperty('NumTilesPerSwath')) {
            if (runparameters['Setup']['SupportMultipleSurfacesInUI']=='true' && runparameters['Setup']['NumTilesPerSwath']=='19') {
              summary['run_mode']='MiSeq Version3';
            }
            else if (runparameters['Setup']['SupportMultipleSurfacesInUI']=='true' && runparameters['Setup']['NumTilesPerSwath']=='14') {
              summary['run_mode']='MiSeq Version2';
            }
            else if (runparameters['Setup']['SupportMultipleSurfacesInUI']=='false' && runparameters['Setup']['NumTilesPerSwath']=='2') {
              summary['run_mode']='MiSeq Version2Nano';
            }
            else if (runparameters['Setup']['SupportMultipleSurfacesInUI']=='true' && runparameters['Setup']['NumTilesPerSwath']=='4') {
              summary['run_mode']='MiSeq Version2Micro';
            }
            else {
              summary['run_mode']='MiSeq null';
            }
          }
          else {
            summary['run_mode']='MiSeq ' + runparameters['ReagentKitVersion'];
          }
        }
      } else if (runparameters.hasOwnProperty('Chemistry') && runparameters['Chemistry'].indexOf('NextSeq')!=-1) {
        // NextSeq
        summary['run_mode']=runparameters['Chemistry'];
      } else if (runparameters.hasOwnProperty('InstrumentType')) {
        if (runparameters.hasOwnProperty('FlowCellMode') && runparameters['InstrumentType'].indexOf('NextSeq 2000')!=-1) {
          summary['run_mode']=runparameters['InstrumentType'] + ' ' + runparameters['FlowCellMode'].match(/P[1,2,3]/)[0];
        } else if (runparameters['InstrumentType'].indexOf('NovaSeqXPlus')!=-1) {
          // NovaSeq X Plus
          summary['run_mode']=runparameters['InstrumentType'] + ' ' + runparameters['RecipeName'].split(" ")[0];
        }
      } else {
        summary['run_mode']='';
      }
    }



    // Extract run date from runfolder_id
    var run_date = null;
    if (doc.runfolder_id) {
      var date_part = doc.runfolder_id.split('_')[0];
      // If only 6 digits, prepend '20'
      if (date_part && date_part.length === 6 && /^\d{6}$/.test(date_part)) {
        run_date = '20' + date_part;
      } else if (date_part && /^\d+$/.test(date_part)) {
        run_date = date_part;
      }
    }

    emit([run_date, doc.flowcell_id], summary);
  }
}