function(doc) {
  emit(doc['server'], doc['_id']);
}