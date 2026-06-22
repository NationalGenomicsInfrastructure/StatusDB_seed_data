/*
 Used by genomics-status at:
  /api/v1/produced_monthly,
  /api/v1/produced_monthly.png,
  /api/v1/produced_quarterly,
  /api/v1/produced_quarterly.png
*/

function(doc) {
  if (doc["bc_count"] && doc["date"]) {
    var d = doc["date"];
    var yy = +d.substr(0,2)
    var mm = +d.substr(2,2)
    var qq = ((mm-1)/3|0)+1
    var dd = +d.substr(4,2)
    emit([yy, qq, mm, dd], +doc["bc_count"] * 101 * 2);
  }
}
