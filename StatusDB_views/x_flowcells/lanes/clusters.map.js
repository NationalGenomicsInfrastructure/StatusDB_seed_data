function(doc) {
  var key='';
  var vk = '';
  var obj={};
  var cl=0;
  if ('RunParameters' in doc && 'Setup' in doc['RunParameters'] && 'Flowcell' in doc['RunParameters']['Setup'] && doc['RunParameters']['Setup']['Flowcell'].indexOf('HiSeq X') != -1){ 
  if ('illumina' in doc && 'Demultiplex_Stats' in doc['illumina'] && 'Lanes_stats' in doc['illumina']['Demultiplex_Stats']){
    for (laneid in doc['illumina']['Demultiplex_Stats']['Lanes_stats']){
      vk=doc['RunInfo']['Id']+':'+doc['illumina']['Demultiplex_Stats']['Lanes_stats'][laneid]['Lane'];
      if ('Clusters' in doc['illumina']['Demultiplex_Stats']['Lanes_stats'][laneid]){
        cl=parseInt(doc['illumina']['Demultiplex_Stats']['Lanes_stats'][laneid]['Clusters'].replace(/,/g,''));
      }else if('PF Clusters' in doc['illumina']['Demultiplex_Stats']['Lanes_stats'][laneid]){
	cl=parseInt(doc['illumina']['Demultiplex_Stats']['Lanes_stats'][laneid]['PF Clusters'].replace(/,/g,''));
      }
       
      emit(vk, cl);
      
    }
  } 
  }
}