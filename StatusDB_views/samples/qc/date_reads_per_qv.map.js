/*
 Used by genomics-status at:
  /api/v1/reads_vs_quality
*/

function(doc) {
  var cumsum = new Array();
  var l = doc["fastqc"]["stats"]["Per sequence quality scores"]["Count"].length;
  for (var i=l-1; i>=0; i--) {
    if (i < l-1) {
      cumsum[i] = cumsum[i+1];
    }
    else {
      cumsum[i] = 0;
    }
    cumsum[i] += 1*doc["fastqc"]["stats"]["Per sequence quality scores"]["Count"][i];
  } 
  var d = doc["date"];
  var yy = +d.substr(0,2)
  var mm = +d.substr(2,2)
  var qq = ((mm-1)/3|0)+1
  var dd = +d.substr(4,2)

  emit([yy, qq, mm, dd],{"Quality": doc["fastqc"]["stats"]["Per sequence quality scores"]["Quality"], "Cumulative count": cumsum, "Count": doc["fastqc"]["stats"]["Per sequence quality scores"]["Count"]});
}
