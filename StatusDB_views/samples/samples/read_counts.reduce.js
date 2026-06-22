function(key, values, rereduce) {
  var result = {'read_count': 0, 'index': null, 'sample_run': null}

  for (i in values) {
    result['read_count'] += values[i]['read_count'] || 0
  }

  return result
}
