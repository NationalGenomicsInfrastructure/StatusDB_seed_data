/*
 Used by genomics-status at:
  /api/v1/uppmax_projects
*/

/* forward slashes are replaced to avoid problems with http calls and */
/* jquery parsing in genomics-status /Johannes Alneberg */
function(doc) {
  if (doc.hasOwnProperty("project")) {
    replaced_project_name = doc["project"].replace("/","_");
    emit(replaced_project_name, doc["usage (GB)"]);
  }
}