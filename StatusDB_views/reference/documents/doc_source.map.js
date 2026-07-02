function(doc) {
  emit(doc["_id"], doc["doc_source"]);
}
