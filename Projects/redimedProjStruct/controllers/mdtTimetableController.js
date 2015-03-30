var db = require('../models');
var mdt_functions = require('../mdt-functions.js');
var common_function = require("../functions.js");

module.exports = {
	addRow: function(req, res){
		var from_time = req.body.FROM_TIME;
		var to_time = req.body.TO_TIME;
		var site_id = req.body.SITE_ID;
		var doctor_id = req.body.DOCTOR_ID;
		var clinical_dept_id = req.body.CLINICAL_DEPT_ID;
		var service_id = req.body.SERVICE_ID;

		var sql = "INSERT INTO cln_appointment_calendar(FROM_TIME, TO_TIME, SITE_ID, DOCTOR_ID, CLINICAL_DEPT_ID, SERVICE_ID) VALUES('"+from_time+"', '"+to_time+"', '"+site_id+"', '"+doctor_id+"', '"+clinical_dept_id+"', '"+service_id+"')";


		db.sequelize.query(sql)
		.success(function(result){
			res.json({status: "success"});
		})
		.error(function(error){
			res.json(500, {status: 'error', 'message': error});
		})
	},
	remove: function(req, res){
		var cal_id = req.body.cal_id;

		var sql = "DELETE FROM cln_appointment_calendar WHERE CAL_ID="+cal_id;

		db.sequelize.query(sql)
		.success(function(result){
			res.json({status: "success"});
		})
		.error(function(error){
			res.json(500, {status: 'error', 'message': error});
		})
	},
	postByDoctor: function(req, res){
		var doctor_id = req.body.doctor_id;

		var sql = "SELECT * FROM sys_permernant_calendar_df WHERE doctor_id = "+doctor_id;

		db.sequelize.query(sql)
		.success(function(result){
			res.json({status: 'success', data: result});
		})
		.error(function(error){
			res.json(500, {status: 'error', 'message': error});
		})
	},
	showWeek: function(req, res){
		var doctor_id = req.body.doctor_id;
		var cal_header_df_id = req.body.cal_header_df_id;

		var sql = "SELECT * FROM sys_cal_sites_df WHERE doctor_id="+doctor_id+" AND cal_header_df_id="+cal_header_df_id+" AND isenable=1 ORDER BY site_id";

		db.sequelize.query(sql)
		.success(function(result){
			res.json({status: 'success', data: result});
		})
		.error(function(error){
			res.json(500, {status: 'error', 'message': error});
		})
	},
	timetableRemove: function(req, res){
		var cal_header_df_id = req.body.cal_header_df_id;

		var sql = "DELETE FROM sys_permernant_calendar_df WHERE cal_header_df_id='"+cal_header_df_id+"'";
		db.sequelize.query(sql)
		.success(function(result){
			res.json({status: "success"});
		})
		.error(function(error){
			res.json(500, {status: 'error', 'message': error});
		})	
	},
	add: function(req, res){
		var timetable = req.body.timetable;
		var doctor_id = req.body.doctor_id;

		if(typeof timetable.cal_header_df_id !== 'undefined'){
			var sql_1 = "DELETE FROM sys_permernant_calendar_df WHERE cal_header_df_id="+timetable.cal_header_df_id+" AND doctor_id="+doctor_id;
			var sql_2 = "INSERT INTO sys_permernant_calendar_df(cal_header_df_id, doctor_id, service_id, day_of_Week, from_time, to_time, isenable) VALUES";

			sql_2 += "('"+timetable.cal_header_df_id+"', '"+doctor_id+"', '"+timetable.service_id+"', '"+timetable.dow+"', '"+mdt_functions.convertFromHoursToDateTime(timetable.from_time_display)+"', '"+mdt_functions.convertFromHoursToDateTime(timetable.to_time_display)+"', 1),";
			sql_2 = sql_2.substring(0, sql_2.length-1);

			db.sequelize.query(sql_1)
			.success(function(tested){
				db.sequelize.query(sql_2)
				.success(function(created){
					res.json({status: 'success', data: created});
				})
				.error(function(error){
					res.json(500, {status: 'error', 'message': error});		
				})
			})
		}else{
			//var sql_1 = "SELECT MAX(cal_header_df_id) AS cal_header_df_id FROM sys_permernant_calendar_df LIMIT 1";
			var sql_2 = "INSERT INTO sys_permernant_calendar_df(doctor_id, service_id, day_of_Week, from_time, to_time, isenable) VALUES";

			sql_2 += "('"+doctor_id+"', '"+timetable.service_id+"', '"+timetable.dow+"', '"+mdt_functions.convertFromHoursToDateTime(timetable.from_time_display)+"', '"+mdt_functions.convertFromHoursToDateTime(timetable.to_time_display)+"', 1),";

			sql_2 = sql_2.substring(0, sql_2.length-1);

			db.sequelize.query(sql_2)
			.success(function(created){
				res.json({status: 'success', data: created});
			})
			.error(function(error){
				res.json(500, {status: 'error', 'message': error});
			})
		}
	},
	addSite: function(req, res){
		var doctor_id = req.body.doctor_id;
		var cal_header_df_id = req.body.cal_header_df_id;
		var content = req.body.content;

		var sql_1 = "DELETE FROM sys_cal_sites_df WHERE doctor_id="+doctor_id+" AND cal_header_df_id="+cal_header_df_id;
		var sql_2 = "INSERT INTO sys_cal_sites_df(cal_header_df_id, week_ord_of_month, site_id, isenable, doctor_id) VALUES";

		for(var i = 0; i < content.length; i++){
			sql_2 += "('"+cal_header_df_id+"', '"+content[i].week_ord_of_month+"', '"+content[i].site_id+"', 1, '"+doctor_id+"'),";
		}

		sql_2 = sql_2.substring(0, sql_2.length-1);

		db.sequelize.query(sql_1)
		.success(function(deleted){
			db.sequelize.query(sql_2)
			.success(function(created){
				res.json({status: 'success', data: created});
			})
			.error(function(error){
				res.json(500, {status: 'error', 'message': error});		
			})
		})
		.error(function(error){
			res.json(500, {status: 'error', 'message': error});
		})
	},//end addsite
	generate: function(req, res){
		var doctor_id = req.body.doctor_id;
		var timetable_interval = req.body.interval;
		var clinical_id = req.body.clinical_id;

		var sql_1 = "SELECT pcd.cal_header_df_id, pcd.doctor_id, GROUP_CONCAT(pcd.service_id) AS SERVICES, pcd.day_of_Week, GROUP_CONCAT(pcd.from_time) AS FROM_TIMES, GROUP_CONCAT(pcd.to_time) AS TO_TIMES, GROUP_CONCAT(sites.WEEKS) WEEKS, GROUP_CONCAT(sites.SITES) SITES FROM sys_permernant_calendar_df pcd"
					+" LEFT OUTER JOIN ("
					+"SELECT cal_header_df_id, doctor_id, GROUP_CONCAT(week_ord_of_month) AS WEEKS, GROUP_CONCAT(site_id) AS SITES"
					+" FROM sys_cal_sites_df GROUP BY  cal_header_df_id, doctor_id"
					+") AS sites ON sites.cal_header_df_id=pcd.cal_header_df_id AND sites.doctor_id=pcd.doctor_id AND pcd.doctor_id="+doctor_id
					+" GROUP BY pcd.cal_header_df_id, pcd.doctor_id";

		var current_date = new Date();
		var day_list = {
            '0':'Sunday',
            '1':'Monday',
            '2':'Tuesday',
            '3':'Wednesday',
            '4':'Thursday',
            '5':'Friday',
            '6':'Saturday'
        };

        var day_list_reverse = {
            'Sunday': '0',
            'Monday': '1',
            'Tuesday': '2',
            'Wednesday': '3',
            'Thursday': '4',
            'Friday': '5',
            'Saturday': '6'
        }

        var current_day = current_date.getDay();
        var remaining_day = 7-current_day;

        if(remaining_day === 7){
            remaining_day = 0;
        }

        var current_week = mdt_functions.getWeekFromDate(current_date);
        if(current_week === 5) current_week = 1;

        var sql = "INSERT INTO cln_appointment_calendar"+
                    "(DOCTOR_ID, SITE_ID, CLINICAL_DEPT_ID, SERVICE_ID, FROM_TIME, TO_TIME, STATUS) VALUES";

        //INIT CALENDAR
        remain_day_list = [
            {'day_of_Week': day_list[current_day], 'day_of_Week_key': current_day}
        ];

        var temp_day = current_day;
        for(var i = 0; i < remaining_day; i++){
            var temp_day = temp_day+1;
            if(temp_day === 7)
                temp_day = 0;
            remain_day_list.push({'day_of_Week': day_list[temp_day], 'day_of_Week_key': temp_day});
        }
        //END INIT CALENDAR

		db.sequelize.query(sql_1)
		.success(function(list){
			//INIT CALENDAR
			for(var i = 0; i < remain_day_list.length; i++){
	            for(var j = 0; j < list.length; j++){
	            	if(list[j].WEEKS && list[j].SITES){
	            		var WEEKS = list[j].WEEKS.split(",");
                    	var SITES = list[j].SITES.split(",");

                    	if(list[j].FROM_TIMES !== null){
	                    	var FROM_TIMES = list[j].FROM_TIMES.split(",");
	                    	var TO_TIMES = list[j].TO_TIMES.split(",");
	                    	var SERVICES = list[j].SERVICES.split(",");

	                    	for(var k = 0; k < FROM_TIMES.length; k++){
	                    		if(list[j].day_of_Week === remain_day_list[i].day_of_Week){
	                    			var offset = day_list_reverse[list[j].day_of_Week]-current_day;

	                    			var FROM_MINUTES = mdt_functions.toMinutes(FROM_TIMES[k], 0);
	                        		var TO_MINUTES = mdt_functions.toMinutes(TO_TIMES[k], 0);

	                        		var from = FROM_MINUTES;
	                        		while(from+timetable_interval <= TO_MINUTES){
	                        			var add_from_time = mdt_functions.toTime(from);
                            			var add_to_time = mdt_functions.toTime(parseInt(from+timetable_interval));

                            			var FROM_DATE = mdt_functions.getFirstDateOffset(current_date, add_from_time, offset);
                            			var TO_DATE = mdt_functions.getFirstDateOffset(current_date, add_to_time, offset);

                            			// SITE
			                            var site_id = 0;
			                            for(var site = 0; site < SITES.length; site++){
			                                if(current_week == WEEKS[site]){
			                                    site_id = SITES[site];
			                                    break;
			                                }else{
			                                    var temp_week = current_week;
			                                    while(temp_week > 1){
			                                        temp_week = Math.floor(temp_week/2);

			                                        if(temp_week == WEEKS[temp_week-1]){
			                                            site_id = SITES[temp_week-1];
			                                            break;
			                                        }
			                                    }
			                                }
			                            }
			                            // END SITE
                            			
                            			sql += "('"+doctor_id+"', "+site_id+", "+clinical_id+", "+SERVICES[k]+", '"+FROM_DATE+"', '"+TO_DATE+"', 'No Appoinment'),";
                            			from += timetable_interval;
	                        		}//end while
	                    		}
	                    	}//end for 3
	                    }//end if FROM TIMES

	            	}//end if
	            }//end for 2
	        }//end for 1
			//END INIT CALENDAR

			//LOOP 52 DAYS
	        var week = 1;
	        if(current_week == 4)
	            week = 1;
	        else
	            week = week+1;
	        var remaining_date = new Date();
	        var millisecondOffset = (remaining_day+1) * 24 * 60 * 60 * 1000;
	        remaining_date.setTime(current_date.getTime()+millisecondOffset);
	        var loop_date = remaining_date;

	        for(var i = 1; i <= 52; i++){
	            if(week == 5)
	                week = 1;
	            for(var j = 0; j < list.length; j++){
	            	if(list[j].WEEKS && list[j].SITES){
	            		var WEEKS = list[j].WEEKS.split(",");
                    	var SITES = list[j].SITES.split(",");

                    	if(list[j].FROM_TIMES !== null){
	                    	var FROM_TIMES = list[j].FROM_TIMES.split(",");
	                    	var TO_TIMES = list[j].TO_TIMES.split(",");
	                    	var SERVICES = list[j].SERVICES.split(",");

	                    	for(var k = 0; k < FROM_TIMES.length; k++){
                    			var offset = day_list_reverse[list[j].day_of_Week]-current_day;

                    			var FROM_MINUTES = mdt_functions.toMinutes(FROM_TIMES[k], 0);
                        		var TO_MINUTES = mdt_functions.toMinutes(TO_TIMES[k], 0);

                        		var from = FROM_MINUTES;
                        		while(from+timetable_interval <= TO_MINUTES){
                        			var add_from_time = mdt_functions.toTime(from);
                        			var add_to_time = mdt_functions.toTime(parseInt(from+timetable_interval));

                        			var FROM_DATE = mdt_functions.getDateOffset(loop_date, add_from_time, offset);
                        			var TO_DATE = mdt_functions.getDateOffset(loop_date, add_to_time, offset);

                        			// SITE
		                            var site_id = 0;
		                            for(var site = 0; site < SITES.length; site++){
		                                if(current_week == WEEKS[site]){
		                                    site_id = SITES[site];
		                                    break;
		                                }else{
		                                    var temp_week = current_week;
		                                    while(temp_week > 1){
		                                        temp_week = Math.floor(temp_week/2);

		                                        if(temp_week == WEEKS[temp_week-1]){
		                                            site_id = SITES[temp_week-1];
		                                            break;
		                                        }
		                                    }
		                                }
		                            }
		                            // END SITE
                        			
                        			sql += "('"+doctor_id+"', "+site_id+", "+clinical_id+", "+SERVICES[k]+", '"+FROM_DATE+"', '"+TO_DATE+"', 'No Appoinment'),";
                        			from += timetable_interval;
                        		}//end while
	                    	}//end for 3
	                    }//end if FROM TIMES
	            	}//end if WEEKS AND SITES
	            }//end for j

	            var temp_date = new Date();
	            var millisecondOffset = 7 * 24 * 60 * 60 * 1000;
	            temp_date.setTime(loop_date.getTime()+millisecondOffset);
	            loop_date = temp_date;
	            week++;
	        }//end for i
	        //END LOOP 52 DAYS

	        current_date = mdt_functions.toDateDatabase(current_date);
        	end_date = mdt_functions.toDateDatabase(loop_date);
        	sql = sql.substring(0, sql.length - 1);

        	var remove_sql = "DELETE FROM cln_appointment_calendar WHERE DATE(FROM_TIME) BETWEEN '"+current_date+"' AND '"+end_date+"' AND DOCTOR_ID='"+doctor_id+"'";

        	db.sequelize.query(remove_sql)
        	.success(function(deleted){
        		db.sequelize.query(sql)
        		.success(function(created){
        			res.json({status: 'success', data: list, sql: sql});
        		})
        		.error(function(error){
        			res.json(500, {status: 'error', 'message': error});		
        		})
        	})
        	.error(function(error){
        		res.json(500, {status: 'error', 'message': error});	
        	});
		})
		.error(function(error){
			res.json(500, {status: 'error', 'message': error});
		})
	}
}