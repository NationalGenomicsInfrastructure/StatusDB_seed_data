function(doc) {
  if (doc.events && Array.isArray(doc.events)) {
    doc.events.forEach(function(event) {
      emit(
        [doc._id, event.event_type],
        [event.timestamp, event.data]
      );
    });
  }
}