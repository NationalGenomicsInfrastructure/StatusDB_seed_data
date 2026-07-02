function(doc) {
  emit(doc["name"],doc["illumina"]["Demultiplex_Stats"]["Barcode_lane_statistics"] );
}
