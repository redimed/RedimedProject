var fs = require('fs');

module.exports = {
	commonSearch: function(post_fields){
		var sql_where = "";
		var select_fields = [];

		for(var i = 0; i < post_fields.length; i++){
			if(post_fields[i].type === 'text'){
				sql_where += "IFNULL("+post_fields[i].name+", '') LIKE '%"+post_fields[i].value+"%' AND ";
			}else if(post_fields[i].type === 'select'){
				if(post_fields[i].value === null)
					post_fields[i].value = '';
				sql_where += "IFNULL("+post_fields[i].name+", '') LIKE '%"+post_fields[i].value+"%' AND ";
			}
			select_fields.push(post_fields[i].name);
		}// end for

		sql_where = sql_where.substring(0, sql_where.length-5);

		return sql_where;
	},// end commonSearch

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
		var split = current_time.split(" ");
		split = split[1].split(":");

		var minutes_add = parseInt(split[0])*60+parseInt(split[1])+parseInt(minutes);

		return minutes_add;
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

	toTime: function(current_time){
		var hour = Math.floor(current_time/60);
		var minute = current_time%60;

		if(hour < 10)
			hour = "0"+hour;

		if(minute < 10)
			minute = "0"+minute;

		return hour+":"+minute;
	},

	getWeekFromDate: function(date){
		var firstDay = new Date(date.getFullYear(), date.getMonth()+1, 1).getDay();
		return Math.ceil((date.getDate() + firstDay)/7);
	},

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

	appendString:function(fullString, appendString, index, rem) {
    	return (fullString.slice(0,index) + appendString + fullString.slice(index + Math.abs(rem)));
	},

	createFile: function(directory, filename, content){
		var file = directory+"/"+filename+".js";

		fs.exists(file, function(exists){
			if(exists){
				return false;
			}else{
				fs.appendFile(file, content, encoding='utf-8', function(error){
					if(error) {
						throw error;
						return false;
					}
					else return true;
				});
			}
		});
	}
}