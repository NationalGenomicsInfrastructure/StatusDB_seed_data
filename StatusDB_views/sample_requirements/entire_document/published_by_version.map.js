/* Used by genomics-status at /api/v1/sample_requirements */

function (doc) {
  if (!doc['Draft']) {
    emit(doc['Version'], doc);
  }
}
