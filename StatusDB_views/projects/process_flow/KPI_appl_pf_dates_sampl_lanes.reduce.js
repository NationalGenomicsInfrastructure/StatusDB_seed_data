/**
 * Reduce function - shouldn't really be needed
 */
function(keys, values, rereduce){
  var result = {"Arrival date": "0000-00-00",
                "Queue date": "0000-00-00",
                "Lib prep start": "0000-00-00",
                "QC library finished": "0000-00-00",
                "Sequencing start": "9999-99-99",
                "All samples sequenced": "0000-00-00",
                "Close date": "0000-00-00",
                "Samples": null,
                "Lanes": null
                }

  res: for (var k in result) {
    for (var i = 0; i < values.length; i++) {
      if (k == "Samples" || k == "Lanes") { // add up the values for samples and lanes when reducing
        result[k]+= values[i][k]; 
        continue; 
      }
      if (k == "Sequencing start") {
        if(values[i][k] == "0000-00-00") {
          result[k] = "0000-00-00";
        } else if (values[i][k] < result[k]) {
          result[k] = values[i][k]
        }
        continue;
      }
      if (values[i][k] > result[k]){
        result[k] = values[i][k]
      } else if (values[i][k] == "0000-00-00") {
        // We use the date 0000-00-00 to indicate unfinished process
        result[k] = "0000-00-00";
        continue res;
      }      
    }
  }
  //for (var i = 0; i < values.length; i++) {
  //  for (k in result) {
  //    if (k == "Samples" || k == "Lanes") { // add up the values for samples and lanes when reducing
  //      result[k]+= values[i][k]; 
  //      continue; 
  //    }
  //    if (values[i][k] > result[k]){
  //      result[k] = values[i][k]
  //    }
  //    else if (values[i][k] == "0000-00-00") {
  //      // We use the date 0000-00-00 to indicate unfinished process
  //      result[k] = "0000-00-00"
  //    }
  //  }
  //}

  return result
}