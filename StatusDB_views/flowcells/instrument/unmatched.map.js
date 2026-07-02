/*
 Used by genomics-status at:
  /api/v1/instrument_unmatched,
  /api/v1/instrument_unmatched.png
*/

function(doc) {
  var unmatched = []
  for (lane in doc["lanes"]) {
    if (doc["lanes"][lane]["bc_metrics"]["unmatched"]) {
      unmatched.push(doc["lanes"][lane]["bc_metrics"]["unmatched"]);
    };
  };
  emit([doc["RunInfo"]["Date"], doc["RunInfo"]["Instrument"]], unmatched);
};
