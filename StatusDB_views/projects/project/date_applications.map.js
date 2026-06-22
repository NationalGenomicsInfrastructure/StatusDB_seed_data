/*
 Used by genomics-status at:
  /api/v1/applications
  /api/v1/applications.png
*/

function(doc) {
  var od = doc["open_date"];
  emit([od,doc["application"]], doc["project_id"]);
}

