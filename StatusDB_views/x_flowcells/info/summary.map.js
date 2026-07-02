/*
 Used by genomics-status at:
  /api/v1/flowcell_info,
  /api/v1/flowcells
*/

function(doc) {

    var summary = new Object();
    summary["startdate"] = doc["RunInfo"]["Date"];
    summary["instrument"] = doc["RunInfo"]["Instrument"];
    summary["flowcell"] = doc["RunInfo"]["Flowcell"];
    summary["run id"] = doc["RunInfo"]["Id"];

    // Position is first character after first '_' in name
    summary["pos"] = doc["name"].split("_")[1][0]

    summary["reads"] = doc["RunInfo"]["Reads"];
    summary["number"] = doc["RunInfo"]["Number"];
    summary["recipe"] = doc["run_setup"];
    summary["lane_info"] = {};
    summary['demultiplexing']='Pending';
    summary["pdc_archived"] = doc["pdc_archived"];

    if(doc.hasOwnProperty("RunInfo")){
        run_setup = doc.RunInfo.Reads;
        run_setup_text = '';
        read_count = 0;
        index_count = 0;
        longer_read_length = 0;

        run_setup.forEach(function(read){
            run_setup_text += read['NumCycles'];
            run_setup_text += 'nt';
            if(read['IsIndexedRead'] === 'N'){
                read_count += 1;
                run_setup_text += '(R';
                run_setup_text += read_count.toString();
                if(parseInt(read['NumCycles']) > longer_read_length){
                    longer_read_length = parseInt(read['NumCycles']);
                }
            }
            else if(read['IsIndexedRead'] == 'Y'){
                index_count += 1;
                run_setup_text += '(I';
                run_setup_text += index_count.toString();
            }
            if(run_setup.indexOf(read) === run_setup.length-1)
                run_setup_text += ')';
            else
                run_setup_text += ')-';
        });
        summary['actual_run_setup'] = run_setup_text;
        summary['longer_read_length'] = longer_read_length;
    }

    if (doc.hasOwnProperty("RunParameters")){
        if (doc["RunParameters"].hasOwnProperty('Setup')){
          summary["mode"] = doc["RunParameters"]['Setup']["RunMode"];
          summary["type"] = doc['RunParameters']['Setup']['ApplicationName'];
          summary["fctype"] = doc['RunParameters']['Setup']['Flowcell'];
          summary["appver"] = doc['RunParameters']['Setup']['ApplicationVersion'];
          //Miseq
          if(doc["RunParameters"].hasOwnProperty('ReagentKitVersion')){
              summary["kitver"]=doc["RunParameters"]['ReagentKitVersion'];
          }
        }else{
          if (doc["RunParameters"].hasOwnProperty('ApplicationName')){
              summary["type"] = doc['RunParameters']['ApplicationName'];
              summary["mode"] = doc["RunParameters"]["RunMode"];
          }else if (doc["RunParameters"].hasOwnProperty('InstrumentType')){
              // NovaSeq X Plus
              summary["type"] = doc['RunParameters']['InstrumentType'];
              summary["mode"] = doc["RunParameters"]["RecipeName"];
          }else{
          //NovaSeq
              summary["type"] = doc['RunParameters']['Application'];
              summary["mode"] = doc["RunParameters"]["RfidsInfo"]["FlowCellMode"];
              summary["workflow"] = doc["RunParameters"]["WorkflowType"];
          }
          if (doc["RunParameters"].hasOwnProperty('Flowcell')){
              summary["fctype"] = doc['RunParameters']['Flowcell'];
          }else{
              summary["fctype"] = doc['RunParameters']['FlowCellName'];
          }
          summary["fctype"] = doc['RunParameters']['Flowcell'];
          summary["appver"] = doc['RunParameters']['ApplicationVersion'];
        }
    }

      // to define tresholds for number of clusters
    summary['run_mode']='';

    if (doc['RunParameters'].hasOwnProperty('ReagentKitVersion') && doc['RunParameters'].hasOwnProperty('RunParametersVersion') && doc['RunParameters']['RunParametersVersion'].indexOf('MiSeq') != -1) {
        if (doc.hasOwnProperty('lims_data') && doc['lims_data'].hasOwnProperty('run_type') && doc['lims_data']['run_type']!='null') {
            summary['run_mode']='MiSeq ' + doc['lims_data']['run_type'];
        }
        else {
            if (doc['RunParameters'].hasOwnProperty('Setup') && doc['RunParameters']['Setup'].hasOwnProperty('SupportMultipleSurfacesInUI') && doc['RunParameters']['Setup'].hasOwnProperty('NumTilesPerSwath')) {
                if (doc['RunParameters']['Setup']['SupportMultipleSurfacesInUI']=='true' && doc['RunParameters']['Setup']['NumTilesPerSwath']=='19') {
                    summary['run_mode']='MiSeq Version3';
                }
                else if (doc['RunParameters']['Setup']['SupportMultipleSurfacesInUI']=='true' && doc['RunParameters']['Setup']['NumTilesPerSwath']=='14') {
                    summary['run_mode']='MiSeq Version2';
                }
                else if (doc['RunParameters']['Setup']['SupportMultipleSurfacesInUI']=='false' && doc['RunParameters']['Setup']['NumTilesPerSwath']=='2') {
                    summary['run_mode']='MiSeq Version2Nano';
                }
                else if (doc['RunParameters']['Setup']['SupportMultipleSurfacesInUI']=='true' && doc['RunParameters']['Setup']['NumTilesPerSwath']=='4') {
                    summary['run_mode']='MiSeq Version2Micro';
                }
                else {
                    summary['run_mode']='MiSeq null';
                }
            }
            else {
                summary['run_mode']='MiSeq ' + doc['RunParameters']['ReagentKitVersion'];
            }
        }
    } else if (doc['RunParameters'].hasOwnProperty('Chemistry') && doc['RunParameters']['Chemistry'].indexOf('NextSeq')!=-1) {
      summary['run_mode']=doc['RunParameters']['Chemistry'];
    } else if (doc['RunParameters'].hasOwnProperty('InstrumentType')) {
        if (doc['RunParameters'].hasOwnProperty('FlowCellMode') && doc['RunParameters']['InstrumentType'].indexOf('NextSeq 2000')!=-1) {
            summary['run_mode']=doc['RunParameters']['InstrumentType'] + ' ' + doc['RunParameters']['FlowCellMode'].match(/P[1,2,3]/)[0];
        } else if (doc['RunParameters']['InstrumentType'].indexOf('NovaSeqXPlus')!=-1) {
            // NovaSeq X Plus
            summary['run_mode']=doc['RunParameters']['InstrumentType'] + ' ' + doc['RunParameters']['RecipeName'].split(" ")[0];
        }
    } else if (doc['RunParameters'].hasOwnProperty('Setup')){
      if (doc['RunParameters']['Setup'].hasOwnProperty('RunMode')){
          // HiSeq
          summary['run_mode']=doc['RunParameters']['Setup']['RunMode'];
      } else if (doc['RunParameters']['Setup'].hasOwnProperty('Index') && doc['RunParameters']['Setup']['Index'].indexOf('HiSeq X')!=-1) {
          summary['run_mode']='HiSeq X';
      }
    } else if (doc['RunParameters'].hasOwnProperty('RfidsInfo') && doc['RunParameters']['RfidsInfo'].hasOwnProperty('FlowCellMode')) {
      summary['run_mode']='NovaSeq ' + doc['RunParameters']['RfidsInfo']['FlowCellMode'];
    }
    else {
      summary['run_mode']='';
    }

    /*Retrieve information of involved projects*/
    if (doc.hasOwnProperty('samplesheet_csv') && doc.samplesheet_csv.length >0){
        for (index in doc.samplesheet_csv){
            lane = doc.samplesheet_csv[index]['Lane'];
            if (doc.samplesheet_csv[index].hasOwnProperty('Sample_Name')){
                pid = doc.samplesheet_csv[index]['Sample_Name'].split('_')[0];
                pname = doc.samplesheet_csv[index]['Sample_Project'].replace(/^(\w+?)_+(\w+)/, "$1.$2");
            } else if (doc.samplesheet_csv[index].hasOwnProperty('SampleName')){
                pid = doc.samplesheet_csv[index]['SampleName'].split('_')[0];
                pname = doc.samplesheet_csv[index]['Project'].replace(/^(\w+?)_+(\w+)/, "$1.$2");
            } else {
                continue;
            }

            if(!(lane in summary["lane_info"])){
                summary["lane_info"][lane] = {"project_id": [pid], "project_name": [pname]};
            } else if (summary["lane_info"][lane]["project_id"].indexOf(pid) == -1){
                summary["lane_info"][lane]["project_id"].push(pid);
                summary["lane_info"][lane]["project_name"].push(pname);
            } else{
                continue;
            }
        }
    }

    /*Retrieve information of lane yields and quality*/
    if (doc.hasOwnProperty('illumina') && doc.illumina.hasOwnProperty('Demultiplex_Stats') && doc.illumina['Demultiplex_Stats'].hasOwnProperty('Barcode_lane_statistics')){
        if(doc['illumina']['Demultiplex_Stats'].hasOwnProperty('Barcode_lane_statistics') && doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'].length >0){
            summary['demultiplexing']='Done';
        }
        if (doc.illumina['Demultiplex_Stats'].hasOwnProperty('Lanes_stats') && doc['illumina']['Demultiplex_Stats']['Lanes_stats'].length > 0){
            for (index in doc.illumina.Demultiplex_Stats.Lanes_stats){
                lane = doc.illumina.Demultiplex_Stats.Lanes_stats[index]['Lane'];
                summary["lane_info"][lane]["pf_clusters"] = doc.illumina.Demultiplex_Stats.Lanes_stats[index]["PF Clusters"];
                summary["lane_info"][lane]["q30_bases"] = doc.illumina.Demultiplex_Stats.Lanes_stats[index]["% >= Q30bases"];
            }
        }
        /*Retrive information of PhiX error rate*/
        if (doc.hasOwnProperty('lims_data') && doc.lims_data.hasOwnProperty('run_summary')){
            for (lane in doc.lims_data.run_summary){
                var er_rate=0;
                if (doc.lims_data.run_summary[lane].hasOwnProperty('% Error Rate R1')){
                    er_rate=doc.lims_data.run_summary[lane]['% Error Rate R1'];
                }
                if (doc.lims_data.run_summary[lane].hasOwnProperty('% Error Rate R2') && doc.lims_data.run_summary[lane]['% Error Rate R2'] != 0){
                    er_rate=(er_rate+doc.lims_data.run_summary[lane]['% Error Rate R2'])/2;
                }
                summary["lane_info"][lane]["er_rate"] = er_rate;
            }
        }

        /*yield is in Mb, but is displayed in Gb*/
        summary['yield']=0;
        var undetermined={1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0};

        for(barcode in doc.illumina['Demultiplex_Stats']['Barcode_lane_statistics']){
            if (doc.illumina['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['Index'] == 'Undetermined'){
                undetermined[doc.illumina['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['Lane']]+=1;
            }
            intLocalYield=parseInt(doc.illumina['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['Yield (Mbases)'].replace(/,/g, ""));
            summary['yield']=summary['yield']+intLocalYield;
        }
        summary['yield']=summary['yield']/1000;
        for (lane in undetermined){
            if (undetermined[lane]>1){
                /*if there is more than one undetermined indices, the actual yield is messed up, so we don't display it*/
                summary['yield']=0;
            }
        }
    }

    /*Retrieve running notes*/
    summary['running_notes']='';
    if (doc.hasOwnProperty('lims_data') && doc.lims_data.hasOwnProperty('container_running_notes') && Object.keys(doc['lims_data']['container_running_notes']).length>0){
        summary['running_notes']=doc['lims_data']['container_running_notes'];
    }

    // NovaSeq X Plus has more digits in the date, will mess up the sorting if not adjusted
    name_arr = doc["name"].split("_")
    run_date_original = name_arr[0]
    run_date = run_date_original.slice(-6)
    modified_name = [run_date, name_arr[1]].join('_')
    emit(modified_name, summary);
}
