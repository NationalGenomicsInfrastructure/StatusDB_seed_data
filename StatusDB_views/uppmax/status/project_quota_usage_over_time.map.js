/*
 Used by genomics-status at:
  /api/v1/quotas/:id
*/

function(doc) {
  if (doc.hasOwnProperty("project")) {
    replace_project = doc["project"].replace("/","_");
    emit([replace_project, doc.time], [parseInt(doc["usage (GB)"]),
    parseInt(doc["quota limit (GB)"])]
);
  }
}
