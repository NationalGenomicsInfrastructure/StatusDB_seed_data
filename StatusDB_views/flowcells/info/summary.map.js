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
  summary["pos"] = doc["name"][7];
  summary["reads"] = doc["RunInfo"]["Reads"]
  summary["number"] = doc["RunInfo"]["Number"]
  summary["recipe"] = doc["run_setup"]
  summary['demultiplexing']='Pending';
  summary["pdc_archived"] = doc["pdc_archived"];
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
        summary["mode"] = doc["RunParameters"]["RunMode"];
        summary["type"] = doc['RunParameters']['ApplicationName'];
        summary["fctype"] = doc['RunParameters']['Flowcell'];
        summary["appver"] = doc['RunParameters']['ApplicationVersion']; 
      }
  }  
  if (doc.hasOwnProperty('illumina') && doc.illumina.hasOwnProperty('Demultiplex_Stats') && doc.illumina['Demultiplex_Stats'].hasOwnProperty('Barcode_lane_statistics')){
      	if(doc['illumina']['Demultiplex_Stats'].hasOwnProperty('Barcode_lane_statistics') && doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'].length >0){
		summary['demultiplexing']='Done';
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
  emit(doc["name"], summary);
}
