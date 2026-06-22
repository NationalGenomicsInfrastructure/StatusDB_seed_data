function(doc) {
  if (doc.details.type == 'Production' && 'close_date' in doc && !('aborted' in doc.project_summary)){
    var my_application = doc.details.application.toLowerCase();
    if (doc.details.sample_type=='Finished Library' || 'isFinishedLib' in doc) {
	my_application = "finished library"
    }else if (my_application == 'rna-seq (mrna)' || my_application == 'rna-seq (total rna)' || my_application == 'rna-seq (ribozero)'){
      my_application='rna-seq';
    }else if (my_application == 'wg re-seq (ign)'){
      my_application='wg re-seq';
    }else if(my_application == 'mirna-seq'){
      my_application='rna-seq smallrna';
    }

    var q_date=new Date(doc.details.queued);
    var d_date=new Date(doc.close_date);
    if ('all_raw_data_delivered' in doc.details){
      d_date=new Date(doc.details.all_raw_data_delivered);
    }else if ('all_raw_data_delivered' in doc.project_summary){
      d_date=new Date(doc.project_summary.all_raw_data_delivered);
    }
    var w_diff=(d_date - q_date)/1000/60/60/24;
    var key=[doc.details.queued.split('-')[0]+"-"+doc.details.queued.split('-')[1], my_application];
    emit(key, w_diff);
  }
}