function(doc) {
  if (doc.details.type == 'Production' && 'close_date' in doc && !('aborted' in doc.project_summary)){
    var q_date=new Date(doc.details.queued);
    var d_date=new Date(doc.close_date);
    if ('all_raw_data_delivered' in doc.details){
      d_date=new Date(doc.details.all_raw_data_delivered);
    }else if ('all_raw_data_delivered' in doc.project_summary){
      d_date=new Date(doc.project_summary.all_raw_data_delivered);
    }
    var w_diff=(d_date - q_date)/1000/60/60/24/7;
    var subkey="unknown";
    if (w_diff<6){
      subkey="0-6 w";
    }else if (w_diff<12){
      subkey="6-12 w";
    }else if (w_diff<24){
      subkey="12-24 w";
    }else{
      subkey="24+ w";
    }
    var key=[doc.details.queued.split('-')[0]+"-"+doc.details.queued.split('-')[1], subkey];
    emit(key, 1);
  }
}