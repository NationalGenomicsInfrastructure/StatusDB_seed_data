function(doc) {
  if ('queued' in doc.details  && !('close_date' in doc)){
    var my_application=doc.details.application.toLowerCase();
  if (my_application == 'rna-seq (mrna)' || my_application == 'rna-seq (total rna)' || my_application == 'rna-seq (ribozero)'){
    my_application='rna-seq';
  }else if (my_application == 'wg re-seq (ign)'){
    my_application='wg re-seq';
  }else if(my_application == 'mirna-seq'){
    my_application='rna-seq smallrna';
  }
    var key=my_application;
    emit(key, Object.keys(doc.samples).length);
  }
}