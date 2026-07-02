/**
*
* View: id_name_dates
*
* To be used by: script to populate Production application meetings Trello boards
*
*/

function(doc) {
  order_date = "0000-00-00";
  open_date = "0000-00-00";
  queue_date = "0000-00-00";
  close_date = "0000-00-00";
  if (doc.details.order_received) {
    order_date = doc.details.order_received;
  }
  if (doc["open_date"]) {
    open_date = doc["open_date"]
  }
  if (doc.details.queued) {
    queue_date = doc.details.queued;
  }
  if (doc["close_date"]) {
    close_date = doc["close_date"]
  }
  emit(
      doc.project_id,         
      {
        "project_name": doc.project_name, 
        "portal_id": doc.details.portal_id, 
        "type": doc.details.type, 
        "application": doc.application, 
        "lib_prep": doc.details.library_construction_method, 
        "platform": doc.details.sequencing_platform,
        "order_date": order_date,  
        "open_date": open_date,  
        "queue_date": queue_date,  
        "close_date": close_date, 
        "no_of_samples": doc.no_of_samples, 
      });
}