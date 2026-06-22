function(doc) {
    if (doc['status'] == 'SEQUENCING') {
        emit(doc['id'], doc['status']);
    }
}