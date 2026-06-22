function(doc) {
    sdata={};
    for(s_key in doc['samples']){
       sample=doc['samples'][s_key]
       if ("initial_plate_id" in sample){
           if (!(sample["initial_plate_id"] in sdata)){
               sdata[sample["initial_plate_id"]]={};
           }
           
           if ("well_location" in sample){
               sdata[sample["initial_plate_id"]][sample["well_location"]]={};
               sdata[sample["initial_plate_id"]][sample["well_location"]]["sample_name"]=s_key;
           } 
           if ("details" in sample){
               sdata[sample["initial_plate_id"]][sample["well_location"]]['customer_name']=sample["customer_name"];
           }
           if ("details" in sample){
               sdata[sample["initial_plate_id"]][sample["well_location"]]['details']=sample["details"];
           }
           if ("initial_qc" in sample){
               sdata[sample["initial_plate_id"]][sample["well_location"]]['initial_qc']=sample["initial_qc"];
           }
       }
    }
    for (plate in sdata){
        x_axis=[];
        y_axis=[];
        for (well_location in sdata[plate]){
            y=well_location.charAt(0);
            if (y_axis.indexOf(y) == -1){
                y_axis.push(y);
            }
            x=well_location.charAt(2);
            if (x_axis.indexOf(x) == -1){
                x_axis.push(x);
            }
        }
        x_axis.sort();
        y_axis.sort();
        sdata[plate]['y_axis']=y_axis;
        sdata[plate]['x_axis']=x_axis;
    }
    emit(doc.project_id, sdata);
}
