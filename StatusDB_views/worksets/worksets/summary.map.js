function(doc) {
    summary = {};
    summary['projects'] = {};
    summary['technician'] = doc.technician;
    summary['date_run'] = doc.date_run;
    summary['finish date']=doc['last_aggregate'];
    summary['application'] = [];
    summary['library_method'] = [];
    summary['library_option'] = [];
    summary['samples'] = {};
    summary['samples']['total'] = 0;
    summary['samples']['passed'] = 0;
    summary['samples']['failed'] = 0;
    summary['samples']['unknown'] = 0;
    summary['id'] = doc['id'];

    for (var p in doc.projects){
        summary['projects'][p] = {};
        summary['projects'][p]['samples_nb']=Object.keys(doc.projects[p].samples).length;
        summary['projects'][p]['project_name']=doc.projects[p].name;
        if (doc.projects[p].sequencing_setup) {
            summary['projects'][p]['sequencing_setup'] = doc.projects[p].sequencing_setup;
        } else {
            summary['projects'][p]['sequencing_setup'] = '-';
        }
        if ("close_date" in doc.projects[p]){
           summary['projects'][p]['status']="Closed";
        }else{
           summary['projects'][p]['status']="Open";
        }
        if (doc.projects[p].application && summary['application'].indexOf(doc.projects[p].application) == -1){
            summary['application'][summary['application'].length]=doc.projects[p].application;
        }
        if (doc.projects[p].library && summary['library_method'].indexOf(doc.projects[p].library) == -1){
            summary['library_method'][summary['library_method'].length]=doc.projects[p].library;
        }
        if (doc.projects[p].library_option && summary['library_option'].indexOf(doc.projects[p].library_option) == -1){
            summary['library_option'][summary['library_option'].length]=doc.projects[p].library_option;
        }
        for (var s in doc.projects[p].samples){
                summary['samples']['total']+=1;
            if(doc.projects[p].samples[s].library_status == 'PASSED'){
                summary['samples']['passed']+=1;
            }else if (doc.projects[p].samples[s].library_status == 'FAILED'){
                summary['samples']['failed']+=1;
            }else{
                summary['samples']['unknown']+=1;
            }
        }
    }
    emit(doc.name, summary);
}
