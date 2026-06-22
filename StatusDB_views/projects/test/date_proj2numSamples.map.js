function(doc) {
  if(doc.details.type != "Production") { exit; }
  if(doc.no_of_samples != null) {
    emit([doc.open_date, doc.project_name], parseInt(doc.no_of_samples))
  }
}