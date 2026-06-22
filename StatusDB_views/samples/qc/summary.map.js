/*
 Used by genomics-status at:
  /api/v1/sample_summary/:id
*/

function(doc) {
  var summary = new Object();
  summary["flowcell_id"] = doc["flowcell"];
  summary["lane"] = doc["lane"];
  summary["sequence"] = doc["sequence"];
  emit(doc["name"], summary);
}
