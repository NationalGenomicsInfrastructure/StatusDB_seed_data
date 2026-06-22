function (doc) {
    const run_date = new Date(doc['instrument_generated_files']['RunParameters.json']['Date']);
    const instr_name = doc['instrument_generated_files']['RunParameters.json']["InstrumentName"];
    const yd = doc['instrument_generated_files']['AvitiRunStats.json']["RunStats"]["TotalYield"];
    
    var dw = run_date.getDay();
    if (dw===0){
      prev_monday=new Date(run_date.getFullYear(), run_date.getMonth(), (run_date.getDate()-6));
    }else{
      prev_monday=new Date(run_date.getFullYear(), run_date.getMonth(), (run_date.getDate() - run_date.getDay() + 1));
    }
  
    d_str=prev_monday.getDate().toString();
  
    if (prev_monday.getDate()<10){
      d_str = "0"+d_str;
    }
    var m_str=(prev_monday.getMonth() + 1).toString();
    if (prev_monday.getMonth() + 1 < 10){
     m_str = "0"+m_str;
    }
    var prev_monday_str=prev_monday.getFullYear().toString() + "-" + m_str + "-" + d_str;
  
    
    if (instr_name.indexOf('AV') != -1) {
      key=[prev_monday_str, "Aviti"];
      emit(key, yd);
    }
    else {
      // This does nothing. Change once the 24 is online and we know what to filter for 
      key=[prev_monday_str, "Aviti24"];
    }
}