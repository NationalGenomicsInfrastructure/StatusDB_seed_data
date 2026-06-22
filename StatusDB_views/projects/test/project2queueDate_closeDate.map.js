/*
 * test/project2queueDate_closeDate
 * Map function
 */
 
function(doc) {

	var queued = "0000-00-00";
	var close = "0000-00-00";
    var day = 1000*60*60*24;

    var dayDiff = function (date1, date2) { 
                    var diff = Math.ceil((date2.getTime()-date1.getTime())/(day));
                    return diff;				
                }

	var production = (doc["details"]["type"] == "Production");
	if(production) {
        if (doc["details"]["queued"]) {       
            queued = doc["details"]["queued"];
        }
        if (doc["close_date"]) {
            close = doc["close_date"];
        }
        
        var bin = null;
        var today = new Date();
        var diff;
        //var unit = "week";
        var unit = "w";
        
        if(doc["details"]["queued"] && doc["close_date"]) {
            var qD = new Date(queued);
            var cD = new Date(close);
            diff = dayDiff(qD, cD);
            //diff = Math.ceil( (cD.getTime()-qD.getTime()) / day);
            //if(diff <= 4 * 7 * day) {
            if(diff <= 6 * 7 * day) {
                //bin = "0-4 weeks";
                bin = "0-6 " + unit;
            //} else if (diff <= 8 * 7 * day) {
            //    bin = "4-8 weeks";
            } else if (diff <= 12 * 7 * day) {
                //bin = "8-12 weeks";
                bin = "6-12 " + unit;
            } else if (diff <= 24 * 7 * day) {
                bin = "12-24 " + unit;
            } else if (diff <= 52 * 7 * day) {
                bin = "24-52 " + unit;
            }             
        }
		var KPI = Object();
        KPI["Queue date"] = queued;
        KPI["Close date"] = close;
        KPI["Total time"] = diff;
 		emit([ bin, doc["project_name"] ], KPI);
	}
}
