function (doc) {
  var summary = {};
  // Copy all keys from doc to summary except 'json_schema' and 'form_groups'
  for (var key in doc) {
    if (key !== 'json_schema' && key !== 'form_groups') {
      summary[key] = doc[key];
    }
  }  
  emit([doc.status, doc.created], summary);
}