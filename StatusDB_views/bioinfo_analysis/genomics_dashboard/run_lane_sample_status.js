function(doc) {
  if (doc.sample != null && doc.lane != null && doc.run_id != null) {
    last_entry = "0000-00-00";
    for (entry in doc.values) {
      if (entry > last_entry) {
        last_entry = entry;
      }
    }
    run_lane = doc.run_id + "_" + doc.lane;
    emit([doc.project_id, run_lane], doc['values'][last_entry]);
  }
}
