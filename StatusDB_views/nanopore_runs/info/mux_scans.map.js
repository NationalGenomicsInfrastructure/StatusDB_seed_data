function (doc) {
  
  function last(list) {
    var len = list.length;
    return list[len - 1];
  }
  
  // Fetch key
  var run_path = doc['run_path'];
  var run_name = last(run_path.split("/"));

  // Fetch value
  var user_messages = doc["user_messages"];

  var mux_scans = [];
  
  for (var i = 0; i < user_messages.length; i++) {
    var user_message = user_messages[i];
    if (user_message["identifier"] == "mux_scan_result" || user_message["identifier"] == "channel_scan_result") {
      mux_scans.push({
        "num_pores": user_message["extra_data"]["num_pores"],
        "total_pores": user_message["extra_data"]["total_pores"],
        "time": user_message["time"]
      });
    }
  }

  emit(run_name, mux_scans);
}