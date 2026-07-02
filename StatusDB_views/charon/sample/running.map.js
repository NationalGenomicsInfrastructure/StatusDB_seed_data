/*Returns all samples taht have a 'UNDER_ANALYSIS' status*/

function(doc) {
        if (doc.charon_doctype === 'sample' && doc.analysis_status == 'UNDER_ANALYSIS'){ 
            emit([doc.projectid, doc.sampleid], doc);
        }
}
