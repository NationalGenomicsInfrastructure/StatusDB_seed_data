/* Used by genomics-status at /api/v1/pricing_components */

function (doc) {
  if (!doc['Draft']) {
    emit(doc['Version'], doc);
  }
}
