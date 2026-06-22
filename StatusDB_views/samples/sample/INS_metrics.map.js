function(doc) {
  if(doc.hasOwnProperty('picard_metrics') && doc.picard_metrics.hasOwnProperty('INS_metrics')){
  emit(doc.name, doc.picard_metrics.INS_metrics);
}
}