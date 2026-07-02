function(doc) {
  var my_application=doc.details.application.toLowerCase();
  if (doc.details.sample_type=='Finished Library' || 'isFinishedLib' in doc) {
    if (doc.details.type == 'Application') {
      my_application = 'application';
    }else if (my_application == 'rna-seq (mrna)' || my_application == 'rna-seq (total rna)' || my_application == 'rna-seq (ribozero)'){
      my_application='rna-seq';
    }else if (my_application == 'wg re-seq (ign)'){
      my_application='wg re-seq';
    }else if(my_application == 'mirna-seq'){
      my_application='rna-seq smallrna';
    }
    var key=[doc.details.queued.split('-')[0]+"-"+doc.details.queued.split('-')[1], my_application]
    emit(key, Object.keys(doc.samples).length);
  }
}
