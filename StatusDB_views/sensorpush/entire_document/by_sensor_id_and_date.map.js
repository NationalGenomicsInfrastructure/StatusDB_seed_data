function (doc) {
    emit([doc['sensor_id'], doc['start_date_midnight']], doc);
}
