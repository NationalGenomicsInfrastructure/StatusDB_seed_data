function(doc) {
  if(doc.entity_type == 'MultiQC_data'){
    emit( doc.project_id, doc);
  }
}