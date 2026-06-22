function(doc) {
  var key='';
  var vk = '';
  var obj={};
  var cl=0;
  var l_seen_once=[];
  var s_seen_once=[];
  var l_seen_twice=[];
  if ('illumina' in doc && 'Demultiplex_Stats' in doc['illumina'] && 'Barcode_lane_statistics' in doc['illumina']['Demultiplex_Stats']){
    for (barcode in doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics']){
      key=doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['Sample'];
      if (key.indexOf("Sample_")!= -1){
        key=key.substr(7);
      }      
      vk=doc['RunInfo']['Id']+':'+doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['Lane'];
      if ('Clusters' in doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]){
        cl=parseInt(doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['Clusters'].replace(/,/g,''));
      }else if('PF Clusters' in doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]){
	cl=parseInt(doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['PF Clusters'].replace(/,/g,''));
      }
      q30=parseFloat(doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['% >= Q30bases']);
      obj={fcp: vk,cl : cl, q30 : q30};
   
      if (['', 'Undetermined', 'unknown'].indexOf(key)== -1){
        if (l_seen_once.indexOf(obj.fcp) != -1){
          l_seen_twice.push(obj.fcp);
        }else{
          l_seen_once.push(obj.fcp);
          s_seen_once.push(key);
        }
        emit(key, obj);
      }
    }
    for (barcode in doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics']){
      vk=doc['RunInfo']['Id']+':'+doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['Lane'];
      if (['', 'Undetermined', 'unknown'].indexOf(doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['Sample']) != -1 && l_seen_once.indexOf(vk) != -1 && l_seen_twice.indexOf(vk)==-1){
        key=s_seen_once[l_seen_once.indexOf(vk)];
        if ('Clusters' in doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]){
          cl=parseInt(doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['Clusters'].replace(/,/g,''));
        }else if('PF Clusters' in doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]){
	  cl=parseInt(doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['PF Clusters'].replace(/,/g,''));
        }
        q30=parseFloat(doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][barcode]['% >= Q30bases']);
        vk=vk + "_UD";
        obj={fcp: vk,cl : cl, q30 : q30};
	emit(key,obj);   
      }
    }
  }
}