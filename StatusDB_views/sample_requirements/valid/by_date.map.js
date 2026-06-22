function(doc) {
    if ('draft' in doc && !doc['draft']) {  
        emit(doc['issued_at'], doc);
    }
}
