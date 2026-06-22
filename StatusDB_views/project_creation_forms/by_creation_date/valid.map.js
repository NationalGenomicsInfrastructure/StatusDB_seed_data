function (doc) {
  if (doc.status == 'valid') {
    emit(doc.created);
  }
}