/*
 Used by genomics-status at:
  /api/v1/samples_applications,
  /api/v1/samples_applications.png
*/

function(doc) {
  no_of_samples = +doc["no_of_samples"] || 0
  var od = doc["open_date"];
  emit([od,doc["application"]], no_of_samples);
}

