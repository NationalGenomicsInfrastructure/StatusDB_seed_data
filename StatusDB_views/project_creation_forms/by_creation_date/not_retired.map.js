function (doc) {
  if (doc.status != 'retired') {
    emit([doc.status, doc.created]);
  }
}