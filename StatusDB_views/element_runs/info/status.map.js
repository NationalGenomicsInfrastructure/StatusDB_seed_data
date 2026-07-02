function(doc) {
    if (doc.hasOwnProperty('NGI_run_id')) {
        var NGI_run_id = doc['NGI_run_id'];
        var status = "unknown";
        if (doc.hasOwnProperty('run_status')) {
            status = doc['run_status'];
        }
        emit(NGI_run_id, status);
    }
}