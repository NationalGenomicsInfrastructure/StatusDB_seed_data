function(doc) {
  var project_id=Object.keys(doc.samples)[0].split('_')[0];
  var data={};
  for (s in doc.samples){
   data[s]={};
   data[s]['total_reads']=parseInt(doc.samples[s].mapping_statistics.Total_No_reads);
   data[s]['unique_reads_mapped']=doc.samples[s].mapping_statistics.bef_dup_rem['%uniq_mapped'];
   data[s]['unique_reads_mapped_nodup']=doc.samples[s].mapping_statistics.aft_dup_rem['%uniq_mapped'];
   data[s]['CDS_per_kb']=parseFloat(doc.samples[s].read_distribution.CDS_Exons['Tags/Kb']);
   data[s]['5UTR_per_kb']=parseFloat(doc.samples[s].read_distribution["5'UTR_Exons"]['Tags/Kb']);
   data[s]['3UTR']=parseFloat(doc.samples[s].read_distribution["3'UTR_Exons"]['Tags/Kb']);
   data[s]['Introns']=parseFloat(doc.samples[s].read_distribution.Introns['Tags/Kb']);
   data[s]['TSS']=parseFloat(doc.samples[s].read_distribution.TSS_up_1kb['Tags/Kb']);
   data[s]['TES']=parseFloat(doc.samples[s].read_distribution.TES_down_1kb['Tags/Kb']);
   data[s]['%mRNA']=parseFloat(doc.samples[s].read_distribution.mRNA_frac);
   data[s]['%rRNA']=parseFloat(doc.samples[s].percent_rRNA);
  }
  emit(project_id, data);
}
