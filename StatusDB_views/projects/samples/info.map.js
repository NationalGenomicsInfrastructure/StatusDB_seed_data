/*
 Used by genomics-status at:
  /api/v1/sample_info/:id
*/

function(doc) {
  for (s in doc["samples"]) {
    var info = Object()
    info["status"] = doc["samples"][s]["status"]
    info["ordered_m_reads"] = doc["min_m_reads_per_sample_ordered"]
    info["sequenced_m_reads"] = +doc["samples"][s]["m_reads_sequenced"]
    emit(s, info)
  }
}

