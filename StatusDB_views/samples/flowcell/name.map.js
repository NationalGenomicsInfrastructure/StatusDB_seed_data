/*
 Used by genomics-status at:
  /api/v1/flowcells/:id
*/

function(doc) {
  emit(doc["date"] + "_" + doc["flowcell"], doc["name"]);
}
