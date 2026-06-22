function(doc) {
  emit([doc['flowcell'], doc['lane']], doc['sequence']);
}
