function(keys, values, rereduce){
  /* Any parameter except those explicitly mentioned here should be the same for all values */
  var result = Object();

  result["library_prep_start"] = "9999-99-99";
  result["qc_library_finished"] = "0000-00-00";
  result["sequencing_start_date"] = "9999-99-99";
  result["first_initial_qc_start_date"] = "9999-99-99";

  /* FIRST library prep start date */
  for (var i = 0; i < values.length; i++) {
    if ("library_prep_start" in values[i]) {
      if (result["library_prep_start"] > values[i]["library_prep_start"]){
        result["library_prep_start"] = values[i]["library_prep_start"];
      }
    }
  }

  /* LAST QC library finishd date */
  for (var i = 0; i < values.length; i++) {
    if ("qc_library_finished" in values[i]) {
      if (result["qc_library_finished"] < values[i]["qc_library_finished"]){
        result["qc_library_finished"] = values[i]["qc_library_finished"];
      }
    }
  }
  
  /* FIRST sequencing start date */
  for (var i = 0; i < values.length; i++) {
    if ("sequencing_start_date" in values[i]) {
      if (result["sequencing_start_date"] > values[i]["sequencing_start_date"]){
        result["sequencing_start_date"] = values[i]["sequencing_start_date"];
      }
    }
  }

  /* FIRST first_initial_qc_start_date */
  for (var i = 0; i < values.length; i++) {
    if ("first_initial_qc_start_date" in values[i]) {
      if (result["first_initial_qc_start_date"] > values[i]["first_initial_qc_start_date"]){
        result["first_initial_qc_start_date"] = values[i]["first_initial_qc_start_date"];
      }
    }
  }
  
  /* if no values are found */
  if (result["library_prep_start"] == "9999-99-99") {
    delete result["library_prep_start"];
  }
  if (result["qc_library_finished"] == "0000-00-00") {
    delete result["qc_library_finished"];
  }
  if (result["sequencing_start_date"] == "9999-99-99") {
    delete result["sequencing_start_date"];
  }
  if (result["first_initial_qc_start_date"] == "9999-99-99") {
    delete result["first_initial_qc_start_date"];
  }
  return result
}
