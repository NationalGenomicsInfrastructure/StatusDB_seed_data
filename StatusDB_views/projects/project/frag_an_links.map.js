function  (doc) {
       data={};
       for (sample in doc.samples){
           data[sample]={}
           if (doc.samples[sample].hasOwnProperty('initial_qc') && doc.samples[sample].initial_qc.hasOwnProperty('frag_an_image')){
               data[sample]["initial_qc"]=doc.samples[sample].initial_qc.frag_an_image;
           }
           if (doc.samples[sample].hasOwnProperty('library_prep')){
               for(libprep in doc.samples[sample].library_prep){
                  if(doc.samples[sample].library_prep[libprep].hasOwnProperty('library_validation')){
                      for (libvalart in doc.samples[sample].library_prep[libprep].library_validation){
                          if (doc.samples[sample].library_prep[libprep].library_validation[libvalart].hasOwnProperty('frag_an_image')){
                              data[sample]['libval'+libprep]=doc.samples[sample].library_prep[libprep].library_validation[libvalart].frag_an_image;
  
                          }
                      }
                  }
              }
          }
      }
      emit(doc.project_id , data);
  }

