/*
 Used by genomics-status at:
  /api/v1/projects/:id
*/

function(doc) {
  //Patching samples reads_min
  if ("reads_min" in doc.details){
    for(sample in doc["samples"]){
      if (! ('reads_min' in doc.samples[sample].details)){
        doc.samples[sample].details['reads_min']=doc.details['reads_min'];
      } 
    }
   }
  emit(doc["project_id"], doc["samples"])
}
