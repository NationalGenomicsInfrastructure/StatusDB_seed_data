function(doc) {
    start_date = new Date(doc.start_time);
    emit(start_date, doc);
  }