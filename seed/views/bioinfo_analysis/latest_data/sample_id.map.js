function(doc) {
  summary={};
  default_date=new Date(1989,03,11) //Happy birthday
  for (datestring in doc.values){
	new_date=new Date(datestring);
	if (new_date>default_date){
	  default_date=new_date;
	  for (key in doc.values[datestring]){
		summary[key]=doc.values[datestring][key];
          }
	  //summary=doc.values[datestring];
          summary.timestamp=default_date.toISOString();
          
        }
  }  
  
  if (doc.sample != null){
    emit([doc.project_id, doc.run_id, doc.lane, doc.sample], summary);
  }
}

