/*
 Used by genomics-status at:
  /api/v1/cpu_hours/:id
*/

function(doc) {
  if (doc["project"]) {
    replace_project = doc["project"].replace("/","_");
    if (doc["cpu hours"] != null) {
	emit([replace_project, doc.time], [parseInt(doc["cpu hours"]),
	parseInt(doc["cpu limit"])]
	);
    }
  }
}
