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
  if('instrument_type' in doc){
    summary.instrument_type = doc.instrument_type;
  }
  else{
     summary.instrument_type = 'illumina';
  }
  if('instrument' in doc){
    summary.instrument = doc.instrument;
  }
  // needed for the delivery page, to show only projects which were not closed
  if (doc.sample != null && (summary['sample_status'] != 'Closed' && !doc.hasOwnProperty('project_closed'))) {
    emit([doc.project_id, doc.run_id, doc.lane, doc.sample], summary);
  }
}
