function (doc) {
  
  function last(list) {
    len = list.length
    return list[len - 1];
  }
  
  // Fetch key
  run_path = doc['run_path']
  run_name = last(run_path.split("/"))
  
  // Fetch all cmd arguments for safe-keeping
  args = doc['protocol_run_info']['args']

emit(run_name, args);
}