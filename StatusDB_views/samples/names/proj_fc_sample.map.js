function(doc) {
  emit([doc['sample_prj'],doc['date']+'_'+doc['flowcell']], doc['barcode_name']);
}
