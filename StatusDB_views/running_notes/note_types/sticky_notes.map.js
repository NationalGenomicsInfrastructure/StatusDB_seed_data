/*  THIS IS A PARTITIONED QUERY
 */
function (doc) {
    if ("categories" in doc){
      if(doc["categories"].indexOf("Sticky")>=0){
        var note = {};
        note["user"] = doc["user"];
        note["email"] = doc["email"];
        note["categories"] = doc["categories"];
        note["created_at_utc"] = doc["created_at_utc"];
        note["updated_at_utc"] = doc["updated_at_utc"];
        note["note"] = doc["note"];
        emit( doc.created_at_utc, note );
      }
    }
  }