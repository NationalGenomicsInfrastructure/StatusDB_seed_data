/*
 Used by genomics-status at:
  /api/v1/expected,
  /api/v1/plot/barcodes_vs_expected.png
*/

function(doc) {
  if (doc['bc_count']) {
    emit([doc['flowcell'], doc['lane'], doc['sequence']], +doc['bc_count'] || 0);
  };
}