function(doc) {
  var key = doc.RunInfo.Id;
  data={};
  data['id']=key;
  data['instrument']=doc.RunInfo.Instrument;
  if (data.instrument.indexOf('M') != -1){
    var ar = doc.RunParameters.ReagentKitVersion.split(" ");
    data['cver'] = ar[ar.length-1];
    //Added to fetch the Nano runs, 2 tiles for Nano
    data['mode'] = doc.RunParameters.Setup.NumTilesPerSwath;
  }else if (data.instrument.indexOf('D') != -1) {
    var ar = doc.RunParameters.Setup.Flowcell.split(" ");
    data['cver'] = ar[ar.length-1];
    if (doc.RunParameters.Setup.Flowcell.indexOf("Rapid") != -1){
      data['mode'] = "Rapid";
    }else{
      data['mode'] = "HighOutput";
      }
  }else if (data.instrument.indexOf('A') != -1) {
     //Note: Rethink this. What does mode and chemistry v. really mean?
     data['mode'] = doc.RunParameters.RfidsInfo.FlowCellMode;
     data['cver'] = doc.RunParameters.RfidsInfo.FlowCellMode;
  }else if (data.instrument.indexOf('N') != -1) {
     var ar = doc.RunParameters.Chemistry.split(" ");
     data['cver'] = ar[ar.length-1];
     if (doc.RunParameters.Chemistry.indexOf("Mid") != -1){
       data['mode'] = "Mid";
     }else{
       data['mode'] = "High";
     }
  }else if (data.instrument.indexOf('VH') != -1) {
     var ar = doc.RunParameters.FlowCellMode.match(/P[1,2,3]/)[0];
     data['cver'] = "NextSeq 2000" + ' ' + ar;
  }else if (data.instrument.indexOf('LH') != -1) {
    // NovaSeq X Plus has more digits in the date, will mess up the sorting if not adjusted
    key = key.slice(2);
    data['mode'] = doc.RunParameters.RecipeName.replace(' Sequencing','');
    data['cver'] = doc.RunParameters.RecipeName.replace(' Sequencing','');
  }else{
    var ar = doc.RunParameters.Setup.Flowcell.split(" ");
    data['cver'] = ar[ar.length-1];
  }

  data['total_clusters'] = parseInt(doc.illumina.Demultiplex_Stats.Flowcell_stats['Clusters(PF)'].replace(/,/g,''));
  data['total_yield'] = parseInt(doc.illumina.Demultiplex_Stats.Flowcell_stats['Yield (MBases)'].replace(/,/g,''))*1000000;
  data['lanes']=[];
  var onelane=null;
  for (lane in doc.illumina.Demultiplex_Stats.Lanes_stats){
    laneobj={};
    onelane=doc.illumina.Demultiplex_Stats.Lanes_stats[lane];
    laneobj['lane']=onelane['Lane'];
    laneobj['total_yield']=parseInt(onelane['Yield (Mbases)'].replace(/,/g, ''))*1000000;
    laneobj['total_clusters']=parseInt(onelane['PF Clusters'].replace(/,/g, ''));
    laneobj['mqs']=parseFloat(onelane['Mean QualityScore']);
    laneobj['perfect_match_pc']=parseFloat(onelane['% Perfectbarcode']);
    laneobj['one_mismatch_pc']=parseFloat(onelane['% One mismatchbarcode']);
    laneobj['overeq_q30_pc']=parseFloat(onelane['% >= Q30bases']);

    data['lanes'].push(laneobj);
  }

  emit(key, data);
}
