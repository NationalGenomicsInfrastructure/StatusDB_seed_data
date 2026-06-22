function(doc) {
  emit(doc['card_id'], doc['_id']);
}