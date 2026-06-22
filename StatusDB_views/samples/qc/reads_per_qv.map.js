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
  emit(doc["name"],{"Quality": doc["fastqc"]["stats"]["Per sequence quality scores"]["Quality"], "Cumulative count": cumsum, "Count": doc["fastqc"]["stats"]["Per sequence quality scores"]["Count"]});
}
