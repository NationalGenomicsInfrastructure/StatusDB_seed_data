function (keys, values, rereduce) {
  var unique_sensors = {};

  if (rereduce) {
    // values is an array of arrays from previous reduce steps
    for (var i = 0; i < values.length; i++) {
      for (var j = 0; j < values[i].length; j++) {
        unique_sensors[values[i][j]] = true;
      }
    }
  } else {
    // values is an array of sensor_ids from the map function
    for (var i = 0; i < values.length; i++) {
      unique_sensors[values[i]] = true;
    }
  }

  return Object.keys(unique_sensors);
}
