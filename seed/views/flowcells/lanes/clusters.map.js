/*
 Used by genomics-status at:
  /api/v1/plot/clusters_per_lane.png
*/

function(doc) {
  for (lane in doc.illumina.run_summary) {
    var data ={};

    data['filtered_clusters']=doc.illumina.run_summary[lane]['Clusters PF R1'];
    data['unfiltered_clusters']=doc.illumina.run_summary[lane]['Clusters Raw R1'];


    emit([doc["name"], lane], data);

  };
};