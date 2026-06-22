function(doc) {
  if (doc["bcbb_checkpoints"]){
    checkpoints = Object()
    for (cp in doc["bcbb_checkpoints"]){
      checkpoints[cp] = doc["bcbb_checkpoints"][cp]
    }
    checkpoints["flowcell_date"] = [doc["date"]]
    checkpoints["document_creation"] = [doc["creation_time"]]
    emit(doc["project_sample_name"], checkpoints);
  }
}
