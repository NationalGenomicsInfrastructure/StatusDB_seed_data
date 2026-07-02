function(doc) {

  function last(list) {
      len = list.length
      return list[len - 1];
  }
  
  // Fetch key
  run_path = doc['run_path']
  run_name = last(run_path.split("/"))

  // FETCH DATA
  
  var last_acquisition = last(doc['acquisitions'])
  
  for (var output_type in last_acquisition["acquisition_output"]) {
    if (last_acquisition["acquisition_output"][output_type]["type"] == "SplitByBarcode") {
      var bcs = last_acquisition["acquisition_output"][output_type]["plot"][0]["snapshots"]
    }
  }
  
  var bc_info = new Object({});
  
  i = doc['protocol_run_info']['args'].indexOf('--barcoding')
  if (i != -1) {
      for (var bc in bcs) {
          
          bc_name = bcs[bc]["filtering"][0]["barcode_name"]
          last_snapshot = last(bcs[bc]["snapshots"])["yield_summary"]
          
          bc_info[bc_name] = {
            "barcode_alias" : bcs[bc]["filtering"][0]["barcode_alias"],
            "read_count": last_snapshot["read_count"],
            "basecalled_pass_read_count": last_snapshot["basecalled_pass_read_count"],
            "basecalled_fail_read_count":last_snapshot["basecalled_fail_read_count"],
            "basecalled_pass_bases": last_snapshot["basecalled_pass_bases"],
            "basecalled_fail_bases": last_snapshot["basecalled_fail_bases"]
          }
      }
  } else {
    bc_info = null
  }

  emit(run_name, bc_info);
}