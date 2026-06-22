function(doc) {
    if (doc['status'] == 'ARCHIVED') {
        emit(doc['id'], doc['status']);
    }
}