function(doc) {
  if (doc.orderportal_doctype !== 'order') return;
  var value = doc.fields.pi_identifier;
  if (!value) return;
  var type = typeof(value);
  if (type === 'string') {
    var words = value.replace(/[:,']/g, " ").toLowerCase().split(/\s+/);
  } else if (type === 'number') {
    var words = [value.toString()];
  } else {
    var words = value;
  };
  if (words.length) {
    words.forEach(function(word) {
      if (word.length > 2 && !lint[word]) emit(word, null);
    });
  };
};
var lint = {'and': 1, 'the': 1, 'was': 1, 'not': 1};