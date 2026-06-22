function(doc) {
  var summary = {
    first_generated: null,
    run_setup: null,
    instrument_type: null,
    run_mode: null,
    lane_info: {}
  }

  // Retrieve information of involved projects per lane
  if (doc.hasOwnProperty('calculated') && doc.calculated.hasOwnProperty('lanes')) {
    for (var lane_num in doc.calculated.lanes) {
      if (doc.calculated.lanes[lane_num].hasOwnProperty('sample_rows')) {
        var projects = [];
        var seen_projects = {};

        for (var sample_id in doc.calculated.lanes[lane_num].sample_rows) {
          var sample_row = doc.calculated.lanes[lane_num].sample_rows[sample_id];
          if (sample_row.hasOwnProperty('project_id') && sample_row.hasOwnProperty('project_name')) {
            var pid = sample_row.project_id;
            var pname = sample_row.project_name;
            var project_key = pid + '|' + pname;

            if (!seen_projects[project_key]) {
              projects.push({"project_id": pid, "project_name": pname});
              seen_projects[project_key] = true;
            }
          }
        }

        if (projects.length > 0) {
          summary["lane_info"][lane_num] = {"projects": projects};
        }
      }
    }
  }

  if (doc.hasOwnProperty('flowcell_id') && (doc.hasOwnProperty('metadata'))) {
    if (doc.metadata.hasOwnProperty('first_generated')) {
      summary['first_generated'] = doc.metadata.first_generated;
    }
    if (doc.metadata.hasOwnProperty('run_setup')) {
      summary['run_setup'] = doc.metadata.run_setup;
    }
    if (doc.metadata.hasOwnProperty('instrument_type')) {
      summary['instrument_type'] = doc.metadata.instrument_type;
    }
    if (doc.metadata.hasOwnProperty('run_mode')) {
      summary['run_mode'] = doc.metadata.run_mode;
    }

    emit([summary.first_generated, doc.flowcell_id], summary)
  }
}