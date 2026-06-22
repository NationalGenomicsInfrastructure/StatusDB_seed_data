function(doc) {
  for (row in doc.samplesheet_csv){
    var value = doc.RunInfo.Id + ":" + doc.samplesheet_csv[row].Lane;
    var pj = doc.samplesheet_csv[row].Sample_Project;
    if (pj != null){
      emit([pj, value], null);
    }
  }
 }