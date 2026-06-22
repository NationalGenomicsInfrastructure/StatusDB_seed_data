/* Used by genomics-status at individual flowcell page */

function(doc) {
  if ('RunInfo' in doc) {
    full_name = doc.RunInfo.Id;
    emit(doc['name'], full_name);
  }
}
