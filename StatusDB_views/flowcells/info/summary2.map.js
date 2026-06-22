
/*
   Used by genomics-status at:
     /api/v1/flowcell_info2,
*/

function ( doc) {
    sum=Object();
    sum['name']=doc['name'];
    if (doc['illumina'].hasOwnProperty('Summary')&& doc['RunInfo'].hasOwnProperty('Date')){
        sum['seqdone']=doc['RunInfo']['Date'];
        if (doc['illumina']['Summary'].hasOwnProperty('read3')){
            //error rates per read and per lane
            sum['err1']=Array(-1,0,0,0,0,0,0,0,0);
            sum['err2']=Array(-1,0,0,0,0,0,0,0,0);
            sum['err3']=Array(-1,0,0,0,0,0,0,0,0);
            for(i=1;i<4;i++){
                for(lane in doc['illumina']['Summary']['read'+i]){
                     sum['err'+i][lane]=doc['illumina']['Summary']['read'+i][lane]['ErrRatePhiX'];   
                }
            }
       }
    }
    if (doc['illumina'].hasOwnProperty('Demultiplex_Stats') && doc['illumina']['Demultiplex_Stats'].hasOwnProperty('Barcode_lane_statistics') && doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'].length >0){
        sum['lane']=Object();
        //lanes are arrays of subsets
        sum['lane']['1']=Array();
        sum['lane']['2']=Array();
        sum['lane']['3']=Array();
        sum['lane']['4']=Array();
        sum['lane']['5']=Array();
        sum['lane']['6']=Array();
        sum['lane']['7']=Array();
        sum['lane']['8']=Array();
        sum['yields']=Array(-1,0,0,0,0,0,0,0,0);
	sum['seq_qc']=Array(-1,0,0,0,0,0,0,0,0);
        sum['demuldone']=true;
        subsets=[];
        plist=[];
	
	for (lane in doc['illumina']['run_summary']){
		sum['seq_qc'][lane]=doc['illumina']['run_summary'][lane]['qc'];
	}

        for (sample in doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics']){
            id=doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][sample];
            //if(id['Project']==='Undetermined_indices'){
            //    continue;
            //}  
            //subsets are sample objects"
            Subset=Object();
            Subset['SampleName']=id['Sample ID'];
            Subset['readsnb']=id['# Reads'];
            proj_name = id['Project'];
            plist.push(proj_name);
            Subset['Project']=proj_name;

            lane = id['Lane'];
            Subset['lane']=lane;
            Subset['yield']=id['Yield (Mbases)'];
            sum['yields'][lane]+=parseInt(id['Yield (Mbases)'].replace(",",""));
            Subset['overthirty']=id['% of >= Q30 Bases (PF)'];
               
            Subset['barcode']=id['Index'];
            Subset['desc']=id['Description'];

	    if (doc.hasOwnProperty('lims_data') && doc.lims_data.run_summary[lane].hasOwnProperty('% phiX')){
  	      Subset['phix']=doc.lims_data.run_summary[lane]['% phiX'];
	    }
	     if (doc.hasOwnProperty('lims_data') && doc.lims_data.run_summary[lane].hasOwnProperty('% Error Rate R1')){
  	      var er_rate=doc.lims_data.run_summary[lane]['% Error Rate R1'];
	       if (doc.lims_data.run_summary[lane].hasOwnProperty('% Error Rate R2') && doc.lims_data.run_summary[lane]['% Error Rate R2'] != 0){
		er_rate=(er_rate+doc.lims_data.run_summary[lane]['% Error Rate R1'])/2;
  	      }
	     Subset['er_rate']=er_rate;
	    }
            subsets.push(Subset);
        }
        for (s in subsets){
            //order by lane
            sum['lane'][subsets[s]['lane']].push(subsets[s]);
        }
        //clean duplicates
        sum['plist']=plist.filter(function( item, index, inputArray ) {
                       return inputArray.indexOf(item) == index;
                           }); 


    }
    emit(doc.name, sum)
}