function(doc) {
  if(doc.entity_type == 'MultiQC_data'){
    mqc_modules = [];
    for (s in doc.samples){
      mods = Object.keys(doc.samples[s]);
      for(i=0; i<mods.length; i++){
        if(mqc_modules.indexOf(mods[i]) > -1) {
         continue;
        }
        mqc_modules.push(mods[i]);
      }
    }
    emit( doc.project_id, mqc_modules);
  }
}