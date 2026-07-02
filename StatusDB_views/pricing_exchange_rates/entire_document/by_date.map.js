/* Used by genomics-status at /api/v1/pricing_exchange_rates */

function(doc) {
  date = doc['Issued at'].substring(0, 10);
  emit(date, doc);
}
