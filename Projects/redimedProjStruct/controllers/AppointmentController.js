var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var db = require('../models');
var S = require('string');
var moment = require('moment');
var _ = require('lodash');

module.exports = {
	postLeaveCal:function(req,res){
        var postData = req.body.data;
		var errors = [];
		var required = [	
			{field: 'from_date', message: 'From Date required'},
			{field: 'to_date', message: 'To Date required'}
		]
		_.forIn(postData, function(value, field){
			_.forEach(required, function(field_error){
				if(field_error.field === field && S(value).isEmpty()){
					errors.push(field_error);
					return;
				}
			})
		})
		var from_date = new Date(postData.from_date);
  		var to_date = new Date(postData.to_date);
  		if(postData.from_date && postData.to_date){
		   if(from_date > to_date)
		   {
				errors.push({field: 'from_date', message: 'From Date must be smaller than To Date'});
				errors.push({field: 'to_date', message: 'To Date must be larger than From Date'});
		   }
  		}

		if(errors.length > 0){
			res.status(500).json({errors: errors});
			return;
		}	
        var sql = knex('cln_appointment_calendar')
            .where('doctor_id', postData.doctor_id)
            .whereRaw('date(FROM_TIME) >= '+postData.from_date)
            .whereRaw('date(TO_TIME) <= '+postData.to_date)
            .del()
            .toString();
        db.sequelize.query(sql)
        .success(function(del){
            res.json({data: del ,sql:sql});
        })
        .error(function(error){
            res.json(500, {error: error});
        }) 
    	},
	/*postByDoctor: function(req, res){
		var postData = req.body.data;

		knex
		.column('FROM_TIME', 'TO_TIME')
		.select()
		.from('cln_appointment_calendar')
		.where({
			DOCTOR_ID: postData.doctor_id
		})
		.then(function(rows){
			if(!rows.length){
				commonFunction.commonError(null, 'ERR_SYS_006', res);
				return;
			}

			var data = {
				FROM_TIME: rows[0].FROM_TIME,
				TO_TIME: rows[rows.length-1].TO_TIME
			}
			res.json({data: data});
		})
		.catch(function(error){
			commonFunction.commonError(error, 'ERR_SYS_003', res);
		})
	},*/

	postAdd: function(req, res){
		var postData = req.body.data;

		var sql = knex('cln_appointment_calendar')
			.where('cln_appointment_calendar.CAL_ID', postData.form.CAL_ID)
			.update(postData.form)
			.toString();

		var sql_sub = knex('cln_appt_patients')
			.insert({
				Patient_id: postData.Patient_id,
				CAL_ID: postData.form.CAL_ID
			})
			.toString();

		db.sequelize.query(sql)
		.success(function(created){
			db.sequelize.query(sql_sub)
			.success(function(created){
				res.json({data: 'success'});
			}, function(error){
				res.status(500).json({error: error, sql: sub_sql});	
			})
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	postLoad: function(req, res){
		var postData = req.body.data;

		if(!postData.clinical_dept_id) postData.clinical_dept_id = '';

		var main_sql = knex
		.column(
			knex.raw("DATE_FORMAT(cln_appointment_calendar.FROM_TIME, '%H:%i') AS FROM_TIME"),
			knex.raw("DATE_FORMAT(cln_appointment_calendar.TO_TIME, '%H:%i') AS TO_TIME"),
			'cln_appointment_calendar.SERVICE_ID',
			'cln_appointment_calendar.DOCTOR_ID',
			'cln_appointment_calendar.CAL_ID',
			'cln_appointment_calendar.CLINICAL_DEPT_ID',
			'cln_appt_patients.Patient_id',
			'cln_patients.First_name',
			'cln_patients.Sur_name'
		)
		.leftOuterJoin('cln_appt_patients', 'cln_appointment_calendar.CAL_ID', 'cln_appt_patients.CAL_ID')
		.leftOuterJoin('cln_patients', 'cln_appt_patients.Patient_id', 'cln_patients.Patient_id')
		.from('cln_appointment_calendar')
		.where({
			'cln_appointment_calendar.SITE_ID': postData.site_id
		})
		.where('cln_appointment_calendar.FROM_TIME', 'like', '%'+postData.datepicker+'%')
		.where('cln_appointment_calendar.CLINICAL_DEPT_ID', 'like', '%'+postData.clinical_dept_id+'%')
		.orderBy('cln_appointment_calendar.FROM_TIME', 'asc')
		.toString();

		var sub_sql = knex
		.distinct(
			'cln_appointment_calendar.DOCTOR_ID',
			'doctors.NAME'
		)
		.select()
		.from('cln_appointment_calendar')
		.innerJoin('doctors', 'cln_appointment_calendar.DOCTOR_ID', 'doctors.doctor_id')
		.where({
			'cln_appointment_calendar.SITE_ID': postData.site_id
		})
		.where('cln_appointment_calendar.FROM_TIME', 'like', '%'+postData.datepicker+'%')
		.orderBy('cln_appointment_calendar.DOCTOR_ID', 'asc')
		.toString();

		var main_sub_sql = knex
		.column(
			knex.raw("DATE_FORMAT(cln_appointment_calendar.FROM_TIME, '%H:%i') AS FROM_TIME"),
			knex.raw("DATE_FORMAT(cln_appointment_calendar.TO_TIME, '%H:%i') AS TO_TIME"),
			'cln_appointment_calendar.SERVICE_ID',
			'cln_appointment_calendar.DOCTOR_ID',
			'cln_appointment_calendar.CAL_ID',
			'cln_appointment_calendar.CLINICAL_DEPT_ID'
		)
		.from('cln_appointment_calendar')
		.where({
			'cln_appointment_calendar.SITE_ID': postData.site_id
		})
		.where('cln_appointment_calendar.FROM_TIME', 'like', '%'+postData.datepicker+'%')
		.where('cln_appointment_calendar.CLINICAL_DEPT_ID', 'like', '%'+postData.clinical_dept_id+'%')
		.orderBy('cln_appointment_calendar.FROM_TIME', 'asc')
		.toString();

		db.sequelize.query(main_sql)
		.success(function(rows){
			db.sequelize.query(sub_sql)
			.success(function(doctors){
				db.sequelize.query(main_sub_sql)
				.success(function(subdata){
					res.json({data: rows, doctors: doctors, subdata: subdata});
				})
				.error(function(error){
					res.status(500).json({error: error, sql: main_sub_sql});
				})
			})
			.error(function(error){
				res.status(500).json({error: error, sql: sub_sql});	
			})
		})
		.error(function(error){
			res.status(500).json({error: error, sql: main_sql});
		})

	}
}