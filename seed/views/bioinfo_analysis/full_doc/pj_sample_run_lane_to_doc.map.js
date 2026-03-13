function(doc) {
if ('sample' in doc && 'lane' in doc) {
	emit([doc.project_id, doc.sample, doc.run_id, doc.lane], doc);
}}
