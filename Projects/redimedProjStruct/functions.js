module.exports = {
	convertFromHoursToDateTime: function(hours){
		date = new Date();

		var dates = date.getDate();
		var month = date.getMonth()+1;
		var year = date.getFullYear();

		var split = hours.split(":");

		var hours = split[0];
		var minutes = split[1];
		var seconds = date.getSeconds();

		var result = year+"-"+month+"-"+dates+" "+hours+":"+minutes+":"+seconds;
		return result;
	},
	getWeekFromDate: function(date){
		var firstDay = new Date(date.getFullYear(), date.getMonth()+1, 1).getDay();
		return Math.ceil((date.getDate() + firstDay)/7);
	},
	getDateOffset: function(current_date, time, offset){
		if(offset >= 0){
			var date = new Date();
			var millisecondOffset = offset * 24 * 60 * 60 * 1000;
			date.setTime(current_date.getTime()+millisecondOffset);
			
			var dates = date.getDate();
			var month = date.getMonth()+1;
			var year = date.getFullYear();

			if(dates < 0){
				dates = "0"+dates;
			}

			if(month < 0){
				month = "0"+month;
			}

			var result = year+"-"+month+"-"+dates+" "+time+":00";

			return result;
		}
	},
	toMinutes: function(current_time, minutes){
		var split = current_time.split(":");

		var minutes_add = parseInt(split[0])*60+parseInt(split[1])+parseInt(minutes);

		return minutes_add;
	},
	toTime: function(current_time){
		var hour = Math.floor(current_time/60);
		var minute = current_time%60;

		return hour+":"+minute;
	},
	toDateDatabase: function(date){
		var dates = date.getDate();
		var month = date.getMonth()+1;
		var year = date.getFullYear();

		return year+"-"+month+"-"+dates;
	}
};