
function(doc) {
 if (doc.charon_doctype != 'sample'){
	return;
}else{
  emit(doc.sampleid, doc.projectid);
}
}