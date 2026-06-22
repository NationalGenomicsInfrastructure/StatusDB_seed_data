function(doc) {
  var summary = {
    first_generated: null,
    run_setup: null,
    instrument_type: null
  }
  if (doc.hasOwnProperty('flowcell_id') && (doc.hasOwnProperty('metadata'))) {
    if (doc.metadata.hasOwnProperty('first_generated')) {
      summary['first_generated'] = doc.metadata.first_generated;
    }
    if (doc.metadata.hasOwnProperty('run_setup')) {
      summary['run_setup'] = doc.metadata.run_setup;
    }
    if (doc.metadata.hasOwnProperty('instrument_type')) {
      summary['instrument_type'] = doc.metadata.instrument_type;
    }
    emit(doc.flowcell_id, summary);
  }
}