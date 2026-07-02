/* Should usually be used with the _sum reduce function */
function(doc) {
  if (!("details" in doc)) {
    doc["details"] = {"flowcell": "NA", "sequencing_platform": "NA", "sequence_units_ordered_(lanes)": 0}
  }

  var flowcell = "";
  if (!("flowcell" in doc["details"]) || doc["details"]["flowcell"] === ""){
    flowcell = "NA";
  } else {
    flowcell = doc["details"]["flowcell"];
  }

  var lanes_ordered = 0;
  if ("sequence_units_ordered_(lanes)" in doc["details"]){
    lanes_ordered = doc["details"]["sequence_units_ordered_(lanes)"];
  }

  var platform = "NA";
  if ("sequencing_platform" in doc["details"]){
    platform = doc["details"]["sequencing_platform"];
  }

  emit([doc["status_fields"]["status"].toLowerCase(), platform, flowcell, doc["project_id"]], lanes_ordered);
}