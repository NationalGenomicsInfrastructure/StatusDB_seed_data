/* Returns a preview of the running note, with the note being truncated if it's 
    longer than a 10000 characters. The truncation is due to data limitations on 
    the reduce function
*/

function (doc) {
    var ret_doc = {}
    if ("note_type" in doc){
      var note_type = doc["note_type"].split("_")[0];
      if(note_type === "flowcell"){
        var fields = ["parent", "user", "email", "categories", "created_at_utc", "updated_at_utc", "note_type"];
        for(var i in fields){
           ret_doc[fields[i]] = doc[fields[i]];
        }
        if(doc['note'].length>3000){
          ret_doc['note'] = doc['note'].substring(0, 3000)+'``` \ntruncated after 3000 chars'
        }
        else{
          ret_doc['note'] = doc['note']
        }
        emit(doc._id.split(":")[0], ret_doc);
      }
    }
  }