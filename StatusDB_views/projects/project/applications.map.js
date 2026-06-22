/*
 Used by genomics-status at:
  /api/v1/application/:id
*/

function(doc) {
  emit(doc["application"], doc["project_id"]);
}
