// Used for NGI_dashboards
function(doc) {
  for (project in doc['projects']){
    var ws_proj = Object();
    ws_proj[doc.name] = Object();
    ws_proj[doc.name]['samples'] = doc['projects'][project]['samples'];
    ws_proj[doc.name]['date_run'] = doc['date_run'];
    ws_proj[doc.name]['last_aggregate'] = doc['last_aggregate'];
    emit(project, ws_proj);
  }
}
