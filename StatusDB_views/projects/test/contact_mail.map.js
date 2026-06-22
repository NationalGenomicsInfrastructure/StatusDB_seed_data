function(doc) {
  var o = doc['order_details']['fields']['project_lab_email'];
  var c = doc['contact'];
  var count = 0;
  if(o == c) { count=1; }
  emit(doc['project_id'], count);
}