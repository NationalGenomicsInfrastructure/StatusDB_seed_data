/*
 Used by genomics-status at:
  /api/v1/sample_insert_sizes/:id
*/

function(doc) {
  var ins_dist = null

  if (doc["picard_metrics"]["INS_hist"]) {
    if (doc["picard_metrics"]["INS_hist"]["fr_count"]) {
      ins_dist = doc["picard_metrics"]["INS_hist"]["fr_count"]
    }
    else if (doc["picard_metrics"]["INS_hist"]["All_Reads.fr_count"]) {
      ins_dist = doc["picard_metrics"]["INS_hist"]["All_Reads.fr_count"]
    }
  }

  emit(doc["name"], ins_dist);
}
