function (doc) {
    if(doc["web_user"]===false)
        emit(doc["key"]["key_id"], doc["key"]);
}