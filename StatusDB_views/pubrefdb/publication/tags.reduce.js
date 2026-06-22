/* PubRefDb: Publication database web application.
   Reduce function to obtain tags for count.
*/
function(keys, values, rereduce) {
    return sum(values);
}
