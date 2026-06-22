/*
 Used by genomics-status at:
  /api/v1/sample_alignment/:id
*/

function(doc) {
  var al_summary = new Object();
  al_summary["reads"] = new Object();
  al_summary["aligned"] = new Object();

  if (doc["picard_metrics"]["AL_PAIR"]) {
    al_summary["reads"]["first_of_pair"] = doc["picard_metrics"]["AL_FIRST_OF_PAIR"]["TOTAL_READS"];
    al_summary["reads"]["second_of_pair"] = doc["picard_metrics"]["AL_SECOND_OF_PAIR"]["TOTAL_READS"];
    al_summary["reads"]["pair"] = doc["picard_metrics"]["AL_PAIR"]["TOTAL_READS"];

    al_summary["aligned"]["first_of_pair"] = doc["picard_metrics"]["AL_FIRST_OF_PAIR"]["PF_READS_ALIGNED"];
    al_summary["aligned"]["second_of_pair"] = doc["picard_metrics"]["AL_SECOND_OF_PAIR"]["PF_READS_ALIGNED"];
    al_summary["aligned"]["pair"] = doc["picard_metrics"]["AL_PAIR"]["PF_READS_ALIGNED"];
  };

  emit(doc["name"], al_summary);
}
