function (doc) {
  if (doc.status === "encrypted") {
    emit(doc._id, doc.status);
  }
}