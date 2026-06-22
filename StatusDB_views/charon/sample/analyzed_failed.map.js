/*Returns all samples taht have a 'FAILED' status*/

function(doc) {
        if (doc.charon_doctype === 'sample' && (doc.analysis_status == 'FAILED' || doc.analysis_status == 'ANALYZED')){ 
            emit([doc.projectid, doc.sampleid], doc);
        }
}
