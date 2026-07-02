function(doc) {
  if ('open_date' in doc){
    ar=doc['open_date'].split('-');
    
    var open_date = new Date(ar[0], ar[1], ar[2]);
    var cutoff = new Date(2013,07,01);
    if (open_date > cutoff){
	emit(doc.project_id, doc._id);

    }

  }
 }