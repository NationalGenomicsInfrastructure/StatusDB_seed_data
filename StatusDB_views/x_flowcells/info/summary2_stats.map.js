/*
   Used by genomics-status at: flowcell page
*/

function (doc) {
    sum=Object();
    sum['name']=doc['name'];

    if (doc['Json_Stats']) {
        sum['short_name'] = doc['Json_Stats']['Flowcell'];
        sum['full_name'] = doc['Json_Stats']['RunId'];
        if ( doc['Json_Stats']['ConversionResults'][0]['DemuxResults'][0]['ReadMetrics'][1] ){
        	sum['two_reads'] = true;
        } else {
        	sum['two_reads'] = false;
        }
    }
    else {
        sum['full_name'] = doc.RunInfo.Id;
    }

    if ('RunInfo' in doc) {
        sum['instrument'] = doc.RunInfo.Instrument;
    }
    sum['run_setup'] = doc['run_setup'];

    // Defines instrument version, for threholds.
    sum['run_mode']='';
    if (doc['RunParameters'].hasOwnProperty('ReagentKitVersion') && doc['RunParameters'].hasOwnProperty('RunParametersVersion')
    && doc['RunParameters']['RunParametersVersion'].indexOf('MiSeq') != -1) {
        if (doc.hasOwnProperty('lims_data') && doc['lims_data'].hasOwnProperty('run_type') && doc['lims_data']['run_type']!='null') {
            sum['run_mode']='MiSeq ' + doc['lims_data']['run_type'];
        }
        else {
            if (doc['RunParameters'].hasOwnProperty('Setup') && doc['RunParameters']['Setup'].hasOwnProperty('SupportMultipleSurfacesInUI') && doc['RunParameters']['Setup'].hasOwnProperty('NumTilesPerSwath')) {
                if (doc['RunParameters']['Setup']['SupportMultipleSurfacesInUI']=='true' && doc['RunParameters']['Setup']['NumTilesPerSwath']=='19') {
                    sum['run_mode']='MiSeq Version3';
                }
                else if (doc['RunParameters']['Setup']['SupportMultipleSurfacesInUI']=='true' && doc['RunParameters']['Setup']['NumTilesPerSwath']=='14') {
                    sum['run_mode']='MiSeq Version2';
                }
                else if (doc['RunParameters']['Setup']['SupportMultipleSurfacesInUI']=='false' && doc['RunParameters']['Setup']['NumTilesPerSwath']=='2') {
                    sum['run_mode']='MiSeq Version2Nano';
                }
                else if (doc['RunParameters']['Setup']['SupportMultipleSurfacesInUI']=='true' && doc['RunParameters']['Setup']['NumTilesPerSwath']=='4') {
                    sum['run_mode']='MiSeq Version2Micro';
                }
                else {
                    sum['run_mode']='MiSeq null';
                }
            }
            else {
              sum['run_mode']='MiSeq ' + doc['RunParameters']['ReagentKitVersion'];
            }
        }
    } else if (doc['RunParameters'].hasOwnProperty('Chemistry') && doc['RunParameters']['Chemistry'].indexOf('NextSeq')!=-1) {
        sum['run_mode']=doc['RunParameters']['Chemistry'];
    } else if (doc['RunParameters'].hasOwnProperty('InstrumentType') && doc['RunParameters'].hasOwnProperty('FlowCellMode') && doc['RunParameters']['InstrumentType'].indexOf('NextSeq 2000')!=-1) {
        sum['run_mode']=doc['RunParameters']['InstrumentType'] + ' ' + doc['RunParameters']['FlowCellMode'].match(/P[1,2,3]/)[0];
    } else if (doc['RunParameters'].hasOwnProperty('Setup')){
        if (doc['RunParameters']['Setup'].hasOwnProperty('RunMode')){
            // HiSeq 2500 variant
            sum['run_mode']=doc['RunParameters']['Setup']['RunMode'];
        } else if (doc['RunParameters']['Setup'].hasOwnProperty('Index')
        && doc['RunParameters']['Setup']['Index'].indexOf('HiSeq X')!=-1) {
            sum['run_mode']='HiSeq X';
        }
    } else if (doc['RunParameters'].hasOwnProperty('RfidsInfo') && doc['RunParameters']['RfidsInfo'].hasOwnProperty('FlowCellMode')) {
        sum['run_mode']='NovaSeq ' + doc['RunParameters']['RfidsInfo']['FlowCellMode'];
    }
    else {
        sum['run_mode']='UNDEFINED';
    }

    if (doc['illumina']['Summary'] && doc['illumina']['Summary']['read3']){
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
// Lane level stuff
    if (doc['Json_Stats'] && doc['Json_Stats']['ConversionResults']){
        lanedata=Object();
        undetDict=Object();
        for (laneNo in doc['Json_Stats']['ConversionResults']){
            id = doc['Json_Stats']['ConversionResults'][laneNo];
            Subset=Object();
            Subset['clustersnb']=parseInt(id['TotalClustersPF']);
            Subset['clustersnb']=Subset['clustersnb'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            lane = id['LaneNumber'];
            lanedata[lane]=Subset;

            Subset['exact_yield'] = id['Yield'];

            // Tallies mismatch %
            Subset['perf'] = 0;
            reads = 0;
            for (sample in id['DemuxResults']){
            	if ('IndexMetrics' in id['DemuxResults'][sample] ){
            		reads = reads + id['DemuxResults'][sample]['NumberReads'];
            		for (bc in id['DemuxResults'][sample]['IndexMetrics']){
	            		Subset['perf'] = Subset['perf'] + id['DemuxResults'][sample]['IndexMetrics'][bc]['MismatchCounts'][0];

            		}
            	}
            }
            Subset['perf'] = ((Subset['perf']/reads)*100).toFixed(2);

            Subset['yield']=((Subset['exact_yield']/1000000).toFixed(0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            //Subset['percpf']=100*(id['TotalClustersPF']/id['TotalClustersRaw']);
            //Subset['percpf']=Subset['perf'].toFixed(2);


            if (doc['illumina']['Demultiplex_Stats'] && doc['illumina']['Demultiplex_Stats']['Lanes_stats']){
                illid = doc['illumina']['Demultiplex_Stats']['Lanes_stats'][laneNo];
                Subset['overthirty']=illid['% >= Q30bases'];
                Subset['mqs']=illid['Mean QualityScore'];
            }

            if (doc['lims_data']){
		var er_rate=0;
                if (doc['lims_data']['run_summary'][lane + ""]['% phiX']){
                    Subset['phix']=doc.lims_data.run_summary[lane + ""]['% phiX'].toFixed(1);
                }
                if (doc['lims_data']['run_summary'][lane + ""]['% Error Rate R1']){
                	er_rate=doc['lims_data']['run_summary'][lane + ""]['% Error Rate R1'];
                }
                if (doc['lims_data']['run_summary'][lane + ""]['% Error Rate R2']){
                	er_rate=(er_rate + doc['lims_data']['run_summary'][lane + ""]['% Error Rate R2'])/2;
                }
                Subset['er_rate']=er_rate.toFixed(2)
            }

            // Attach undetermined indexes
            if (doc['Json_Stats']['UnknownBarcodes']){
                undetDict[lane + ""] = doc['Json_Stats']['UnknownBarcodes'][laneNo]['Barcodes'];
                sum['undetermined'] = undetDict;
            }

        }
        sum['lanedata']=lanedata;
        subsets.push(Subset);
    }

// See no reason to not always produce this.
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
    //Creates empty subset container
    subsets=[];
    plist=[];

    if ( doc['illumina']['run_summary'] ){
	    for (lane in doc['illumina']['run_summary']){
	        sum['seq_qc'][lane]=doc['illumina']['run_summary'][lane]['qc'];
	    }
    }


// Sample specific data
    if (doc['Json_Stats'] && doc['Json_Stats']['ConversionResults']){
        for (laneNo in doc['Json_Stats']['ConversionResults']){
            for (sample in doc['Json_Stats']['ConversionResults'][laneNo]['DemuxResults']){
                id=doc['Json_Stats']['ConversionResults'][laneNo]['DemuxResults'][sample];
                Subset=Object();
                Subset['SampleName']=id['SampleName'];
                //Add commas, necessary for flowcell.html
                Subset['clustersnb']=id['NumberReads'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                lane = doc['Json_Stats']['ConversionResults'][laneNo]['LaneNumber'];
                Subset['lane']=lane;

                //Change  this to use samplesheet_csv.
                //check sample name and lane. Then snag the project and replace first underscore with a dot.
                for (sheetsample in doc['samplesheet_csv']){
                	if ('SampleName' in doc['samplesheet_csv'][sheetsample]){
                		samplename = doc['samplesheet_csv'][sheetsample]['SampleName'];
                	} else {
                		samplename = doc['samplesheet_csv'][sheetsample]['Sample_Name'];
                	}

                	if (doc['samplesheet_csv'][sheetsample]['Lane'] == Subset['lane'] &&
                	samplename == Subset['SampleName']){

                		if ('Project' in doc['samplesheet_csv'][sheetsample]){
                			proj_name = doc['samplesheet_csv'][sheetsample]['Project'];
                		} else {
                			proj_name = doc['samplesheet_csv'][sheetsample]['Sample_Project'];
                		}

                		// Add project radio buttons to flowcell page
                		plist.push(proj_name);

                		//Replace first underscore(s). Done afterwards because fc page is insane.
                		proj_name = proj_name.replace("__", ".");
                		if (proj_name.indexOf("_") == 1){
                			proj_name = proj_name.replace("_", ".");
                		}
                		Subset['Project']=proj_name;
                		break;
                	}
                }

                //Legacy stuff, unsure about purpose
                sum['yields'][lane] += doc['Json_Stats']['ConversionResults'][laneNo]['Yield'];

                Subset['yield']=(id['Yield']/1000000).toFixed(2) + '';
                Subset['yield']=Subset['yield'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


                Subset['overthirty_r1'] = (100*(id['ReadMetrics'][0]['YieldQ30']/id['ReadMetrics'][0]['Yield'])).toFixed(2);
                bcList=[];

                if ( id['IndexMetrics'] ) {
	                if ( id['IndexMetrics'][1] ) {
	                	for (index in id['IndexMetrics']){
		                	bcList.push(id['IndexMetrics'][index]['IndexSequence']);
	                	}
	                	Subset['multi_barcode']=bcList;
	                }
	                else {
	                	Subset['barcode']=id['IndexMetrics'][0]['IndexSequence'];
	                }
                } else {
                	Subset['barcode']="unknown";
                }
                //Subset['desc']=id['Description']; Omitting this one, hopefully irrelevant
                //Subset['mqs_r1'] = (id['ReadMetrics'][0]['QualityScoreSum']/id['ReadMetrics'][0]['Yield']).toFixed(2);
                //Subset['zeromismatchpc'] = (100*id['IndexMetrics']['0']['MismatchCounts']['0']/id['NumberReads']).toFixed(1);

                if ( id['ReadMetrics'][1] ) {
                    // Q30 reads of R1+R2, divided by yield
                    Subset['overthirty']=(100*((id['ReadMetrics'][0]['YieldQ30']+id['ReadMetrics'][1]['YieldQ30']))/id['Yield']).toFixed(2);
                    Subset['overthirty_r2'] = (100*(id['ReadMetrics'][1]['YieldQ30']/id['ReadMetrics'][1]['Yield'])).toFixed(2);
                    Subset['mqs']=((id['ReadMetrics'][0]['QualityScoreSum']+id['ReadMetrics'][1]['QualityScoreSum'])/id['Yield']).toFixed(1);
                    Subset['lanepc']=(100*((id['ReadMetrics'][0]['Yield']+id['ReadMetrics'][1]['Yield'])/sum['lanedata'][lane]['exact_yield'])).toFixed(2);
                    //Subset['mqs_r2'] = (id['ReadMetrics'][1]['QualityScoreSum']/id['ReadMetrics'][1]['Yield']).toFixed(2);
                } else {
                    Subset['overthirty']=((100*id['ReadMetrics'][0]['YieldQ30'])/id['Yield']).toFixed(2);
                    Subset['mqs']=(id['ReadMetrics'][0]['QualityScoreSum']/id['Yield']).toFixed(1);
                    Subset['lanepc']=(100*(id['ReadMetrics'][0]['Yield']/sum['lanedata'][lane]['exact_yield'])).toFixed(2);
                }
                subsets.push(Subset);
            }
            // Adding undetermined sample
            // Could possibly put this as an if case in the loop
            if ( doc['Json_Stats']['ConversionResults'][laneNo]['Undetermined'] ){
	            und_id=doc['Json_Stats']['ConversionResults'][laneNo]['Undetermined']
	            if ( und_id['Yield'] != 0 ){
	            	Subset=Object();
		            Subset['SampleName']='Undetermined';
		            Subset['clustersnb']=und_id['NumberReads'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		            Subset['Project']="default";
		            Subset['barcode']="unknown";
		            Subset['lane']=doc['Json_Stats']['ConversionResults'][laneNo]['LaneNumber'];
		            Subset['yield']=(und_id['Yield']/1000000).toFixed(2) + '';
		            Subset['yield']=Subset['yield'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		            Subset['overthirty_r1'] = (100*(und_id['ReadMetrics'][0]['YieldQ30']/und_id['ReadMetrics'][0]['Yield'])).toFixed(2);

		            if ( und_id['ReadMetrics'][1] ) {
		                Subset['overthirty']=(100*((und_id['ReadMetrics'][0]['YieldQ30']+und_id['ReadMetrics'][1]['YieldQ30']))/id['Yield']).toFixed(2);
		                Subset['overthirty_r2'] = (100*(und_id['ReadMetrics'][1]['YieldQ30']/und_id['ReadMetrics'][1]['Yield'])).toFixed(2);
		                Subset['mqs']=((und_id['ReadMetrics'][0]['QualityScoreSum']+und_id['ReadMetrics'][1]['QualityScoreSum'])/und_id['Yield']).toFixed(1);
		                Subset['lanepc']=(100*((und_id['ReadMetrics'][0]['Yield']+und_id['ReadMetrics'][1]['Yield'])/sum['lanedata'][lane]['exact_yield'])).toFixed(2);
		            } else {
		                Subset['overthirty']=((100*und_id['ReadMetrics'][0]['YieldQ30'])/id['Yield']).toFixed(2);
		                Subset['mqs']=(und_id['ReadMetrics'][0]['QualityScoreSum']/und_id['Yield']).toFixed(1);
		                Subset['lanepc']=(100*(und_id['ReadMetrics'][0]['Yield']/sum['lanedata'][lane]['exact_yield'])).toFixed(2);
		            }
		            subsets.push(Subset);
	            }
            }
        }
    }

    //For each subset
    for (s in subsets){
        //order by lane
        //Push data for subset x to sum['lane']['subset X's laneNo']
        sum['lane'][subsets[s]['lane']].push(subsets[s]);
    }

    //clean duplicates
    sum['plist']=plist.filter(function( item, index, inputArray ) {
       return inputArray.indexOf(item) == index;
    });
    emit(sum.full_name, sum)
}
