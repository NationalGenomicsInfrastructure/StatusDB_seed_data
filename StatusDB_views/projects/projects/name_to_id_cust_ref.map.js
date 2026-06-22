function(doc) {
    emit(doc['project_name'], [doc['project_id'], doc.details['customer_project_reference'], doc.details["portal_id"]])
}
