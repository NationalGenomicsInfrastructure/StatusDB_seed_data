function(doc) {
	samples={}
  	for (sample in doc["samples"]) {
		s = doc["samples"][sample];
		gene_dict={};
		for (gene in s["top_dups"]["top3_genes_based_on_normed_counts_duprem"]) {
			g=s["top_dups"]["top3_genes_based_on_normed_counts_duprem"][gene]
			gene_dict[gene]=[g['counts_noremed_by_gene_lengt']['no_dupl/(total_no_counts)'],g['counts_not_noremed']['no_dupl/(total_no_counts)']]
			}
		emit([sample,{"counts":s["top_dups"]['total_counts_maped_to_annotated_genes'],"counts_duprem":s["top_dups"]['total_counts_maped_to_annotated_genes_(duplicates_removed)'],'no_feat':s["top_dups"]['no_feature_withdup'],'no_feat_duprem':s["top_dups"]['no_feature_duprem']}],gene_dict)

}
}


  