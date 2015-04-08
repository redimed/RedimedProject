var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var db = require('../models');
var S = require('string');
var moment = require('moment');
var _ = require('lodash');

module.exports = {
	postRemove: function(req, res){
		var postData = req.body.data;

		var sql = knex('sys_cal_sites_df')
		.where({
			cal_header_df_id: postData.cal_header_df_id,
			doctor_id: postData.doctor_id
		})
		.del()
		.toString();

		var sql_2 = knex('sys_permernant_calendar_df')
		.where('cal_header_df_id', postData.cal_header_df_id)
		.del()
		.toString();


		db.sequelize.query(sql)
		.success(function(deleted){
			db.sequelize.query(sql_2)
			.success(function(deleted){
				res.json({data: deleted});
			})
			.error(function(error){
				res.status(500).json({error: error, sql: sql});	
			})
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	postSiteRemove: function(req, res){
		var postData = req.body.data;

		var sql = knex('sys_cal_sites_df')
		.where('id', postData.id)
		.del()
		.toString();

		db.sequelize.query(sql)
		.success(function(deleted){
			res.json({data: deleted});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	postCreateTimetable: function(req, res){
		var postData = req.body.data;

		if(postData.site.length === 0){
			res.status(500).json({message: 'There is no site to add'});
			return;
		}

		var weekEnd = 7;

		var dowFromDate = moment(postData.from_date).days();
		var diffFromDateToSunday = weekEnd - dowFromDate;
		var diffFromDateToToDay = moment(postData.to_date).diff(moment(postData.from_date), 'days');

		var dateArrayFromDayToDate = [];

		//GET FIRST WEEK
		if(diffFromDateToSunday < diffFromDateToToDay){
			for(var i = 0; i <= diffFromDateToSunday; i++){
				var current_date = moment(postData.from_date).add(i, 'day').format('YYYY-MM-DD');

				var site_id = 0;
				_.forEach(postData.site, function(site){
					if(site.week_ord_of_month === 1)
						site_id = site.site_id;
				})

				if(moment(current_date).days() === postData.day_of_Week_code){
					var from_time_seconds = commonFunction.addInterval(postData.from_time, 0);
					var to_time_seconds = commonFunction.addInterval(postData.to_time, 0);

					while(from_time_seconds < to_time_seconds){
						var from_time_hhmm = commonFunction.toHHMM(from_time_seconds);
						var from_add_time_seconds = commonFunction.addInterval(from_time_hhmm, postData.Appt_interval);
						var to_time_hhmm = commonFunction.toHHMM(from_add_time_seconds);					

						var object = {CURRENT_DATE: current_date, DOCTOR_ID: postData.doctor_id, SITE_ID: site_id, 
									FROM_TIME: from_time_hhmm, TO_TIME: to_time_hhmm, SERVICE_ID: postData.service_id,
									CLINICAL_DEPT_ID: postData.clinical_dept_id};
						dateArrayFromDayToDate.push(object);

						from_time_seconds = from_time_seconds + postData.Appt_interval*60;
					}
				}//end if
			}

			var current_site = 2;
			var diff_day = 0;

			for(var i = diffFromDateToSunday+1; i <= diffFromDateToToDay; i++){
				var current_date = moment(postData.from_date).add(i, 'day').format('YYYY-MM-DD');

				var site_id = 0;

				var temp_site = current_site;
				while(!site_id){
					_.forEach(postData.site, function(site){
						if(site.week_ord_of_month === temp_site){
							site_id = site.site_id;
							return;
						}
					})

					if(!site_id){
						if(temp_site === 4) temp_site = 2;
						else if(temp_site === 3) temp_site = 1;
						else temp_site--;
					}
				}

				if(moment(current_date).days() === postData.day_of_Week_code){
					var from_time_seconds = commonFunction.addInterval(postData.from_time, 0);
					var to_time_seconds = commonFunction.addInterval(postData.to_time, 0);

					while(from_time_seconds < to_time_seconds){
						var from_time_hhmm = commonFunction.toHHMM(from_time_seconds);
						var from_add_time_seconds = commonFunction.addInterval(from_time_hhmm, postData.Appt_interval);
						var to_time_hhmm = commonFunction.toHHMM(from_add_time_seconds);					

						var object = {CURRENT_DATE: current_date, DOCTOR_ID: postData.doctor_id, SITE_ID: site_id, 
									FROM_TIME: from_time_hhmm, TO_TIME: to_time_hhmm, SERVICE_ID: postData.service_id,
									CLINICAL_DEPT_ID: postData.clinical_dept_id};
						dateArrayFromDayToDate.push(object);

						from_time_seconds = from_time_seconds + postData.Appt_interval*60;
					}
				}//end if

				if(diff_day === 6){
					diff_day = -1;
					current_site++;
				}

				diff_day++;

				if(current_site === 5) current_site = 1;
			}

		}else{
			for(var i = 0; i <= diffFromDateToToDay; i++){
				var current_date = moment(postData.from_date).add(i, 'day').format('YYYY-MM-DD');

				var site_id = 0;
				_.forEach(postData.site, function(site){
					if(site.week_ord_of_month === 1)
						site_id = site.site_id;
				})

				if(moment(current_date).days() === postData.day_of_Week_code){
					var from_time_seconds = commonFunction.addInterval(postData.from_time, 0);
					var to_time_seconds = commonFunction.addInterval(postData.to_time, 0);

					while(from_time_seconds < to_time_seconds){
						var from_time_hhmm = commonFunction.toHHMM(from_time_seconds);
						var from_add_time_seconds = commonFunction.addInterval(from_time_hhmm, postData.Appt_interval);
						var to_time_hhmm = commonFunction.toHHMM(from_add_time_seconds);					

						var object = {CURRENT_DATE: current_date, DOCTOR_ID: postData.doctor_id, SITE_ID: site_id, 
									FROM_TIME: from_time_hhmm, TO_TIME: to_time_hhmm, SERVICE_ID: postData.service_id,
									CLINICAL_DEPT_ID: postData.clinical_dept_id};
						dateArrayFromDayToDate.push(object);

						from_time_seconds = from_time_seconds + postData.Appt_interval*60;
					}
				}//end if
			}
		}
		//END GET FIRST WEEK

		if(dateArrayFromDayToDate.length > 0){
			var sql = knex('cln_appointment_calendar_backup')
			.insert(dateArrayFromDayToDate)
			.toString();

			db.sequelize.query(sql)
			.success(function(response){
				res.json({data: 'created'});
			})
			.error(function(error){
				res.status(500).json({error: error, sql: sql});
			})
		}else{
			res.json({data: null});
		}

	},

	postSiteAdd: function(req, res){
		var postData = req.body.data;

		var errors = [];

		var required = [	
			{field: 'week_ord_of_month', message: 'Week is required'},
			{field: 'site_id', message: 'Site is required'}
		]

		_.forIn(postData, function(value, field){
			_.forEach(required, function(field_error){
				if(field_error.field === field && S(value).isEmpty()){
					errors.push(field_error);
					return;
				}
			})
		})

		if(errors.length > 0){
			res.status(500).json({errors: errors});
			return;
		}

		var sql_check = knex
		.column('id')
		.select()
		.from('sys_cal_sites_df')
		.where({
			doctor_id: postData.doctor_id,
			cal_header_df_id: postData.cal_header_df_id,
			week_ord_of_month: postData.week_ord_of_month
		})
		.toString();

		var sql_insert = knex('sys_cal_sites_df')
		.insert(postData)
		.toString();

		db.sequelize.query(sql_check)
		.success(function(response){
			if(response.length > 0){
				errors.push({field: 'week_ord_of_month', message: 'This week exists'});
				if(errors.length > 0){
					res.status(500).json({errors: errors});
					return;
				}
			}else{
				db.sequelize.query(sql_insert)
				.success(function(created){
					res.json({created: created});
				})
				.error(function(){
					res.status(500).json({error: error, sql: sql});		
				})
			}
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	postRedimedsiteList: function(req, res){
		var postData = req.body.data;

		var sql = knex
		.column('redimedsites.*')
		.from('redimedsites')
		.innerJoin('redimedsite_depts', 'redimedsites.id', 'redimedsite_depts.Site_id')
		.where({
			'redimedsite_depts.CLINICAL_DEPT_ID': postData.CLINICAL_DEPT_ID
		})
		.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	postAdd: function(req, res){
		var postData = req.body.data;

		var errors = [];
		var required = [	
			{field: 'SERVICE_ID', message: 'Service required'},
			{field: 'day_of_Week', message: 'Day Of Week required'},
			{field: 'from_time', message: 'From Time required'},
			{field: 'to_time', message: 'To Time required'},
			{field: 'from_date', message: 'From Date required'},
			{field: 'to_date', message: 'To Date required'}
		]

		var time_error = [
			{field: 'from_time', message: 'From Time must be 00:00'},
			{field: 'to_time', message: 'To Time must be 00:00'}
		]



		_.forIn(postData, function(value, field){
			_.forEach(required, function(field_error){
				if(field_error.field === field && S(value).isEmpty()){
					errors.push(field_error);
					return;
				}
			})
			_.forEach(time_error, function(field_error){
				if(field_error.field === field && !commonFunction.checkTime(value)){
					errors.push(field_error);
					return;
				}
			})
		})

		/* FROM TIME, TO TIME NOT LARGER, SMALLER */
		if(postData.from_time && postData.to_time){
			var postFromTime = commonFunction.convertToSeconds(postData.from_time);
			var postToTime = commonFunction.convertToSeconds(postData.to_time);

			if(postFromTime > postToTime){
				errors.push({field: 'from_time', message: 'From Time must be smaller than To Time'});
				errors.push({field: 'to_time', message: 'To Time must be larger than From Time'});
			}
		}
		/* END FROM TIME, TO TIME NOT LARGER, SMALLER */

		/* FROM DATE, TO DATE NOT LARGER, SMALLER */
		if(postData.from_date && postData.to_date){
			if(!moment(postData.from_date).isBefore(moment(postData.to_date))){
				errors.push({field: 'from_date', message: 'From Date must be smaller than To Date'});
				errors.push({field: 'to_date', message: 'To Date must be larger than From Date'});
			}
		}
		/* END FROM DATE, TO DATE NOT LARGER, SMALLER */

		if(errors.length > 0){
			res.status(500).json({errors: errors});
			return;
		}	

		var sql = knex('sys_permernant_calendar_df')
				.insert(postData).toString();

		db.sequelize.query(sql)
		.success(function(inserted){
			res.json({data: inserted});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	postSiteList: function(req, res){
		var postData = req.body.data;

		var sql = knex
		.column(
			'sys_cal_sites_df.id',
			'cal_header_df_id',
			'week_ord_of_month',
			'site_id',
			'Site_name'
		)
		.select()
		.from('sys_cal_sites_df')
		.innerJoin('redimedsites', 'sys_cal_sites_df.site_id', 'redimedsites.id')
		.where({
			doctor_id: postData.doctor_id,
			isenable: 1
		})
		.orderBy('week_ord_of_month', 'asc')
		.toString();
		
		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	postList: function(req, res){
		var postData = req.body.data;

		var sql = knex
		.column(
			'cal_header_df_id',
			'doctor_id',
			'sys_permernant_calendar_df.service_id',
			'day_of_Week',
			'from_time',
			'to_time',
			'from_date',
			'to_date',
			'sys_permernant_calendar_df.isenable',
			'sys_permernant_calendar_df.Creation_date',
			'sys_services.SERVICE_NAME'
		)
		.select()
		.from('sys_permernant_calendar_df')
		.leftOuterJoin('sys_services', 'sys_permernant_calendar_df.SERVICE_ID', 'sys_services.SERVICE_ID')
		.where({
			'doctor_id': postData.doctor_id,
			'sys_services.Isenable': 1,
			'sys_permernant_calendar_df.isenable': 1
		})
		.orderBy('day_of_Week', 'asc')
		.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	}//end list
}