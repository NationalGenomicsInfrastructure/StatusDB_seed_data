/* This view is the authorative source for login
   credentials to genomics-status */

function(doc) {
  emit(doc["username"], doc["_id"]);
}
