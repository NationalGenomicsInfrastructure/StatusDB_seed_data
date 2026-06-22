function(doc) {
  var obj={};
  for (var sa in doc.samples){
    obj[sa] = doc.samples[sa].details.customer_name;
  }
  emit(doc.project_id, obj);
  emit(doc.project_name, obj);
}