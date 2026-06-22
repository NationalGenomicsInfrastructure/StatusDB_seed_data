/*
 Used by genomics-status at:
  /api/v1/sample_readcount/:id,
  /api/v1/sample_run_counts
*/

function(doc) {
  if (doc['bc_count']) {
    var sample_name = doc['barcode_name'].split("_index")
    var srun_info = Object()
    srun_info["read_count"] = +doc['bc_count']
    srun_info["index"] = doc["sequence"]
    srun_info["sample_run"] = doc["name"]

    emit([sample_name[0], doc['flowcell'], doc['lane']], srun_info)
  }
}
