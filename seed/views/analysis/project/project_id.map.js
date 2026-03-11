function(doc) {
  var project_id=Object.keys(doc.samples)[0].split('_')[0];
  emit(project_id, doc);
}