function(doc) {
  if (doc.status == "Ongoing"){
  emit(doc.project_id, null);
}
}