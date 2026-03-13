function(doc) {
if (doc.status != "Ongoing"){
  emit(doc.run_id, doc);
}
}