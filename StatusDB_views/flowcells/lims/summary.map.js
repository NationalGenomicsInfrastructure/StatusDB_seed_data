function(doc) {
  if (doc.hasOwnProperty('lims_data')){
    data={};
    data['step_id']=doc.lims_data.step_id;
    data['container_id']=doc.lims_data.container_id;
    data['container_name']=doc.lims_data.container_name;
    emit(doc.name, data);
}
}