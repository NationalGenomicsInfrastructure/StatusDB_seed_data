function(doc) {
  emit(doc['date'], [doc['name'], doc['url']]);
}