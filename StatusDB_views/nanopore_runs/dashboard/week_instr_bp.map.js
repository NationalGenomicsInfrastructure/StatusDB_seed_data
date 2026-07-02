function(doc) {
    var prev_monday=null;
    var seqtype=null;
    var yd=0;
    var key= [];
  
    run_path = doc['run_path']
    path_parts = run_path.split("/")
    run_name = path_parts[path_parts.length - 1]
    // Some ids iclude the '20' century and some do not
    var d_str = run_name.split("_")[0].slice(-6);
  
    var run_date=new Date(parseInt('20' + d_str.slice(0,2)), parseInt(d_str.slice(2,4),10)-1, parseInt(d_str.slice(4,6),10));
  
  
    var dw = run_date.getDay();
    if (dw===0){
      prev_monday=new Date(run_date.getFullYear(), run_date.getMonth(), (run_date.getDate()-6));
    }else{
      prev_monday=new Date(run_date.getFullYear(), run_date.getMonth(), (run_date.getDate() - run_date.getDay() + 1));
    }
  
    d_str=prev_monday.getDate().toString();
  
    if (prev_monday.getDate()<10){
     d_str = "0"+d_str;
    }
    var m_str=(prev_monday.getMonth() + 1).toString();
    if (prev_monday.getMonth() + 1 < 10){
     m_str = "0"+m_str;
    }
    var prev_monday_str=prev_monday.getFullYear().toString() + "-" + m_str + "-" + d_str;
  
    seqtype = doc.protocol_run_info.device.device_type;
    seqtype_translation = {'PROMETHION': 'PromethION', 'MINION': 'MinION'}
    if (seqtype in seqtype_translation) {
        seqtype = seqtype_translation[seqtype];
    }
  
    key=[prev_monday_str, seqtype];
    acquisition = doc.acquisitions[doc.acquisitions.length - 1]
    yd_passed=parseInt(acquisition.acquisition_run_info.yield_summary.basecalled_pass_bases.replace(/,/g,''));
    yd_failed=parseInt(acquisition.acquisition_run_info.yield_summary.basecalled_fail_bases.replace(/,/g,''));
  
    yd = yd_passed + yd_failed;
    emit(key, yd);
}