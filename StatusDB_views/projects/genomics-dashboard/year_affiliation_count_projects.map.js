function(doc) {
  var my_affiliation=doc.affiliation.toLowerCase();
  if (my_affiliation == 'slu-uppsala' || my_affiliation == 'slu-umea' || my_affiliation == 'slu-alnarp'){
    my_affiliation = 'slu';
  }
  var key=[doc.details.queued.split('-')[0]+"-"+doc.details.queued.split('-')[1], my_affiliation];
  emit(key, 1);
}