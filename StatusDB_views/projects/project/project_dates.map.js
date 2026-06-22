/**
*
* View: project_dates
*
* Used by: pm report closed-projects
*
*/

function(doc) {
  open_date = "0000-00-00"
  close_date = "0000-00-00"
  aborted = "0000-00-00"
  if (doc["open_date"]) {
    open_date = doc["open_date"]
  }
  if (doc["close_date"]) {
    close_date = doc["close_date"]
  }
  if (doc["details"] && doc["details"]["aborted"]) {
    aborted = doc["details"]["aborted"]
  }
  emit(doc["project_name"], {
    "open_date": open_date,
    "close_date": close_date,
    "aborted": aborted
  });
}
