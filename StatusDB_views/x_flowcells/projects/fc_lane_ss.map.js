function(doc) {
  for (row in doc.samplesheet_csv){
    var fc = doc.RunInfo.Id;
    var lane = doc.samplesheet_csv[row].Lane;
    var pj = doc.samplesheet_csv[row].Sample_Project;
    if (pj != null){
      emit([pj, fc,lane], doc.samplesheet_csv[row]);
    }
  }
 }