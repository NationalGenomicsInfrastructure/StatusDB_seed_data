/*
 Used by genomics-status at:
  /api/v1/expected
  /api/v1/plot/barcodes_vs_expected.png
*/

function(doc) {
  for (lane in doc["lanes"]) {
    if (doc["lanes"][lane]["bc_metrics"]["unmatched"]) {
      emit([doc["name"].substr(7), lane], doc["lanes"][lane]["bc_metrics"]["unmatched"]);
    };
  };
};
