function (doc) {
  if (doc.status === "pending") {
    emit(doc._id, doc.status);
  }
}