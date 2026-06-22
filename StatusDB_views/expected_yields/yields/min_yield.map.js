function(doc) {
  if(doc.status == "active"){
    emit([doc.instrument, doc.chemistry, doc.mode], doc.minimum_yield);
  }
}
