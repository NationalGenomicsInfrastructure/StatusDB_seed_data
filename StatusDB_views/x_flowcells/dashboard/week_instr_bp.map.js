function(doc) {
  var prev_monday=null;
  var seqtype=null;
  var yd=0;
  var key=new Array();

  var id_str=doc.RunInfo.Id;
  // Some ids iclude the '20' century and some do not
  var d_str = id_str.split("_")[0].slice(-6)
  var run_date=new Date(parseInt('20' + d_str.slice(0,2)), parseInt(d_str.slice(2,4),10)-1, parseInt(d_str.slice(4,6),10));
  var dw = run_date.getDay();
  if (dw==0){
    prev_monday=new Date(run_date.getFullYear(), run_date.getMonth(), (run_date.getDate()-6));
  }else{
    prev_monday=new Date(run_date.getFullYear(), run_date.getMonth(), (run_date.getDate() - run_date.getDay() + 1));
  }
  var d_str=prev_monday.getDate().toString();
  if (prev_monday.getDate()<10){
   d_str = "0"+d_str;
  }
  var m_str=(prev_monday.getMonth() + 1).toString();
  if (prev_monday.getMonth() + 1 < 10){
   m_str = "0"+m_str;
  }
  var prev_monday_str=prev_monday.getFullYear().toString() + "-" + m_str + "-" + d_str;

  if (doc.RunInfo.Instrument.indexOf('ST-E') != -1){
    seqtype="HiseqX";
  }else if (doc.RunInfo.Instrument.indexOf('D') != -1){
    seqtype="Hiseq";
  }else if (doc.RunInfo.Instrument.indexOf('M') != -1){
    seqtype="Miseq";
  }else if (doc.RunInfo.Instrument.indexOf('A') != -1){
    seqtype="NovaSeq 6000";
  }else if (doc.RunInfo.Instrument.indexOf('LH') != -1){
    seqtype="NovaSeqXPlus";
  }else if (doc.RunInfo.Instrument.indexOf('N') != -1){
    seqtype="NextSeq";
  }else if (doc.RunInfo.Instrument.indexOf('VH') != -1){
    seqtype="NextSeq 2000";
  }else{
    return '';
  }
  var key=[prev_monday_str, seqtype];
  yd=parseInt(doc.illumina.Demultiplex_Stats.Flowcell_stats["Yield (MBases)"].replace(/,/g,'')) * 1000000;
  emit(key, yd);
}