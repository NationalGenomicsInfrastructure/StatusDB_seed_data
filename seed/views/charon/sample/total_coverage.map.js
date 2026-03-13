
function(doc) {
    if (doc.charon_doctype === 'sample'){
        emit('TOTAL', doc.total_autosomal_coverage);
    }
}

