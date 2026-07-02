function(doc) {
   if ("storage_status" in doc) {
      emit(doc['RunInfo']['Id'], doc);
    }
}
