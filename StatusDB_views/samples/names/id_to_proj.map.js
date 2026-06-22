function(doc) {
	list = [doc["sample_prj"],doc["name"],doc["barcode_name"]];
	emit(doc["_id"], list);
}
