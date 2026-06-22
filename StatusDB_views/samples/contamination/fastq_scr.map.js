function(doc) {
  var empty_stats=0
  var contamin={}

    if(doc["fastq_scr"]["Human"]["Mapped_One_Library"] > 0 &&
       doc["fastq_scr"]["Ecoli"]["Mapped_One_Library"] > 0){

         contamin["Human"]=doc["fastq_scr"]["Human"]["Mapped_One_Library"]
   contamin["Ecoli"]=doc["fastq_scr"]["Ecoli"]["Mapped_One_Library"]
         emit(doc["name"], contamin)
   }
}
