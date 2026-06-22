function(doc) {
  // NovaSeq X Plus has more digits in the date, will mess up the sorting if not adjusted
  name_arr = doc["name"].split("_")
  run_date_original = name_arr[0]
  run_date = run_date_original.slice(-6)
  modified_name = [run_date, name_arr[1]].join('_')
  emit(modified_name, null);
}
