// filters out worksets with control projects and returns project names and Project numbers for such worksets

function(doc) {
  ws_projects = {};
  const re_positive_control = /p.ositive*/i;
  const re_negative_control = /n.egative*/i;
  var is_control = false;
  
  for (var p in doc.projects){
    ws_projects[doc.projects[p]["name"]] = p;
    if(re_positive_control.test(doc.projects[p]["name"]) || re_negative_control.test(doc.projects[p]["name"])){
      is_control = true;
    }  
  }
  if(is_control){
    emit([doc.id, doc.name], ws_projects); 
  }
}
