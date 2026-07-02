/*
 Used by genomics-status at:
  /project/([^/]*)
*/

function(doc) {
  emit(doc.project_id, doc["details"]["library_construction_method"]);
}