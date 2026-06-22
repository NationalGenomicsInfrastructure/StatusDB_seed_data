/*
 Used by genomics-status
  (in status/util.py, MainHandler)
  to display server status on the main page
*/
function(doc) {
  emit(doc.time, doc);
}