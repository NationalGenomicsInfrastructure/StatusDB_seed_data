function (doc) {
  if(doc.hasOwnProperty('invoice_spec_generated') && doc['invoice_spec_generated']!=='No invoicing'){
    if(doc.hasOwnProperty('invoice_spec_downloaded')){
      downloaded_date = new Date(doc["invoice_spec_downloaded"]).toISOString().split('T')[0];
      emit(downloaded_date, doc['project_id']);
    }
  }
}
