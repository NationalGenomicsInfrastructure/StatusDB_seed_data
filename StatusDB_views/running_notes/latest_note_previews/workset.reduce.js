/* Reduce function to get the latest running note
*/

function (keys, values, rereduce) {
    var max = '0';
    var max_doc = {}
      for(var i = 0; i < values.length; i++){
        if(values[i].created_at_utc>max){
          max = values[i].created_at_utc;
          max_doc = values[i];
        }
      }
      return max_doc
  }