function(doc) {
  for (sample in doc["samples"]) {
    var status = doc["samples"][sample]["details"]["status_(manual)"];
    if(status) { emit([doc.project_id, sample], status);}
  }
}
