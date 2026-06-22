function(doc) {
    if (doc['status'] == 'ARCHIVING') {
        emit(doc['id'], doc['status']);
    }
}