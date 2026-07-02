/*
 Used by genomics-status at:
  /api/v1/last_updated
*/

function(doc) {
  emit(doc['modification_time'], doc['project_id']);
}
