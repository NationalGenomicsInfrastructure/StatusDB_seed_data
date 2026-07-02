function(doc) {
if (doc['source']=='lims') {
for (sample in doc["samples"]) {
s = doc["samples"][sample];
for (prep in s["library_prep"]){
date = null
for ( run in s["library_prep"][prep]["sample_run_metrics"]){ date = s["library_prep"][prep]["sample_run_metrics"][run]['sequencing_run_QC_finished']}
} 
if (s['details']["lanes_requested"]) {
emit([date, doc['project_name'],s["scilife_name"]],[s["details"]["lanes_requested"],s['details']["pooling"],s['m_reads_sequenced']])
}
}
}
}