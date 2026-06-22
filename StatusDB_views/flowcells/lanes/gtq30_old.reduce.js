function (key, values, rereduce) {
  var result = {'sum': 0, 'count': 0, 'instrument': null, 'setup': null}

  for (v in values) {
    result['count'] += values[v]['count'] || 0
    result['sum'] += values[v]['sum'] || 0
    result['instrument'] = values[v]['instrument']
    result['setup'] = values[v]['setup']
  }

  return result

}
