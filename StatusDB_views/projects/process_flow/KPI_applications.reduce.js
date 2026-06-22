function(keys, values, rereduce){
  var result = {"Arrival date": "0000-00-00",
                "Queue date": "0000-00-00",
                "QC library finished": "0000-00-00",
                "All samples sequenced": "0000-00-00",
                "Close date": "0000-00-00"}
  for (k in result) {
    for (var i = 0; i < values.length; i++) {
      if (values[i][k] > result[k]){
        result[k] = values[i][k]
      }
      else if (values[i][k] == "0000-00-00") {
        // We use the date 0000-00-00 to indicate unfinished process
        result[k] = "0000-00-00"
	break;
      }
    }
  }

  return result
}
