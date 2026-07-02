function(doc) {
    var proj_in_fc = {}
    for (sample in doc["samplesheet_csv"]){
        var proj_id = doc["samplesheet_csv"][sample]["SampleID"].split("_")[0]
        proj_in_fc[proj_id] = true
    }
    emit(doc["name"], Object.keys(proj_in_fc))
}
