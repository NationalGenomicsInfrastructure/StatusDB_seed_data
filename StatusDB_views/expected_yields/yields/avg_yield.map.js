function(doc) {
  emit([doc.instrument, doc.chemistry, doc.mode], doc.expected_yield);
}