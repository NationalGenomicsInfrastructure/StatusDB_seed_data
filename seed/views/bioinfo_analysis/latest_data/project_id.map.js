function(doc) {
  summary={};
  summary[doc.run_id]={};
  default_date=new Date(1989,03,11) //Happy birthday
  for (datestring in doc.values){
	new_date=new Date(datestring);
	if (new_date>default_date){
	  default_date=new_date;
	  for (key in doc.values[datestring]){
		summary[doc.run_id][key]=doc.values[datestring][key];
          }
	  //summary[doc.run_id]=doc.values[datestring];
          summary[doc.run_id].timestamp=default_date.toISOString();
          
        }
  }
  summary[doc.run_id]["project_id"]=doc.project_id;
  summary[doc.run_id]["status"]=doc.status;
  
  
  emit(doc.project_id, summary);
}