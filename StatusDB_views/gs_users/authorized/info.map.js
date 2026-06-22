/* This view is the authorative source for user roles
   in genomics-status */

function(doc) {
  if (doc["username"]!='genstat-defaults') {
    summary = {};
    summary['name'] = doc['name']
    summary['initials'] = doc["initials"];
    summary['roles'] = doc["roles"];
    summary['teams'] = doc["teams"];
    emit(doc["username"], summary);
  }
}