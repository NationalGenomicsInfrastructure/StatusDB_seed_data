function(doc) {
  // This is made to mimic the x_flowcells info/name view
  // need this since common code in TACA uses the info/name to get the document
  if (doc.hasOwnProperty('NGI_run_id')) {
    var run_id = doc['NGI_run_id'];
    emit(run_id, doc);
  } else {
    emit('NGI_run_id_missing', doc);
  }
}