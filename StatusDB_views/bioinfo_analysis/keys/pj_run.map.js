function(doc) {
  emit([doc.project_id, doc.run_id], doc._id);
}