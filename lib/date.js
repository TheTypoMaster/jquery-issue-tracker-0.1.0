
//will split format of 02-01-2015 or 02/01/2015
exports.dateFormatDash = function(dateString, endian, callback){
	newDate = '';
	var date = dateString.split('-');	
	dateEndian(date, endian, function(month){
		callback(month);
	});
}

exports.dateFormatSlash = function(dateString, endian, callback){
	newDate = '';
	var date = dateString.split('/');	
	dateEndian(date, endian, function(month){
		callback(month);
	});
}

function dateEndian(dateVal, endian, callback) {
	switch (endian) {
		case 'L':
			newDate = dateVal[0] + "-" + dateVal[1] + "-" + dateVal[2];
			break;
		case 'M':
			newDate = dateVal[1] + "-" + dateVal[0] + "-" + dateVal[2];
			break;
		case 'B':
			newDate = dateVal[2] + "-" + dateVal[1] + "-" + dateVal[0];
			break;
	}
	
	callback(newDate);
}

// var DateTime = (function(){
// 		setTimes = function(op, cl, formatted){
// 			console.log(op)
// 			var op  = new Date(op);
// 			var cl = new Date(cl);
// 			getDiff(cl, op, formatted);
// 		};
// 	    getDiff = function(cl, op, formatted){
// 	    	var diff = (cl - op)/1000;
// 			console.log(diff);
// 			if(!formatted){
// 				return diff;
// 			}else{
// 				console.log(getSecondsToString(diff));
// 				return getSecondsToString(diff);
// 			}
			
// 	    };
// 	    getSecondsToString = function(s) {
// 	    	var dd = Math.floor(s / 86400);
// 			var hh = Math.floor((s % 86400) / 3600);
// 			var mm = Math.floor(((s % 86400) % 3600) / 60);
// 			var ss = ((s % 86400) % 3600) % 60;

// 			return dd + " days " + hh + " hours " + mm + " minutes " + ss + " seconds";

// 	    };

// 	    return {
// 	    	getDifference: setTimes
// 	    }
	
// })();



var setTimes = function(op, cl, formatted){
	// console.log('opened at :' + op + ' - closed at: ' + cl)
	var op  = new Date(op);
	var cl = new Date(cl);
	var diff = (cl - op)/1000;

	return diff;
};

exports.dateTimes = function(createAt, closedAt, formatted, callback){
	if(closedAt != null){
		val = setTimes(createAt, closedAt, formatted);
		callback(val)
	}else{
		var dd = Math.floor(diff / 86400);
		var hh = Math.floor((diff % 86400) / 3600);
		var mm = Math.floor(((diff % 86400) % 3600) / 60);
		var ss = ((diff % 86400) % 3600) % 60;

		val = dd + " days " + hh + " hours " + mm + " minutes " + ss + " seconds";
		callback(val)
	}
}
exports.DateDifference = setTimes;
