function(doc) {
  if(doc.details.type != "Production") { exit; }
  var lanes = doc["details"]["sequence_units_ordered_(lanes)"];
  if(lanes != null) {
    emit([doc.open_date, doc.project_name], lanes)
  }
}