function(doc) {
  var key='';
  var vk = '';
  var obj={};
  var cl=0; 
  if ('illumina' in doc && 'Demultiplex_Stats' in doc['illumina'] && 'Barcode_lane_statistics' in doc['illumina']['Demultiplex_Stats']){
    for (barcode in doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics']){
      key=doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['Sample ID'];
      if (key.indexOf("Sample_")!= -1){
        key=key.substr(7);
      }      
      vk=doc['RunInfo']['Id']+':'+doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['Lane'];
      cl=parseInt(doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['# Reads'].replace(/,/g,''));
      q30=parseFloat(doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['% of >= Q30 Bases (PF)']);
      obj={fcp: vk,cl : cl,q30 : q30};
   
      if (['', 'Undetermined', 'unknown'].indexOf(key)== -1){
        emit(key, obj);
      }
    }
  } 
 
}