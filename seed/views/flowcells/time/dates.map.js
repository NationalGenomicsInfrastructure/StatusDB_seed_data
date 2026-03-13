function(doc) {
  var date_name = doc["name"].split("_");
  var d = date_name[0];
  emit([d.substr(0,2), d.substr(2,2), d.substr(4,2)], doc["name"]);
}
