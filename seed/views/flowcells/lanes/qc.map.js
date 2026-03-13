/*
 Used by genomics-status at:
  /api/v1/flowcell_qc/:id
*/

function(doc) {
  for (lane in doc["lanes"]) {

    var r1 = doc["illumina"]["Summary"]["read1"][lane];
    var r3 = doc["illumina"]["Summary"]["read3"][lane];

    emit([doc["name"], lane], {"read1": r1, "read3": r3});

  };
};
