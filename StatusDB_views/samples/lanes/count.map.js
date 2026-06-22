/*
 Used by genomics-status at:
  /api/v1/expected,
  /api/v1/plot/barcodes_vs_expected.png,
  /api/v1/plot/samples_per_lane.png,
  /api/v1/samples_per_lane
*/

function(doc) {
  emit([doc["flowcell"], doc["lane"], doc["sequence"]], parseInt(doc["bc_count"]));
}
