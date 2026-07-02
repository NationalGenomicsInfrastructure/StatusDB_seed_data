function(doc) {
  if (doc["creation_time"]) {
    var d = doc["creation_time"];
    var yy = d.substr(2,2)
    var mm = d.substr(5,2)
    var dd = d.substr(8,2)
    emit([yy, mm, dd]);
  }
}
