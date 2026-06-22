function(doc) {
  lane_projs = Object()
  for (sample in doc["samplesheet_csv"]){
    sample_id = doc["samplesheet_csv"][sample]["SampleID"]
    proj_id = sample_id.split("_")[0]
    lane = doc["samplesheet_csv"][sample]["Lane"]
    if (typeof(lane_projs[lane]) === 'undefined'){
      lane_projs[lane] = []
    }
    if (lane_projs[lane].indexOf(proj_id) === -1){
      lane_projs[lane].push(proj_id)
    }
  }

  for (lane in lane_projs){
    emit([doc["name"], lane], lane_projs[lane])
  }
}
