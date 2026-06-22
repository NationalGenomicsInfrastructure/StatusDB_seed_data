/*
 Used by genomics-status at:
  /api/v1/last_updated
*/

function(doc) {
  if(doc.hasOwnProperty("project")){
    emit(doc['time'], doc['project'])
  }
}