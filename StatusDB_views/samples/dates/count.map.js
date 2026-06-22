function(doc) {
  d = doc["date"];
  emit([d[0] + d[1], d[2] + d[3], d[4] + d[5]], doc["name"]);
}
