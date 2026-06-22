function(doc) {
  if (doc.orderportal_doctype !== 'order') return;
  if (!doc.fields.Status) return;
  var cleaned = doc.fields.Status.replace(/[:,']/g, " ").toLowerCase();
  var words = cleaned.split(/\s+/);
  words.forEach(function(word) {
    if (word.length > 2 && !lint[word]) emit(word, null);
  });
};
var lint = {'and': 1, 'the': 1, 'was': 1, 'not': 1};