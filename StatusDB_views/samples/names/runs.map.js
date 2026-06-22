/*
 Used by genomics-status at:
  /api/v1/samples/:id
*/

function(doc) {
  if (doc["barcode_name"]) {
    var s_idx_t = doc["barcode_name"].split("_index");
    emit(s_idx_t[0], doc["name"]);
  }
}
