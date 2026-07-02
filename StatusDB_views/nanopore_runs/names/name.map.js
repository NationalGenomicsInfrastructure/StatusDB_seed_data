// Very simple, robust view to navigate in CouchDB

function(doc) {

    function last(list) {
        len = list.length
        return list[len - 1];
    }

    // Fetch key
    run_path = doc['run_path']
    run_name = last(run_path.split("/"))

    emit(run_name, null);
}