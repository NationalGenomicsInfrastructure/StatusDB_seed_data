/**
  Used by pm sequencing report generation code
*/

function(doc) {
  emit(doc["_id"],doc["project_id"]);
}
