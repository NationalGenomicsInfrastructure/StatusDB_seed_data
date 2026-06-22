/*
 Used by genomics-status at:
  /api/v1/sample_coverage/:id
*/

function(doc) {
  var cov_sum = null;

  if (doc["picard_metrics"]["HS_metrics"]) {
    cov_sum = []
    cov_sum.push(doc["picard_metrics"]["HS_metrics"]["PCT_TARGET_BASES_2X"]);
    cov_sum.push(doc["picard_metrics"]["HS_metrics"]["PCT_TARGET_BASES_10X"]);
    cov_sum.push(doc["picard_metrics"]["HS_metrics"]["PCT_TARGET_BASES_20X"]);
    cov_sum.push(doc["picard_metrics"]["HS_metrics"]["PCT_TARGET_BASES_30X"]);
  };

  emit(doc["name"], cov_sum);
}
