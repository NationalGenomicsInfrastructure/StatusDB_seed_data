function(doc) {
    result = {};
    if (doc.staged_files) {
        filesize_sum = 0;
        for (var sample_id in doc.staged_files) {
            for (var file_name in doc.staged_files[sample_id]) {
                filesize_sum += doc.staged_files[sample_id][file_name]['size_in_bytes'];
            }
        }
        result['filesize_in_bytes'] = filesize_sum;
        result['project_name'] = doc.project_name;
        result['close_date'] = doc['close_date'];
        result['application'] = doc['application'];
        result['sequencing_platform'] = doc['details']['sequencing_platform'];
        result['type'] = doc['details']['type'];
        result['sample_type'] = doc['details']['sample_type'];
        result['best_practice_bioinformatics'] = doc['details']['best_practice_bioinformatics'];
        result['delivery_type'] = doc['delivery_type'];
        result['reference_genome'] = doc['reference_genome'];
        emit(doc.project_id, result);
    }
}
