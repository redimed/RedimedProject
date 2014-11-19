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
    },
	printReportPDF: function(reportId,patientId,reportName){
		var java = require('java');
		java.options.push("-Djava.awt.headless=true");
		java.classpath.push('commons-lang3-3.1.jar');
		java.classpath.push('commons-io.jar');
		java.classpath.push('./lib/commons-beanutils-1.8.2.jar');
		java.classpath.push('./lib/commons-collections-3.2.1.jar');
		java.classpath.push('./lib/commons-digester-2.1.jar');
		java.classpath.push('./lib/commons-logging-1.1.jar');
		java.classpath.push('./lib/groovy-all-2.0.1.jar');
		java.classpath.push('./lib/iText-2.1.7.js2.jar');
		java.classpath.push('./lib/jasperreports-5.6.0.jar');
		java.classpath.push('./lib/mysql-connector-java-5.1.13-bin.jar');

		var HashMap = java.import('java.util.HashMap');
		var JRException = java.import('net.sf.jasperreports.engine.JRException');
		var JasperExportManager = java.import('net.sf.jasperreports.engine.JasperExportManager');
		var JasperFillManager = java.import('net.sf.jasperreports.engine.JasperFillManager');
		var JasperPrint = java.import('net.sf.jasperreports.engine.JasperPrint');
		var DriverManager = java.import('java.sql.DriverManager');
		var Driver = java.import('com.mysql.jdbc.Driver');
		var InputStream = java.import('java.io.InputStream');
		var FileInputStream = java.import('java.io.FileInputStream');

		mkdirp('.\\download\\report\\'+'patientID_'+patientId, function (err) {
			if (err) console.error(err)
			else console.log('success!')
		});


		var con = java.callStaticMethodSync('java.sql.DriverManager','getConnection',"jdbc:mysql://localhost:3306/sakila","root","root");

		var paramMap = new HashMap();

		paramMap.putSync("id",parseInt(reportId));
		paramMap.putSync("realPath","./reports/");


		var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager','fillReport','./reports/'+reportName,paramMap,con);

		java.callStaticMethodSync('net.sf.jasperreports.engine.JasperExportManager','exportReportToPdfFile',jPrint,'.\\download\\report\\'+'patientID_'+patientId+'\\'+reportName);

		res.download('.\\download\\report\\'+'patientID_'+patientId+'\\'+reportName);
	}
};
