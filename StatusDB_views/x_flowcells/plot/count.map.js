function(doc) {
  var date = doc.RunInfo.Id;
  var instrument = doc.RunInfo.Instrument;
  var key = [instrument];
  key.push("20"+date.substr(0,2));
  key.push(date.substr(2,2));
  
  // Now hell begins
  var d = new Date(key[1], key[2]-1, parseInt(date.substr(4,2),10));
  var thursday_of_that_week = d.setDate(d.getDate()-d.getDay()+4);
  var first_thursday = new Date(d.getFullYear(), 0, 1+((4 - new Date(d.getFullYear(),0,1).getDay() + 7) % 7));
  var week_nb =  1 + Math.ceil((thursday_of_that_week - first_thursday) / 604800000);
  key.push(week_nb);
  // end of hell
  key.push(date.substr(4,2));
  
  emit(key, 1);
}