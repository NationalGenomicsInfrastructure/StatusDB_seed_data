/* required by taca deliver --cluster grus */ 
function(doc) {
     if (doc.orderportal_doctype !== 'order') return;
     if (!doc.identifier) return;     var project_id = '';
     for (i=0; i<doc.tags.length; i++) { 	
       if (doc.tags[i].indexOf('Project_ID') != -1) {
 	    project_id = doc.tags[i].replace('Project_ID:', ''); 	
	}     
    }     
    if (project_id != '') {
         emit(project_id, doc.owner);     
    }
 }
