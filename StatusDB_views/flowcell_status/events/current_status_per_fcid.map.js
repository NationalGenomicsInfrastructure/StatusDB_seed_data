function(doc) {
  if (doc.flowcell_id && doc.events) {
    var status = {
      backed_up_to_pdc: false,
      transfer_started: false,
      transferred_to_hpc: false,
      sequencing_finished: false,
      cleaned_from_pdc: false,
      cleaned_from_ngi_data: false,
      cleaned_from_miarka: false,
      retrieved_from_pdc: false,
      samplesheet_updated: false
    };

    doc.events.forEach(function(event) {
      switch (event.event_type) {
        case "backed_up_to_pdc":
          status.backed_up_to_pdc = true;
          break;
        case "transfer_started":
          status.transfer_started = true;
          break;
        case "transferred_to_hpc":
          status.transferred_to_hpc = true;
          break;
        case "sequencing_finished":
          status.sequencing_finished = true;
          break;
        case "cleaned_from_pdc":
          status.cleaned_from_pdc = true;
          break;
        case "cleaned_from_ngi_data":
          status.cleaned_from_ngi_data = true;
          break;
        case "cleaned_from_miarka":
          status.cleaned_from_miarka = true;
          break;
        case "retrieved_from_pdc":
          status.retrieved_from_pdc = true;
          break;
        case "samplesheet_updated":
          status.samplesheet_updated = true;
          break;
      }
    });

    emit(doc.flowcell_id, status);
  }
}