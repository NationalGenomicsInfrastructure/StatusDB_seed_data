function(doc) {
  var bcseq = 'AGCGATAG-GTACTGAC';

    if(doc["sequence"] === bcseq) {
       mm = doc["fastq_scr"]["Mouse"]["Mapped_One_Library"];
       hg = doc["fastq_scr"]["Human"]["Mapped_One_Library"];
       emit([doc["date"],doc["flowcell"],doc["sample_prj"],doc["project_sample_name"]],{'Mouse': mm, 'Human':hg});
   }
}

