var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var db = require('../models');
var S = require('string');
var moment = require('moment');
var _ = require('lodash');

module.exports = {

	postDisable: function(req, res){

		var postData = req.body.data;
		if(postData.isEnable == 1){
			postData.isEnable = 0;	
		}else{
			postData.isEnable = 1;
		}

		var sql = knex('cln_scripts')
		.update({
			'isEnable': postData.isEnable
		})
		.where({
			'ID': postData.ID,
			'Patient_id': postData.Patient_id,
		})
		.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data, sql: sql});
		})
		.error(function(error){
			res.json({data: data, error: error});
		})

	},

	postList: function(req, res){

		var postData = req.body.data;

		var sql = knex
		.column('cln_scripts.ID',
		'cln_scripts.Patient_id',
		'cln_scripts.CAL_ID',
		'cln_scripts.scriptNum',
		'cln_scripts.Medicare',
		'cln_patients.First_name',
		'cln_patients.Sur_name',
		'cln_scripts.Creation_date',
		'cln_scripts.isEnable')
		.from('cln_scripts')
		.innerJoin('cln_patients', 'cln_scripts.Patient_id', 'cln_patients.Patient_id')
		.where(knex.raw("IFNULL(cln_scripts.scriptNum, '') LIKE '%" + postData.scriptNum + "%'"))
		.where(knex.raw("IFNULL(cln_scripts.Medicare, '') LIKE '%" + postData.Medicare + "%'"))
		.where({'cln_scripts.Patient_id': postData.Patient_id, 'cln_scripts.CAL_ID': postData.CAL_ID})
		.orderBy('cln_scripts.Creation_date', postData.Creation_date)
		.limit(postData.limit)
		.offset(postData.offset)
		.toString();

		var sql_count = knex
		.column('cln_scripts.ID',
		'cln_scripts.Patient_id',
		'cln_scripts.CAL_ID',
		'cln_scripts.scriptNum',
		'cln_scripts.Medicare',
		'cln_patients.First_name',
		'cln_patients.Sur_name',
		'cln_scripts.Creation_date')
		.from('cln_scripts')
		.innerJoin('cln_patients', 'cln_scripts.Patient_id', 'cln_patients.Patient_id')
		.where({'cln_scripts.Patient_id': postData.Patient_id, 'cln_scripts.CAL_ID': postData.CAL_ID})
		.count('cln_scripts.ID as a')
		.toString();
		db.sequelize.query(sql)
		.success(function(data){
			db.sequelize.query(sql_count)
			.success(function(count){
				res.json({data: data, count: count[0].a});
			})
			.error(function(error){
				res.json(500, {'status': 'error', 'message': error});
			})
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	},//end postList

	postAdd: function(req, res){

		var postData = req.body.data;
		var errors = [];
		var required = [
			{field: 'prescriber', message: 'Prescriber is required'},
			{field: 'scriptNum', message: 'Script Number is required'},
			{field: 'Medicare', message: 'Medicare is required'},
			{field: 'EntitlementNo', message: 'EntitlementNo is required'},
			{field: 'pharmacist', message: 'Pharmacist is required'},
			{field: 'doctordate', message: 'Doctor Date is required'},
			{field: 'patientDate', message: 'Patient Date is required'},
			{field: 'agentAddress', message: 'Agent Address is required'}
		]

		_.forIn(postData, function(value, field){
			_.forEach(required, function(field_error){
				if(field_error.field === field && S(value).isEmpty()){
					errors.push(field_error);
					return;
				}
			})
		})

		if(errors.length>0){
			res.status(500).json({errors: errors});
			return;
		}

		console.log(postData);
		var sql = knex('cln_scripts')
		.insert(postData)
		.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data});
		})
		.error(function(error){
			res.json(500, {error: error, sql: sql});
		})

	},//end postAdd

	postById: function(req, res){

		var postData = req.body.data;

		var sql = knex('cln_scripts')
		.where({
			ID: postData
		})
		.toString();

		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data[0]});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})

	},//end postByid

	postEdit: function(req, res){

		var postData = req.body.data;

		var errors = [];
		var required = [
			{field: 'prescriber', message: 'Prescriber is required'},
			{field: 'scriptNum', message: 'Script Number is required'},
			{field: 'Medicare', message: 'Medicare is required'},
			{field: 'EntitlementNo', message: 'EntitlementNo is required'},
			{field: 'pharmacist', message: 'Pharmacist is required'},
			{field: 'doctordate', message: 'Doctor Date is required'},
			{field: 'patientDate', message: 'Patient Date is required'},
			{field: 'agentAddress', message: 'Agent Address is required'}
		]

		_.forIn(postData, function(value, field){
			_.forEach(required, function(field_error){
				if(field_error.field === field && S(value).isEmpty()){
					errors.push(field_error);
					return;
				}
			})
		})

		if(errors.length>0){
			res.status(500).json({errors: errors});
			return;
		}
		
		var sql = knex('cln_scripts')
		.where({
			ID: postData.ID
		})
		.update(postData)
		.toString();

		console.log(sql);

		db.sequelize.query(sql)
		.success(function(data){
			res.json({'data': data});
		})
		.error(function(error){
			res.json(500, {error: error, sql: sql});
		})

	}, //end postEdit

	postRemove: function(req, res){

		var postData = req.body.data;
		console.log(postData);
		var sql = knex('cln_scripts')
		.where({
			ID: postData
		})
		.del()
		.toString();
		console.log(sql);
		db.sequelize.query(sql)
		.success(function(data){
			res.json({'data': data});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	}

}