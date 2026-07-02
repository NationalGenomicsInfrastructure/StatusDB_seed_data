/*
 Used by genomics-status at:
  /api/v1/flowcell_demultiplex/:id,
  /api/v1/plot/reads_per_lane.png
*/

function(doc) {
  for (lane in doc["lanes"]) {
    var demultiplex = Object()
    var bc_metrics = doc["lanes"][lane]["bc_metrics"]

    matched = 0
    for (index in bc_metrics) {
      if (index != "unmatched") {
        matched += bc_metrics[index];
      }
    }

    demultiplex["matched"] = matched;
    demultiplex["yield"] = matched + bc_metrics["unmatched"];
    demultiplex["demultiplexed"] = demultiplex["matched"] / demultiplex["yield"];

    emit([doc["name"], lane], demultiplex);

  };
};
