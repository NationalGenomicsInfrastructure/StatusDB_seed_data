/* A view to count values for most keys in project details and output it per year. Useful to check most common values and how they change over time. */

function (doc) {
  var creation_time = doc['creation_time'];
  var creation_year = creation_time.slice(0, 4);

  // Regular expression to match YYYY-MM-DD format
  var dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Array of detail_key values to skip
  var skipKeys = ['project_comment', 'running_notes', 'customer_project_description', 
    'agreement_cost', 'customer_project_reference', 'ethics_permit_number', 
    'invoice_reference', 'links', 'portal_id', 'reads_min'];


  var otherKeys = ['project_name'];

  for (var detail_key in doc['details']) {
    var detail_value = doc['details'][detail_key];

    // Check if detail_key is not in the skipKeys array and detail_value does not match the date format
    if (skipKeys.indexOf(detail_key) === -1 && !dateRegex.test(detail_value)) {
      emit([detail_key, creation_year, detail_value]);
    }
  }
  for (var other_key_index in otherKeys) {
    var other_key = otherKeys[other_key_index];
    if (doc.hasOwnProperty(other_key)) {
      var other_value = doc[other_key];
      emit([other_key, creation_year, other_value]);
    }
  }
}
