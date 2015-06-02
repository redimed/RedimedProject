var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var S = require('string');
var db = require('../models');
var _ = require('lodash');
var moment = require('moment');

module.exports = {
	postRemove: function(req, res){
		var postData = req.body.data;

		var sql = knex('cln_waiting_lists')
		.where('id', postData.id)
		.del().toString();

		db.sequelize.query(sql)
		.success(function(deleted){
			res.json({data: deleted});
		})
		.error(function(error){
			res.json(500, {error: error,sql:sql});	
		})
	},
	postList: function(req, res){
		var sql = knex('cln_waiting_lists')
					.column([
						'cln_waiting_lists.id',
						'cln_waiting_lists.doctor_id',
						'cln_waiting_lists.Patient_id',
						'cln_waiting_lists.Creation_date',
						'cln_waiting_lists.priority',
						'doctors.NAME AS doctor_name',
						'cln_patients.First_name',
						'cln_patients.Sur_name'
					])
					.innerJoin('doctors', 'cln_waiting_lists.doctor_id', 'doctors.doctor_id')
					.innerJoin('cln_patients', 'cln_waiting_lists.Patient_id', 'cln_patients.Patient_id')
					.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows});
		})
		.error(function(error){
			res.json(500, {error: error,sql:sql});	
		})
	},
	postAdd: function(req, res){
		var postData = req.body.data;

		var errors = [];
		var required = [
			{field: 'doctor_id', message: 'Doctor required'},
			{field: 'Patient_id', message: 'Patient required'},
			{field: 'priority', message: 'Priority required'}
		];

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

		var sql = knex('cln_waiting_lists')
				.insert({
					Creation_date:postData.Creation_date, 
					Created_by:postData.Created_by, 
					doctor_id: postData.doctor_id,
					Patient_id: postData.Patient_id,
					priority: postData.priority,
					reason: postData.reason
				})
				.toString();
		db.sequelize.query(sql)
		.success(function(created){
			res.json({data: created});
		})
		.error(function(error){
			res.json(500, {error: error,sql:sql});	
		})
	}
}