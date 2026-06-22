function(doc) {
    emit(doc['RunInfo']['Id'], doc['_id']);
}
