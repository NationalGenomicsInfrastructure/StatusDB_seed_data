function (doc) {
    emit([doc.file_name, doc.inst_id], doc.run_finished);
  }