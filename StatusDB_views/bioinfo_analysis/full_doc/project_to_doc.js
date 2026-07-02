function(doc) {
  if (doc.sample != null && doc.lane != null && doc.run_id != null) {
    emit(doc.project_id, doc);
  }
}