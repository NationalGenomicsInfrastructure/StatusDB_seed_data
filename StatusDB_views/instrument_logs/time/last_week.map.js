function(doc) {
  var now=new Date();
  var then=new Date(doc.timestamp);
  var days_diff=(now-then)/1000/60/60/24;
  if (days_diff<7){
    emit(doc.timestamp, doc);
  }
}