/*
 Used by genomics-status at:
  /api/v1/delivered_monthly,
  /api/v1/delivered_monthly.png,
  /api/v1/delivered_quarterly,
  /api/v1/delivered_quarterly.png
*/

function(doc) {
  for (s in doc["samples"]) {
    var m_reads = +doc["samples"][s]["m_reads_sequenced"]
    var ds = 0
    ds = doc["creation_time"].split("T")[0].split("-")
    qq = ((+ds[1]-1)/3|0)+1
    if(m_reads){
      emit([+ds[0], qq, +ds[1], +ds[2]], m_reads * 2 * 101)
    }
  }
}
