function(doc) {
  emit(doc['sequence'], [doc['flowcell'], doc['lane']]);
}
