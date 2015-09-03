var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var db = require('../models');
var S = require('string');
var moment = require('moment');
var _ = require('lodash');
var kiss=require('./kissUtilsController');
var timeTableUtil=require('./timeTableUtilController');

var errorCode=require('./errorCode');//tan add
var controllerCode="RED_APPOINTMENT";//tan add

module.exports = {
	/* Description: Check appointment next to old appoinment
	* Input Params: cal_id, patient_id
	* Output Params: return error or success message
	*/
	checkNextAppointment: function(req,res){
		var postData  = req.body.data;
		console.log(postData);
		var sql = knex('cln_patient_consults')
				.where('cal_id',postData.cal_id)
				.where('patient_id',postData.patient_id)
				.update({
					'next_appt_date':null,
					'next_appt_note':null
				})
				.toString();
		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows,sql:sql});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},
	alertCenterPatient : function(req,res){
		var fHeader="v2_InvoiceController->alertCenterPatient";
		var functionCode='FN020';
		var sql=
			"SELECT `cln_appt_patients`.* ,`cln_patients`.`First_name`,`cln_patients`.`Sur_name`,`cln_patient_consults`.`next_appt_date`, "+
			"`cln_patient_consults`.`next_appt_note`                                                                                      "+
			"FROM `cln_appt_patients`                                                                                                     "+
			"INNER JOIN `cln_patient_consults` ON `cln_appt_patients`.`CAL_ID` = `cln_patient_consults`.`cal_id`                          "+
			"AND `cln_appt_patients`.`Patient_id` = `cln_patient_consults`.`patient_id`                                                   "+
			"AND `cln_patient_consults`.`next_appt_date` IS NOT NULL                                                                      "+
			"INNER JOIN `cln_patients` ON `cln_appt_patients`.`Patient_id` = `cln_patients`.`Patient_id`                                  "+
			"WHERE `cln_appt_patients`.`appt_status` = 'Completed'                                                                        ";
		kiss.executeQuery(req,sql,null,function(rows){
			res.json({status:'success',data:rows});
		},function(err){
			kiss.exlog(fHeader,'Loi truy van lay thong tin thong qua',err);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'DM001')});
		});

	},
	changeStatus:function(req,res){
		var postData  = req.body.data;

		/*
		Intend SQL:
		Get data of cln_appointment_calendar
		Input: CAL_ID, STATUS
		*/
		var sql = knex('cln_appointment_calendar')
				.where('CAL_ID',postData.CAL_ID)
				.update({'STATUS':postData.STATUS})
				.toString();
		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},
	/*
	* Description: Change Service Appointment Calendar
	* Input Params: SERVICE_ID
	* Output Params: return error or success message
	*/
	changeService:function(req,res){
		var postData  = req.body.data;
		kiss.executeInsertIfDupKeyUpdate(req,'cln_appointment_calendar',postData,['SERVICE_ID'],function(result){
			res.json({data: result});
		},function(err){
			res.status(500).json({error: err});
		});
	},

	/*
	* Description: Get list of patients by appointment slot
	* Input Params: CAL_ID
	* Output Params: return error or success message
	*/
	getOneApptPatient:function(req,res){
		var postData  = req.body.data;
		var sql = knex('cln_appt_patients')
				.where('CAL_ID',postData.CAL_ID)
				.toString();
		db.sequelize.query(sql)
		.success(function(rows){
			if (rows.length !== 0) {
				res.json({data: rows[0]});
			}else{
				res.json({data: -1});
			};
			
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	/* Description: Get list of service and attribute color
	* Input Params: No
	* Output Params: return error or success message
	*/
	getServiceColor:function(req,res){
		var postData = req.body.data;
		var sql = knex('sys_services')
			// .where('IS_BOOKABLE',1)
			.where('Isenable',1)
			.toString();

		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},
	postOne: function(req, res){
		var postData = req.body.data;

		var sql = knex('cln_appointment_calendar')
			.where('CAL_ID', postData.CAL_ID)
			.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows[0]});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	/*
	* DESCRIPTION: List Alert List of Appointment Slots to display on Calendar by site_id
	* INPUT: site_id, datepicker
	* OUTPUT: return error or success
	*/
	alertSiteCenter: function(req, res){
		var postData = req.body.data;

		if(!postData.clinical_dept_id) postData.clinical_dept_id = '';

		var main_sql = knex
		.distinct(
			knex.raw("DATE_FORMAT(cln_appointment_calendar.FROM_TIME, '%H:%i') AS FROM_TIME"),
			knex.raw("DATE_FORMAT(cln_appointment_calendar.TO_TIME, '%H:%i') AS TO_TIME"),
			'cln_appointment_calendar.SERVICE_ID',
			'sys_services.SERVICE_NAME',
			'sys_services.IS_REFERRAL',
			'sys_services.SERVICE_COLOR',
			'cln_appointment_calendar.DOCTOR_ID',
			'cln_appointment_calendar.CAL_ID',
			'cln_appointment_calendar.CLINICAL_DEPT_ID',
			'cln_appt_patients.Patient_id',
			'cln_patients.First_name',
			'cln_patients.Sur_name',
			'cln_alerts.id AS ALERT_ID',
			'cln_alerts.name AS ALERT_NAME',
			'cln_patient_outreferral.outreferral_id'
		)
		.innerJoin('cln_appt_patients', 'cln_appointment_calendar.CAL_ID', 'cln_appt_patients.CAL_ID')
		.innerJoin('cln_patients', 'cln_appt_patients.Patient_id', 'cln_patients.Patient_id')
		.innerJoin('sys_services', 'cln_appointment_calendar.SERVICE_ID', 'sys_services.SERVICE_ID')
		.leftOuterJoin('cln_patient_alerts', function(){
			this.on('cln_appt_patients.Patient_id', 'cln_patient_alerts.patient_id')
		})
		.leftOuterJoin('cln_alerts', 'cln_patient_alerts.alert_id', 'cln_alerts.id')
		.leftOuterJoin('cln_patient_outreferral', function(){
			this.on('cln_patient_outreferral.CAL_ID', '=', 'cln_appointment_calendar.CAL_ID')
			.andOn('cln_appt_patients.Patient_id', 'cln_patient_outreferral.patient_id')
		})
		.from('cln_appointment_calendar')
		.where({
			'cln_appointment_calendar.SITE_ID': postData.site_id
		})
		.where('cln_appointment_calendar.FROM_TIME', 'like', '%'+postData.datepicker+'%')
		.toString();

		db.sequelize.query(main_sql)
		.success(function(rows){
			res.json({data: rows,sql:main_sql});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: main_sql});
		})
	},

	/*
	* Description: List Alert List For Appointment
	* Input: site_id, datepicker, clinical_dept_id
	* Output: success -> main alert list for appointment, error -> Error Code of MySQL
	*/
	alertCenter: function(req, res){
		var postData = req.body.data;

		if(!postData.clinical_dept_id) postData.clinical_dept_id = '';

		var main_sql = knex
		.distinct(
			knex.raw("DATE_FORMAT(cln_appointment_calendar.FROM_TIME, '%H:%i') AS FROM_TIME"),
			knex.raw("DATE_FORMAT(cln_appointment_calendar.TO_TIME, '%H:%i') AS TO_TIME"),
			'cln_appointment_calendar.SERVICE_ID',
			'sys_services.SERVICE_NAME',
			'sys_services.IS_REFERRAL',
			'sys_services.SERVICE_COLOR',
			'cln_appointment_calendar.DOCTOR_ID',
			'cln_appointment_calendar.CAL_ID',
			'cln_appointment_calendar.CLINICAL_DEPT_ID',
			'cln_appt_patients.Patient_id',
			'cln_patients.First_name',
			'cln_patients.Sur_name',
			'cln_patient_alerts.id as ID',
			'cln_patient_alerts.patient_id as Patients_id',
			'cln_patient_alerts.isCheck as Check',
			'cln_patient_alerts.isUser as isUser',
			'cln_alerts.id AS ALERT_ID',
			'users.user_name as User',
			'cln_alerts.name AS ALERT_NAME',
			'cln_alerts.SERVICE_COLOR as SERVICE_COLOR',
			'cln_patient_outreferral.outreferral_id'
		)
		.innerJoin('cln_appt_patients', 'cln_appointment_calendar.CAL_ID', 'cln_appt_patients.CAL_ID')
		.innerJoin('cln_patients', 'cln_appt_patients.Patient_id', 'cln_patients.Patient_id')
		.innerJoin('sys_services', 'cln_appointment_calendar.SERVICE_ID', 'sys_services.SERVICE_ID')
		.leftOuterJoin('cln_patient_alerts', function(){
			this.on('cln_appt_patients.Patient_id', 'cln_patient_alerts.patient_id')
		})
		.leftOuterJoin('cln_alerts', 'cln_patient_alerts.alert_id', 'cln_alerts.id')
		.leftOuterJoin('cln_patient_outreferral', function(){
			this.on('cln_patient_outreferral.CAL_ID', '=', 'cln_appointment_calendar.CAL_ID')
			.andOn('cln_appt_patients.Patient_id', 'cln_patient_outreferral.patient_id')
		})
		.leftOuterJoin('users', 'cln_patient_alerts.isUser', 'users.id')
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
			res.json({data: rows,sql:main_sql});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: main_sql});
		})
	},
	alertCenterConsultation: function(req, res){
		var postData = req.body.data;

		if(!postData.clinical_dept_id) postData.clinical_dept_id = '';

		var main_sql = knex
		.distinct(
			knex.raw("DATE_FORMAT(cln_appointment_calendar.FROM_TIME, '%H:%i') AS FROM_TIME"),
			knex.raw("DATE_FORMAT(cln_appointment_calendar.TO_TIME, '%H:%i') AS TO_TIME"),
			'cln_appointment_calendar.SERVICE_ID',
			'sys_services.SERVICE_NAME',
			'sys_services.IS_REFERRAL',
			'sys_services.SERVICE_COLOR',
			'cln_appointment_calendar.DOCTOR_ID',
			'cln_appointment_calendar.CAL_ID',
			'cln_appointment_calendar.CLINICAL_DEPT_ID',
			'cln_appt_patients.Patient_id',
			'cln_patients.First_name',
			'cln_patients.Sur_name',
			'cln_patient_alerts.id as ID',
			'cln_patient_alerts.patient_id as Patients_id',
			'cln_patient_alerts.isCheck as Check',
			'cln_patient_alerts.isUser as isUser',
			'cln_alerts.id AS ALERT_ID',
			'users.user_name as User',
			'cln_alerts.name AS ALERT_NAME',
			'cln_alerts.SERVICE_COLOR as SERVICE_COLOR',
			'cln_patient_outreferral.outreferral_id'
		)
		.innerJoin('cln_appt_patients', 'cln_appointment_calendar.CAL_ID', 'cln_appt_patients.CAL_ID')
		.innerJoin('cln_patients', 'cln_appt_patients.Patient_id', 'cln_patients.Patient_id')
		.innerJoin('sys_services', 'cln_appointment_calendar.SERVICE_ID', 'sys_services.SERVICE_ID')
		// .innerJoin('sys_services',function(){
		// 	this.on('cln_appointment_calendar.SERVICE_ID', '=', 'sys_services.SERVICE_ID')
		// 	.andOn('sys_services.IS_REFERRAL', 1)
		// })
		.leftOuterJoin('cln_patient_alerts', function(){
			this.on('cln_appt_patients.Patient_id', 'cln_patient_alerts.patient_id')
			// .andOn('cln_patient_alerts.cal_id','cln_appointment_calendar.CAL_ID')
		})
		.leftOuterJoin('cln_alerts', 'cln_patient_alerts.alert_id', 'cln_alerts.id')
		.leftOuterJoin('cln_patient_outreferral', function(){
			this.on('cln_patient_outreferral.CAL_ID', '=', 'cln_appointment_calendar.CAL_ID')
			.andOn('cln_appt_patients.Patient_id', 'cln_patient_outreferral.patient_id')
		})
		.leftOuterJoin('users', 'cln_patient_alerts.isUser', 'users.id')
		.from('cln_appointment_calendar')
		.where('cln_appointment_calendar.FROM_TIME', 'like', '%'+postData.fromDate+'%')
		.where({'cln_patient_alerts.patient_id': postData.patient_id})
		.orderBy('cln_appointment_calendar.FROM_TIME', 'asc')
		.toString();

		db.sequelize.query(main_sql)
		.success(function(rows){
			res.json({data: rows,sql:main_sql});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: main_sql});
		})
	},

	/**
	 * Kiem tra xem trong khoang fromDate den toDate co calendar nao da duoc booking hay chua
	 * tannv.dts@gmail.com
	 */
	beforePostLeaveCal:function(req,res)
	{
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
		   if(moment(to_date).diff(moment(from_date),'days')<0)
		   {
				errors.push({field: 'from_date', message: 'From Date must be smaller than or equal To Date'});
				errors.push({field: 'to_date', message: 'To Date must be larger than or equal From Date'});
		   }
  		}

		if(errors.length > 0){
			res.status(500).json({errors: errors});
			return;
		}	

		//tan add and modify
		if(!kiss.checkListData(postData.doctor_id))
		{
			kiss.exlog("postLeaveCal","Loi data truyen den");
			res.status(500).json({status: kiss.status.fail});
			return;
		}

		var day_of_Week=kiss.checkData(postData.day_of_Week)?
			timeTableUtil.sqlDayOfWeek[timeTableUtil.dayOfWeekValue[postData.day_of_Week]]:'%';
		var sql=
			" SELECT calendar.*,CONCAT(patient.`First_name`,' ',patient.`Sur_name`) AS PATIENT_FULL_NAME,   "+
			" service.`SERVICE_NAME`                                                                        "+
			" FROM `cln_appointment_calendar` calendar                                                      "+
			" INNER JOIN `cln_appt_patients` appt ON calendar.`CAL_ID`=appt.`CAL_ID`                        "+
			" INNER JOIN `cln_patients` patient ON appt.`Patient_id`=patient.`Patient_id`                   "+
			" INNER JOIN `sys_services` service ON calendar.`SERVICE_ID`=service.`SERVICE_ID`               "+
			" WHERE DATE(`FROM_TIME`)>=? AND DATE(`FROM_TIME`)<=?                                           "+
			" AND DAYOFWEEK(`FROM_TIME`) LIKE ?	                                                            "+
			" AND `DOCTOR_ID`=?                                                                             ";

		kiss.executeQuery(req,sql,[moment(from_date).format("YYYY/MM/DD"),moment(to_date).format("YYYY/MM/DD"),day_of_Week,postData.doctor_id],function(rows){
			res.json({status:kiss.status.success,data:rows});
		},function(err){
			kiss.exlog("postLeaveCal","Loi truy van xoa",err);
			res.status(500).json({status:kiss.status.fail});
		},true);
	},

	/**
	 * Leave appointment calendar : xoa calendar tu ngay den ngay
	 * modify by tannv.dts@gmail.com
	 */
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
		   if(moment(to_date).diff(moment(from_date),'days')<0)
		   {
				errors.push({field: 'from_date', message: 'From Date must be smaller than or equal To Date'});
				errors.push({field: 'to_date', message: 'To Date must be larger than or equal From Date'});
		   }
  		}

		if(errors.length > 0){
			res.status(500).json({errors: errors});
			return;
		}	

		//tan add and modify
		if(!kiss.checkListData(postData.doctor_id))
		{
			kiss.exlog("postLeaveCal","Loi data truyen den");
			res.status(500).json({status: kiss.status.fail});
			return;
		}

		var day_of_Week=kiss.checkData(postData.day_of_Week)?
			timeTableUtil.sqlDayOfWeek[timeTableUtil.dayOfWeekValue[postData.day_of_Week]]:'%';
		var sql=
			" DELETE FROM `cln_appointment_calendar`                 "+
			" WHERE DATE(`FROM_TIME`)>=? AND DATE(`FROM_TIME`)<=?    "+
			" AND DAYOFWEEK(`FROM_TIME`) LIKE ?	                     "+
			" AND `DOCTOR_ID`=?                                      ";                                                                     

		kiss.executeQuery(req,sql,[moment(from_date).format("YYYY/MM/DD"),moment(to_date).format("YYYY/MM/DD"),day_of_Week,postData.doctor_id],function(result){
			res.json({status:kiss.status.success});
		},function(err){
			kiss.exlog("postLeaveCal","Loi truy van xoa",err);
			res.status(500).json({status:kiss.status.fail});
		});
    },

    /*
    * Description: Add Patient Information with Appointment Information into Appointment Calendar
    * Input Params: CAL_ID, Patient_id
    * Output Params: success: return success message, error: return sql code error information
    */
	postAdd: function(req, res){
		var postData = req.body.data;

		var sql = knex('cln_appointment_calendar')
			.where('cln_appointment_calendar.CAL_ID', postData.form.CAL_ID)
			.update(postData.form)
			.toString();

		var sql_sub = knex('cln_appt_patients')
			.insert({
				Patient_id: postData.Patient_id,
				CAL_ID: postData.form.CAL_ID,
				PHONE:postData.form.PHONE,
				APP_TYPE:postData.form.APP_TYPE,
				STATUS:postData.form.STATUS,
				AVAILABLE:postData.form.AVAILABLE,
				ARR_TIME:postData.form.ARR_TIME,
				ATTEND_TIME:postData.form.ATTEND_TIME,
				bill_to:postData.form.bill_to,
				ACC_TYPE:postData.form.ACC_TYPE,
				SERVICE_ID:postData.form.SERVICE_ID,
				NOTES:postData.form.NOTES,
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

	/*
	* Description: List Doctor Detail Appointment
	* Input Params: clinical_dept_id, site_id, doctor_id, datepicker
	* Output Params: Output: success -> main alert list for appointment, error -> Error Code of MySQL
	*/
	postDetailLoad: function(req, res){
		var postData = req.body.data;

		if(!postData.clinical_dept_id) postData.clinical_dept_id = '';
		
		/*
		* TABLE JOIN: cln_appt_patients, doctors, cln_patients, sys_services, cln_patient_outreferral
		* Input SQL: site_id, doctor_id, datepicker, clinical_dept_id
		*/
		var main_sql = knex
		.distinct(
			knex.raw("DATE_FORMAT(cln_appointment_calendar.FROM_TIME, '%H:%i') AS FROM_TIME"),
			knex.raw("DATE_FORMAT(cln_appointment_calendar.TO_TIME, '%H:%i') AS TO_TIME"),
			'cln_appointment_calendar.SERVICE_ID',
			'cln_appointment_calendar.STATUS',
			'sys_services.SERVICE_NAME',
			'sys_services.IS_REFERRAL',
			'sys_services.IS_BOOKABLE',
			'sys_services.SERVICE_COLOR',
			'cln_appointment_calendar.DOCTOR_ID',
			'cln_appointment_calendar.CAL_ID',
			'cln_appointment_calendar.CLINICAL_DEPT_ID',
			'cln_appt_patients.Patient_id',
			'cln_patients.First_name',
			'cln_patients.Sur_name',
			'cln_patient_outreferral.patient_id AS outreferral',
			'doctors.Appt_interval'
		)
		.leftOuterJoin('cln_appt_patients', 'cln_appointment_calendar.CAL_ID', 'cln_appt_patients.CAL_ID')
		.leftOuterJoin('doctors', 'cln_appointment_calendar.DOCTOR_ID', 'doctors.doctor_id')
		.leftOuterJoin('cln_patients', 'cln_appt_patients.Patient_id', 'cln_patients.Patient_id')
		.leftOuterJoin('sys_services', 'cln_appointment_calendar.SERVICE_ID', 'sys_services.SERVICE_ID')
		.leftOuterJoin('cln_patient_outreferral', 'cln_appt_patients.Patient_id', 'cln_patient_outreferral.patient_id')
		.from('cln_appointment_calendar')
		.where({
			'cln_appointment_calendar.SITE_ID': postData.site_id,
			'cln_appointment_calendar.DOCTOR_ID': postData.doctor_id
		})
		.where('cln_appointment_calendar.FROM_TIME', 'like', '%'+postData.datepicker+'%')
		.where('cln_appointment_calendar.CLINICAL_DEPT_ID', 'like', '%'+postData.clinical_dept_id+'%')
		.orderBy('cln_appointment_calendar.FROM_TIME', 'asc')
		.toString();

		/*
		* TABLE: cln_appointment_calendar
		*/
		var sub_sql = knex
		.distinct(
			'cln_appointment_calendar.DOCTOR_ID',
			'doctors.NAME',
			'doctors.Appt_interval'
		)
		.select()
		.from('cln_appointment_calendar')
		.innerJoin('doctors', 'cln_appointment_calendar.DOCTOR_ID', 'doctors.doctor_id')
		.where({
			'cln_appointment_calendar.SITE_ID': postData.site_id
		})
		.where('cln_appointment_calendar.FROM_TIME', 'like', '%'+postData.datepicker+'%')
		.where('cln_appointment_calendar.CLINICAL_DEPT_ID', 'like', '%'+postData.clinical_dept_id+'%')
		.orderBy('cln_appointment_calendar.DOCTOR_ID', 'asc')
		.toString();

		db.sequelize.query(main_sql)
		.success(function(rows){
			db.sequelize.query(sub_sql)
			.success(function(doctors){
				res.json({data: rows, doctors: doctors});
			})
			.error(function(error){
				res.status(500).json({error: error, sql: sub_sql});
			})	
		})
		.error(function(error){
			res.status(500).json({error: error, sql: main_sql});
		})
	},

	/*
	* Display Main Appointment List
	* input: clinical_dept_id, datepicker, site_id
	* output: main appointment list
	*/
	postLoad: function(req, res){
		var postData = req.body.data;

		if(!postData.clinical_dept_id) postData.clinical_dept_id = '';

		/*
		* JOIN
		* cln_appointment_calendar
		* sys_services
		* cln_patients
		* cln_appt_patients
		* doctors
		* cln_patient_outreferral
		*/
		var main_sql = knex
		.distinct(
			knex.raw("DATE_FORMAT(cln_appointment_calendar.FROM_TIME, '%H:%i') AS FROM_TIME"),
			knex.raw("DATE_FORMAT(cln_appointment_calendar.TO_TIME, '%H:%i') AS TO_TIME"),
			'cln_appointment_calendar.SERVICE_ID',
			'sys_services.SERVICE_NAME',
			'sys_services.IS_REFERRAL',
			'sys_services.SERVICE_COLOR',
			'sys_services.IS_BOOKABLE',
			'cln_appointment_calendar.DOCTOR_ID',
			'cln_appointment_calendar.CAL_ID',
			'cln_appointment_calendar.CLINICAL_DEPT_ID',
			'cln_appt_patients.Patient_id',
			'cln_patients.First_name',
			'cln_patients.Sur_name',
			'cln_patient_outreferral.patient_id AS outreferral',
			'doctors.Appt_interval'
		)
		.leftOuterJoin('cln_appt_patients', 'cln_appointment_calendar.CAL_ID', 'cln_appt_patients.CAL_ID')
		.leftOuterJoin('doctors', 'cln_appointment_calendar.DOCTOR_ID', 'doctors.doctor_id')
		.leftOuterJoin('cln_patients', 'cln_appt_patients.Patient_id', 'cln_patients.Patient_id')
		.leftOuterJoin('sys_services', 'cln_appointment_calendar.SERVICE_ID', 'sys_services.SERVICE_ID')
		.leftOuterJoin('cln_patient_outreferral', 'cln_appt_patients.Patient_id', 'cln_patient_outreferral.patient_id')
		.from('cln_appointment_calendar')
		.where({
			'cln_appointment_calendar.SITE_ID': postData.site_id
		})
		.where('cln_appointment_calendar.FROM_TIME', 'like', '%'+postData.datepicker+'%')
		.where('cln_appointment_calendar.CLINICAL_DEPT_ID', 'like', '%'+postData.clinical_dept_id+'%')
		.orderBy('cln_appointment_calendar.FROM_TIME', 'asc')
		.toString();

		/*
		* SELECT TABLE
		* cln_appointment_calendar
		*/
		var sub_sql = knex
		.distinct(
			'cln_appointment_calendar.DOCTOR_ID',
			'doctors.NAME',
			'doctors.Appt_interval'
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

	},
	/*
	* Description: Check Patient Alert to know alert has been done
	* Input Params: id (id of patient alerts), isCheck (1, 0)
	* Output Params: success -> return success message, error -> return error code MySQL
	*/
	postCheck: function(req, res) {

		var postData = req.body.data;

		if(postData.isCheck == 0){
			postData.isCheck = 1;
		} else{
			postData.isCheck = 0;
		}

		var sql = knex('cln_patient_alerts')
		.update({
			isCheck: postData.isCheck,
			isUser: postData.isUser
		})
		.where({
			id: postData.id
		})
		.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data});
		})
		.error(function(error){
			res.status(500).json({status: 'error', error: error});
		})

	},
	postUser: function(req, res) {

		var postData = req.body.data;

		var sql = knex('users')
		.column('user_name as User')
		.where({
			'id': postData
		})
		.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data});
		})
		.error(function(error){
			res.status(500).json({status: 'error', error: error});
		})

	}

}