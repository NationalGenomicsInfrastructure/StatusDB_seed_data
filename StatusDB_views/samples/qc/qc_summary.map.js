/*
 Used by genomics-status at:
  /api/v1/qc/:id
*/

function(doc) {
  var s_summary = new Object();

  s_summary["bc_count"] = doc["bc_count"];

  if (doc["picard_metrics"]["AL_PAIR"]) {
    s_summary["pct_aligned"] = doc["picard_metrics"]["AL_PAIR"]["PCT_READS_ALIGNED_IN_PAIRS"];
  };

  if (doc["picard_metrics"]["DUP_metrics"]) {
    s_summary["pair_duplicates"] = doc["picard_metrics"]["DUP_metrics"]["PERCENT_DUPLICATION"];
  };

  if (doc["picard_metrics"]["INS_metrics"]) {
    s_summary["insert_size"] = doc["picard_metrics"]["INS_metrics"]["MEAN_INSERT_SIZE"];
  };

  if (doc["picard_metrics"]["HS_metrics"]) {
    s_summary["on_target"] = doc["picard_metrics"]["HS_metrics"]["PCT_USABLE_BASES_ON_TARGET"];
    s_summary["mean_target_coverage"] = doc["picard_metrics"]["HS_metrics"]["MEAN_TARGET_COVERAGE"];
    s_summary["x10x_coverage_targets"] = doc["picard_metrics"]["HS_metrics"]["PCT_TARGET_BASES_10X"];
    s_summary["zero_coverage_targets"] = doc["picard_metrics"]["HS_metrics"]["ZERO_CVG_TARGETS_PCT"];
  };

  emit(doc["name"], s_summary);
}
