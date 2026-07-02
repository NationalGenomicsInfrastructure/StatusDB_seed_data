function(doc) {
  emit(doc["entity_type"], doc["_id"]);
}
