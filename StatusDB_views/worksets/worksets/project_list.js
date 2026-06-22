function(doc) {
    project_list = [];
  
    for (var p in doc.projects){
      if(p!=='Control'){
        project_list.push(p);
      }
    }
    emit(doc.id, {project_list: project_list, name: doc.name});
}
