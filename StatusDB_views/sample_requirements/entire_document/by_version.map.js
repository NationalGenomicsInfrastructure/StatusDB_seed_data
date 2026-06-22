/* Used by genomics-status at /api/v1/sample_requirements */

function(doc) {
  /* Used to fetch the entire document using the version id */
  emit(doc['Version'], doc);
}
