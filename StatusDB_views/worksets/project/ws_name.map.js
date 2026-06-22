function(doc) {
  for (project in doc['projects']){
  emit(project, doc.name);
}
}
