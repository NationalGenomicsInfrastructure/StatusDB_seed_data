function (doc) {
  if(doc.hasOwnProperty('invoice_spec_generated') && doc['invoice_spec_generated']!=='No invoicing'){
    if(!doc.hasOwnProperty('invoice_spec_downloaded')){
      result = {};
      //Leaving as placeholder, since agreement_doc_id might be needed in the future
      result["agreement_doc_id"] = "";
      result["invoice_spec_generated"] = doc['invoice_spec_generated'];
      result["project_name"] = doc["project_name"];
      result["project_status"] = doc["status_fields"]["status"];
      emit(doc['project_id'], result);
    }
  }
}
