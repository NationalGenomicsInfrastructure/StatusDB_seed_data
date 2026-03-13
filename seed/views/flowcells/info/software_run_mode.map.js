function(doc) {
  var hcs = doc['RunParameters']['Setup']['ApplicationName'] + " " + doc['RunParameters']['Setup']['ApplicationVersion'];
  var rta = "RTA " + doc['RunParameters']['Setup']['RTAVersion']
  var mode = "NA"
  if (doc['RunParameters']['Setup']['RunMode']) {
    mode = doc['RunParameters']['Setup']['RunMode'];
  }
  emit(doc['name'],hcs + " / " + rta + " / " + mode);
}
