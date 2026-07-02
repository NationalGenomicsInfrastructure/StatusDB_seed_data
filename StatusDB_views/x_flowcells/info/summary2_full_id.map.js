/*
   Used by genomics-status at: flowcell page
*/

function ( doc) {
    sum=Object();
    sum['name']=doc['name'];
    if ('RunInfo' in doc) {
        sum['instrument'] = doc.RunInfo.Instrument;
        sum['short_name'] = doc.RunInfo.Flowcell;
        sum['full_name'] = doc.RunInfo.Id;
        run_setup = doc.RunInfo.Reads;
        run_setup_text = '';
        read_count = 0;
        index_count = 0;
        longer_read_length = 0;

        run_setup.forEach(function(read){
            run_setup_text += read['NumCycles'];
            run_setup_text += 'nt';
            if(read['IsIndexedRead'] === 'N'){
                read_count += 1;
                run_setup_text += '(R';
                run_setup_text += read_count.toString();
                if(parseInt(read['NumCycles']) > longer_read_length){
                    longer_read_length = parseInt(read['NumCycles']);
                }
            }
            else if(read['IsIndexedRead'] == 'Y'){
                index_count += 1;
                run_setup_text += '(I';
                run_setup_text += index_count.toString();
            }
            if(run_setup.indexOf(read) === run_setup.length-1)
                run_setup_text += ')';
            else
                run_setup_text += ')-';
        });
        sum['actual_run_setup'] = run_setup_text;
        sum['longer_read_length'] = longer_read_length;
    }
    sum['run_setup'] = doc['run_setup'];

    // to define tresholds for number of clusters
    sum['run_mode']='';

    if (doc['RunParameters'].hasOwnProperty('ReagentKitVersion') && doc['RunParameters'].hasOwnProperty('RunParametersVersion') && doc['RunParameters']['RunParametersVersion'].indexOf('MiSeq') != -1) {
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
    } else if (doc['RunParameters'].hasOwnProperty('InstrumentType')){
        if (doc['RunParameters'].hasOwnProperty('FlowCellMode') && doc['RunParameters']['InstrumentType'].indexOf('NextSeq 2000')!=-1) {
            sum['run_mode']=doc['RunParameters']['InstrumentType'] + ' ' + doc['RunParameters']['FlowCellMode'].match(/P[1,2,3]/)[0];
        } else if (doc['RunParameters']['InstrumentType'].indexOf('NovaSeqXPlus')!=-1) {
          sum['run_mode']=doc['RunParameters']['InstrumentType'] + ' ' + doc['RunParameters']['RecipeName'].split(" ")[0];
        }
    } else if (doc['RunParameters'].hasOwnProperty('Setup')){
        if (doc['RunParameters']['Setup'].hasOwnProperty('RunMode')){
            // HiSeq
            sum['run_mode']=doc['RunParameters']['Setup']['RunMode'];
        } else if (doc['RunParameters']['Setup'].hasOwnProperty('Index') && doc['RunParameters']['Setup']['Index'].indexOf('HiSeq X')!=-1) {
            sum['run_mode']='HiSeq X';
        }
    } else if (doc['RunParameters'].hasOwnProperty('RfidsInfo') && doc['RunParameters']['RfidsInfo'].hasOwnProperty('FlowCellMode')) {
        sum['run_mode']='NovaSeq ' + doc['RunParameters']['RfidsInfo']['FlowCellMode'];
    } else {
        sum['run_mode']='';
    }

    if (doc.hasOwnProperty('illumina')){
        if (doc['illumina'].hasOwnProperty('Summary')){
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
        if (doc['illumina'].hasOwnProperty('Demultiplex_Stats') && doc['illumina']['Demultiplex_Stats'].hasOwnProperty('Lanes_stats')){
            lanedata=Object();
            for (idx in doc['illumina']['Demultiplex_Stats']['Lanes_stats']){
                ld=doc['illumina']['Demultiplex_Stats']['Lanes_stats'][idx];
                if ('Clusters' in ld){
                    var cltk = 'Clusters';
                } else if ('PF Clusters' in ld){
                    var cltk = "PF Clusters";
                }
                Subset=Object();
                Subset['clustersnb']=ld[cltk];
                lane = ld['Lane'];
                Subset['yield']=ld['Yield (Mbases)'];
                Subset['overthirty']=ld['% >= Q30bases'];
                Subset['mqs']=ld['Mean QualityScore'];
                Subset['perf']=ld['% Perfectbarcode'];
                if (doc.hasOwnProperty('lims_data') && doc['lims_data'].hasOwnProperty('run_summary') && doc.lims_data.run_summary[lane].hasOwnProperty('% phiX')){
                    Subset['phix']=doc.lims_data.run_summary[lane]['% phiX'];
                }
                if (doc.hasOwnProperty('lims_data') && doc['lims_data'].hasOwnProperty('run_summary') && doc.lims_data.run_summary[lane].hasOwnProperty('% Error Rate R1')){
                    var er_rate=doc.lims_data.run_summary[lane]['% Error Rate R1'];
                    if (doc.lims_data.run_summary[lane].hasOwnProperty('% Error Rate R2') && doc.lims_data.run_summary[lane]['% Error Rate R2'] != 0){
                        er_rate=(er_rate+doc.lims_data.run_summary[lane]['% Error Rate R2'])/2;
                    }
                    Subset['er_rate']=er_rate;
                }
                lanedata[lane]=Subset;

            }
            sum['lanedata']=lanedata;
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
            pid_list=[];

            for (lane in doc['illumina']['run_summary']){
                sum['seq_qc'][lane]=doc['illumina']['run_summary'][lane]['qc'];
            }

            for (sample in doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics']){
                id=doc['illumina']['Demultiplex_Stats']['Barcode_lane_statistics'][sample];
                //if(id['Project']==='Undetermined_indices'){
                //    continue;
                //}
                //subsets are sample objects"
                if ('Clusters' in id){
                    var cstk='Clusters';
                } else if ('PF Clusters' in id){
                    var cstk='PF Clusters';
                } else {
                    //We're doomed
                    var cstk="ERROR";
                }
                Subset=Object();
                Subset['SampleName']=id['Sample'];
                Subset['clustersnb']=id[cstk];
                proj_name = id['Project'];
                plist.push(proj_name);
                pid=id['Sample'].split('_')[0];
                if (pid !== "Undetermined") {
                    pid_list.push(pid);
                }
                Subset['Project']=proj_name;

                lane = id['Lane'];
                Subset['lane']=lane;
                Subset['yield']=id['Yield (Mbases)'];
                sum['yields'][lane]+=parseInt(id['Yield (Mbases)'].replace(/,/g,""));
                Subset['overthirty']=id['% >= Q30bases'];

                Subset['barcode']=id['Barcode sequence'];
                Subset['desc']=id['Description'];

                Subset['mqs']=id['Mean QualityScore'];
                //THIS NUMBER IS UNRELIABLE, COMPUTE IT INSTEAD
                //Subset['lanepc']=id['% of thelane'];

                var clnb=parseInt(id[cstk].replace(/,/g,""));
                var lane_clnb=0;
                if("Lanes_stats" in doc["illumina"]["Demultiplex_Stats"]){
                    for(idx in doc["illumina"]["Demultiplex_Stats"]["Lanes_stats"]){
                        if(doc["illumina"]["Demultiplex_Stats"]["Lanes_stats"][idx]["Lane"] == lane){
                            lane_clnb=parseInt(doc["illumina"]["Demultiplex_Stats"]["Lanes_stats"][idx][cstk].replace(/,/g,""));
                        }
                    }
                    // here we get division by zero
                    if (lane_clnb==0) {
                        Subset['lanepc'] = 0;
                    } else {
                        Subset['lanepc'] = 100 * (clnb / lane_clnb);
                    }
                }
                subsets.push(Subset);
            }
            for (s in subsets){
                //order by lane
                sum['lane'][subsets[s]['lane']].push(subsets[s]);
            }
            if ('Undetermined' in doc){
                sum['undetermined']=doc["Undetermined"];
            }
            //clean duplicates
            sum['plist']=plist.filter(function( item, index, inputArray ) {
                return inputArray.indexOf(item) == index;
            });
            sum['pid_list']=pid_list.filter(function( item, index, inputArray ) {
                return inputArray.indexOf(item) == index;
            });
        }
    }
    emit(sum.full_name, sum)
}
