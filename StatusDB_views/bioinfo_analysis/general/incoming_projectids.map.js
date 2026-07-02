function(doc) {
  if (doc.status == "Incoming"){
  emit(doc.project_id, null);
}
}