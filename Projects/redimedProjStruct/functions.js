var mkdirp = require('mkdirp');

module.exports = {
	convertFromHoursToDateTime: function(hours){
		date = new Date();

		var dates = date.getDate();

		if(dates < 10){
			dates = "0"+dates;
		}

		var month = date.getMonth()+1;

		if(month < 10){
			month = "0"+month;
		}

		var year = date.getFullYear();

		var split = hours.split(":");

		var hours = split[0];
		var minutes = split[1];
		var seconds = date.getSeconds();

		if(seconds < 10){
			seconds = "0"+seconds;
		}

		var result = year+"-"+month+"-"+dates+" "+hours+":"+minutes+":"+seconds;
		return result;
	},
	getWeekFromDate: function(date){
		var firstDay = new Date(date.getFullYear(), date.getMonth()+1, 1).getDay();
		return Math.ceil((date.getDate() + firstDay)/7);
	},
	getDateOffset: function(current_date, time, offset){
		var date = new Date();

		var current_day = date.getDay()-1;

		offset = current_day+offset;

		var millisecondOffset = offset * 24 * 60 * 60 * 1000;

		date.setTime(current_date.getTime()+millisecondOffset);
		
		var dates = date.getDate();
		var month = date.getMonth()+1;
		var year = date.getFullYear();

		if(dates < 10){
			dates = "0"+dates;
		}

		if(month < 10){
			month = "0"+month;
		}

		var result = year+"-"+month+"-"+dates+" "+time+":00";

		return result;
	},
	getFirstDateOffset: function(current_date, time, offset){
		var date = new Date();

		var millisecondOffset = offset * 24 * 60 * 60 * 1000;

		date.setTime(current_date.getTime()+millisecondOffset);
		
		var dates = date.getDate();
		var month = date.getMonth()+1;
		var year = date.getFullYear();

		if(dates < 10){
			dates = "0"+dates;
		}

		if(month < 10){
			month = "0"+month;
		}

		var result = year+"-"+month+"-"+dates+" "+time+":00";

		return result;
	},
	toMinutes: function(current_time, minutes){
		var split = current_time.split(":");

		var minutes_add = parseInt(split[0])*60+parseInt(split[1])+parseInt(minutes);

		return minutes_add;
	},
	toTime: function(current_time){
		var hour = Math.floor(current_time/60);
		var minute = current_time%60;

		if(hour < 10)
			hour = "0"+hour;

		if(minute < 10)
			minute = "0"+minute;

		return hour+":"+minute;
	},
	toDateDatabase: function(date){
		if(typeof date === 'string'){
			var split = date.split("/");

			var dates = split[0];
			var month = split[1];
			var year = split[2];
		}else{
			var dates = date.getDate();
			var month = date.getMonth()+1;
			var year = date.getFullYear();
		}

		return year+"-"+month+"-"+dates;
	},
	getCommonDateDatabase : function(dateTime){
        if(dateTime === '' || typeof dateTime === 'undefined')
            return '';

        var split = dateTime.split("/");

        var year = split[2];
        var month = split[1];
        var date = split[0];

        if(month < 10){
            month = "0"+month;
        }

        if(date < 10){
            date = "0"+date;
        }

        return year+"-"+month+"-"+date;
    }
};
