var db = require('../models');
var mdt_functions = require('../mdt-functions.js');
var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var S = require('string');
var moment = require('moment');
var _ = require('lodash');

module.exports = {
	postById: function(req, res){
		//var cal_id = req.body.CAL_ID;
		//var patient_id = req.body.PATIENT_ID;

		var cal_id = 10196;
		var patient_id = 493;

		var sql = "SELECT * "
				+"FROM cln_appointment_calendar cac "
				+"WHERE cac.CAL_ID="+cal_id
				+" AND REGEXP '\"Patiend_id\":\"([^\"]*)493([^\"]*)\"";

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({test: rows});
		});

		/*db.mdtAppointment.find(cal_id)
		.success(function(appointment){
			if(!appointment){
				res.json(500, {"status": "error", "message": "Database Error"});
			}else{
				appointment.getPatient()
				.success(function(patient){
					res.json({test: patient});
				})
			}
		})*/
	},//end postById
	getAppt: function(req, res) {

		var postData = req.body.data;

	 	var sql = knex
	 	.column('cln_appt_patients.Patient_id')
	 	.from('cln_appt_patients')
	 	.innerJoin('cln_appointment_calendar', 'cln_appointment_calendar.CAL_ID', 'cln_appt_patients.CAL_ID')
	 	.whereRaw('CAST(cln_appointment_calendar.FROM_TIME as DATE) = ?', [postData])
	 	.toString();
	 	db.sequelize.query(sql)
	 	.success(function(data){
	 		res.json({data: data});
	 	})
	 	.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	}
}