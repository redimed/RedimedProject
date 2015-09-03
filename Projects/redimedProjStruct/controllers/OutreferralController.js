var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var S = require('string');
var db = require('../models');
var _ = require('lodash');
var moment = require('moment');

module.exports = {
	postCheckPatientCalendar: function(req, res){
		var postData = req.body.data;

		var sql = knex('cln_patient_outreferral')
				.count('id as count')
				.innerJoin('cln_appointment_calendar', 'cln_patient_outreferral.CAL_ID', 'cln_appointment_calendar.CAL_ID')
				.innerJoin('sys_services', 'cln_appointment_calendar.SERVICE_ID', 'sys_services.SERVICE_ID')
				.where({
					'cln_patient_outreferral.patient_id': postData.patient_id,
					'cln_patient_outreferral.CAL_ID': postData.CAL_ID
				})
				.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			var service_sql = knex('cln_appointment_calendar')
							.select('sys_services.*')
							.innerJoin('sys_services', 'cln_appointment_calendar.SERVICE_ID', 'sys_services.SERVICE_ID')
							.where({
								'cln_appointment_calendar.CAL_ID': postData.CAL_ID
							})
							.toString();

			db.sequelize.query(service_sql)
			.success(function(services){
				if (services.length == 0) {
					res.json({data: -1, service: -1});
				}else{
					res.json({data: rows[0].count, service: services[0]});
				}
				
			})
			.error(function(error){
				res.json(500, {error: error});	
			})
		})
		.error(function(error){
			res.json(500, {error: error});	
		})
	},
	/*
	postEdit:Update a specific outreferral 
	Input Params :outreferral id
	OutPut Params : status success or error
	*/
	postEdit: function(req, res){
		var postData = req.body.data;

		var errors = [];
		var required = [
			{field: 'date_issued', message: 'Date Issued required'},
			{field: 'date_started', message: 'Date Started required'},
			{field: 'duration', message: 'Duration required'},
			{field: 'expire_date', message: 'Expire Date required'},
			{field: 'referred_to_doctor', message: 'Referred To Doctor required'},
			{field: 'doctor_id', message: 'Outside Doctor is required'}
		];
		/*Validate input request */
		_.forIn(postData, function(value, field){
			_.forEach(required, function(field_error){
				if(field_error.field === field && S(value).isEmpty()){
					errors.push(field_error);
					return;
				}
			})
		})


		if(moment(postData.expire_date).isBefore(postData.date_started)){
			errors.push({field: 'date_started', message: 'Date Started must before Date Expire'});
		}
		/*Validate duration is number */
		if(postData.duration % 1 !== 0){
			errors.push({field: 'duration', message: 'Duration must be number'});
		}

		if(errors.length > 0){
			res.status(500).json({errors: errors});
			return;
		}

		// update outside referrel  
		var sql = knex('outside_referrals')
				.where('id', postData.id)
				.update(postData)
				.toString();

		db.sequelize.query(sql)
		.success(function(created){
			res.json({data: created,status:'success'});
		})
		.error(function(error){
			res.json(500, {error: error});	
		})
	},
	/*
	getOutReferralByid:Get one Outreferral by id
	Input Params : Id of OutReferral
	Output Params : status success and data or status error
	*/
	getOutReferralByid: function(req, res){
		var postData = req.body.data;

		var sql = knex('outside_referrals')
			.column(
				'outside_referrals.*',
				'outside_doctors.name AS outdoctor_name',
				'doctors.NAME AS doctor_name'
			)
			.innerJoin('outside_doctors', 'outside_referrals.doctor_id', 'outside_doctors.doctor_id')
			.innerJoin('doctors', 'outside_referrals.referred_to_doctor', 'doctors.doctor_id')
			.where('id', postData.id)
			.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows[0],status:'success'});
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},
	/*
	postRemove:Remove one outside referrals  in table outside_referrals by id
	Input Params : id of outside_referrals
	output Params : status success or error
	*/
	postRemove: function(req, res){
		var postData = req.body.data;

		var sql = knex('outside_referrals')
			.where('id', postData.id)
			.del()
			.toString();

		db.sequelize.query(sql)
		.success(function(del){
			res.json({data: del,status:'success'});
		})
		.error(function(error){
			res.json(500, {error: error,status:'error'});
		})
	},
	/*
	postAddOutSideReferral:Create new  Outside_referral
	Input Params : date_issued,date_started,duration,expire_date,referred_to_doctor,doctor_id
	Output Params : status success and data or status error
	*/
	postAddOutSideReferral: function(req, res){
		var postData = req.body.data;//input data
		var errors = [];
		var required = [
			{field: 'date_issued', message: 'Date Issued required'},
			{field: 'date_started', message: 'Date Started required'},
			{field: 'duration', message: 'Duration required'},
			{field: 'expire_date', message: 'Expire Date required'},
			{field: 'referred_to_doctor', message: 'Referred To Doctor required'},
			{field: 'doctor_id', message: 'Outside Doctor is required'}
		];
		/*Validate unput required*/
		_.forIn(postData, function(value, field){
			_.forEach(required, function(field_error){
				if(field_error.field === field && S(value).isEmpty()){
					errors.push(field_error);
					return;
				}
			})
		})
		/*Validate Date_Expire > date_started*/
		if(moment(postData.expire_date).isBefore(postData.date_started)){
			errors.push({field: 'date_started', message: 'Date Started must before Date Expire'});
		}
		/*Validate duration is integer number */
		if(postData.duration % 1 !== 0){
			errors.push({field: 'duration', message: 'Duration must be integer number'});
		}

		if(errors.length > 0){
			res.status(500).json({errors: errors});
			return;
		}
		//create new outsider referral with input data
		var sql = knex('outside_referrals')
				.insert({
					Creation_date:postData.Creation_date, 
					Last_update_date:postData.Last_update_date,
					created_by:postData.created_by, 
					date_issued:postData.date_issued, 
					date_started:postData.date_started, 
					doctor_id: postData.doctor_id, 
					duration: postData.duration, 
					expire_date: postData.expire_date, 
					last_updated_by: postData.last_updated_by, 
					patient_id: postData.patient_id, 
					referred_to_doctor:postData.referred_to_doctor
				})
				.toString();
		db.sequelize.query(sql)
		.success(function(created){
			// reference new created outside referal to patient
			var sql1 =
                     knex('outside_referrals')
                     .max('id as id')
                     .toString()
                     db.sequelize.query(sql1)
                     .success(function(data1){

                     	var sql2 = 
                 				knex('cln_patient_outreferral')
                 				.insert({
                 					patient_id:postData.patient_id,
                 					CAL_ID : postData.CAL_ID,
                 					outreferral_id:data1[0].id,
                 					isEnable:1
                 				})
                 				.toString()
                 				db.sequelize.query(sql2)
                 				.success(function(data2){
                 					res.json({data: data2});	
                 				})
                 				.error(function(error){
									res.json(500, {error: error});	
								})
                     })
                     .error(function(error){
					res.json(500, {error: error,sql:sql1});	
				})
		})
		.error(function(error){
			res.json(500, {error: error,sql:sql});	
		})
	},
	/*
	postAddPatientOutReferral:create new cln_patient_outreferral
    input params : patient_id,CAL_ID,outreferral_id ,Default : isEnable = 1
    output Params : status sucees or error
    */
	postAddPatientOutReferral: function(req, res){
		var postData = req.body.data;

		var sql = knex('cln_patient_outreferral')
				.insert(postData)
				.toString();

		db.sequelize.query(sql)
		.success(function(created){
			res.json({data: created});
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	postAdd: function(req, res){
		var postData = req.body.data;
		var CAL_ID = postData.CAL_ID;

		delete postData.CAL_ID;

		var errors = [];
		var required = [
			{field: 'Claim_no', message: 'Claim No required'},
			{field: 'Claim_date', message: 'Claim Date required'},
			{field: 'Injury_name', message: 'Injury Name required'},
			{field: 'Injury_date', message: 'Injury Date required'},
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

		var sql = knex('cln_claims')
			.insert(postData)
			.toString();

		var last_id_sql = knex('cln_claims')
			.max('Claim_id as id')
			.toString();

		db.sequelize.query(sql)
		.success(function(created){
			db.sequelize.query(last_id_sql)
			.success(function(rows){
				var insert_sub = {Claim_id: rows[0].id, Patient_id: postData.Patient_id, CAL_ID: CAL_ID};
				var sub_sql = knex('cln_patient_claim')
					.insert(insert_sub)
					.toString();

				db.sequelize.query(sub_sql)
				.success(function(created_sub){
					res.json({data: created_sub});
				})
				.error(function(error){
					res.json(500, {error: error});
				})
			})
			.error(function(error){
				res.json(500, {error: error});
			})	
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},
	/*
	postListNoFollowPatient:Get list outside_referral 
	Input Params: offset,limit
	Out Params:status success and data or status error
	*/
	postListNoFollowPatient: function(req, res){
		var postData = req.body.data;
		/*select data*/
		var sql = knex
				.distinct(
					'outside_referrals.id',
					'outside_referrals.date_issued',
					'outside_referrals.date_started',
					'outside_referrals.patient_id',
					'outside_referrals.expire_date',
					'outside_referrals.doctor_id',
					'outside_referrals.referred_to_doctor',
					'outside_doctors.name AS outdoctor_name',
					'doctors.NAME AS doctor_name'
				)
				.from('outside_referrals')
				.innerJoin('outside_doctors', 'outside_referrals.doctor_id', 'outside_doctors.doctor_id')
				.innerJoin('doctors', 'outside_referrals.referred_to_doctor', 'doctors.doctor_id')
				.innerJoin('cln_patient_outreferral','cln_patient_outreferral.outreferral_id','outside_referrals.id')
				.limit(postData.limit)
				.offset(postData.offset)
				.orderBy('outside_referrals.expire_date', 'desc')
				.toString();
		/*count row select*/
		var count_sql = knex('outside_referrals')
				.innerJoin('outside_doctors', 'outside_referrals.doctor_id', 'outside_doctors.doctor_id')
				.innerJoin('doctors', 'outside_referrals.referred_to_doctor', 'doctors.doctor_id')
				.innerJoin('cln_patient_outreferral','cln_patient_outreferral.outreferral_id','outside_referrals.id')
				.count('outside_referrals.id as a')
				.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			db.sequelize.query(count_sql)
			.success(function(count){
				res.json({data: rows, count: count[0].a});
			})
			.error(function(error){
				res.json(500, {error: error});	
			})
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},
	/*
	postListFollowPatient:Get list outside_referral by patient_id
	Input Params: offset,limit,patient_id
	Out Params:status success and data or status error
	*/
	postListFollowPatient: function(req, res){
		var postData = req.body.data;
		/*select data*/
		var sql = knex
				.distinct(
					'outside_referrals.id',
					'outside_referrals.date_issued',
					'outside_referrals.date_started',
					'outside_referrals.patient_id',
					'outside_referrals.expire_date',
					'outside_referrals.doctor_id',
					'outside_referrals.referred_to_doctor',
					'outside_doctors.name AS outdoctor_name',
					'doctors.NAME AS doctor_name',
					'cln_patient_outreferral.isEnable'
				)
				.from('outside_referrals')
				.innerJoin('outside_doctors', 'outside_referrals.doctor_id', 'outside_doctors.doctor_id')
				.innerJoin('doctors', 'outside_referrals.referred_to_doctor', 'doctors.doctor_id')
				.innerJoin('cln_patient_outreferral','cln_patient_outreferral.outreferral_id','outside_referrals.id')
				.where('outside_referrals.patient_id', postData.patient_id)
				.limit(postData.limit)
				.offset(postData.offset)
				.orderBy('outside_referrals.expire_date', 'desc')
				.toString();
		/*count row select*/
		var count_sql = knex('outside_referrals')
				.innerJoin('outside_doctors', 'outside_referrals.doctor_id', 'outside_doctors.doctor_id')
				.innerJoin('doctors', 'outside_referrals.referred_to_doctor', 'doctors.doctor_id')
				.count('outside_referrals.id as a')
				.where('outside_referrals.patient_id', postData.patient_id)
				.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			db.sequelize.query(count_sql)
			.success(function(count){
				res.json({data: rows, count: count[0].a});
			})
			.error(function(error){
				res.json(500, {error: error});	
			})
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},
	/*
	postCheckReferral:check calendar exits
	Input Params: CAL_ID
	Out Params:status success and data or status error
	*/
	postCheckReferral: function(req, res){
		var postData = req.body.data;

		var sql = knex('cln_patient_outreferral')
					.where('CAL_ID', postData.CAL_ID)
					.toString();

		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data});
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},
	/*
	postUpdateEnable:upate IsEnable in table cln_patient_outreferral
	Input Params: outreferral_id,patient_id,CAL_ID
	Out Params:status success and data or status error
	*/
	postUpdateEnable : function(req,res){
		var postData = req.body.data;
		if (postData.isEnable != 1){
			postData.isEnable = 1;
		}
		else{
			postData.isEnable = 0;
		}
		var sql = knex('cln_patient_outreferral')
				.update({
					isEnable: postData.isEnable
				})
                .where('outreferral_id',postData.outreferral_id)
                .where('patient_id',postData.patient_id)
                .where('CAL_ID',postData.CAL_ID)
				.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data,status:'success'});
		})
		.error(function(error){
			res.json(500, {error: error});	
		})
	},
	/*
	postDotorFromUserId:select doctor from table doctors by user_id
	Input Params: user_id
	Out Params:status success and data or status error
	*/
	postDotorFromUserId : function(req,res){
		var postData = req.body.data;
		var sql = knex()
				.select('*')
				.from('doctors')
				.where('user_id',postData)
				.toString();

		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data,sql:sql});
		})
		.error(function(error){
			res.json(500, {error: error,sql: sql});
		})
	},
	/*
	postDotorFromDoctorId:select doctor from table doctors by doctor_id
	Input Params: doctor_id
	Out Params:status success and data or status error
	*/
	postDotorFromDoctorId : function(req,res){
		var postData = req.body.data;
		var sql = knex()
				.select('*')
				.from('doctors')
				.where('doctor_id',postData)
				.toString();

		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data,sql:sql});
		})
		.error(function(error){
			res.json(500, {error: error,sql: sql});
		})
	}
}