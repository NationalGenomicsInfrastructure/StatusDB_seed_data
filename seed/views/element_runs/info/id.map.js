function(doc) {
  if (doc.hasOwnProperty('NGI_run_id')) {
    var run_id = doc['NGI_run_id'];
    emit(run_id, doc['_id']);
  } else {
    emit('NGI_run_id_missing', doc['_id']);
  }
}
