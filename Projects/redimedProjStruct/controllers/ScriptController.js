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
		'script_head.medication_name',
		'cln_patients.First_name',
		'cln_patients.Sur_name',
		'cln_scripts.Creation_date',
		'cln_scripts.isEnable')
		.from('cln_scripts')
		.innerJoin('cln_patients', 'cln_scripts.Patient_id', 'cln_patients.Patient_id')
		.innerJoin('script_head', 'cln_scripts.ID', 'script_head.ID_SCRIPT')
		.where(knex.raw("IFNULL(cln_scripts.scriptNum, '') LIKE '%" + postData.scriptNum + "%'"))
		.where(knex.raw("IFNULL(script_head.medication_name, '') LIKE '%" + postData.medication_name + "%'"))
		.where({'cln_scripts.Patient_id': postData.Patient_id, 'cln_scripts.CAL_ID': postData.CAL_ID})
		.orderBy('cln_scripts.Creation_date', postData.Creation_date)
		.groupBy('cln_scripts.ID')
		.limit(postData.limit)
		.offset(postData.offset)
		.toString();

		var sql_count = knex
		.column('cln_scripts.ID',
		'cln_scripts.Patient_id',
		'cln_scripts.CAL_ID',
		'cln_scripts.scriptNum',
		'script_head.medication_name',
		'cln_patients.First_name',
		'cln_patients.Sur_name',
		'cln_scripts.Creation_date')
		.from('cln_scripts')
		.innerJoin('cln_patients', 'cln_scripts.Patient_id', 'cln_patients.Patient_id')
		.innerJoin('script_head', 'cln_scripts.ID', 'script_head.ID_SCRIPT')
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
			//{field: 'Medicare', message: 'Medicare is required'},
			{field: 'EntitlementNo', message: 'EntitlementNo is required'},
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

		//console.log(postData);
		var sql = knex('cln_scripts')
		.insert(postData)
		.then(function(response){
			res.json({data: response[0]});
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
			//{field: 'Medicare', message: 'Medicare is required'},
			{field: 'EntitlementNo', message: 'EntitlementNo is required'},
			{field: 'MedicareNo', message: 'MedicareNo is required'},
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
	},

	postSing: function(req, res){

		var postData = req.body.data;

		var sql = knex
		.column('doctors.Signature')
		.from('doctors')
		.where({
			'doctors.User_id': postData
		})
		.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data[0]});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	},

	postAddScriptHead: function(req, res){
		var postData = req.body.data;
		var post_array = [];
		_.forEach(postData, function(value){
			post_array.push(value);
		})

		var sql_select = knex('script_head')
		.select()
		.toString();

		db.sequelize.query(sql_select)
		.success(function(data){
			//console.log('^^^^^^^^: ', data);
			var new_array = [];
			_.forEach(post_array, function(values, indexs){
				var flag = true;
				_.forEach(data, function(value, index){
					if(data[index].medication_name == post_array[indexs].medication_name){
						flag = false;
						return;
					}
				})

				if(flag)
					new_array.push(values);
				
			})

			var sql = knex('script_head')
			.insert(new_array)
			.toString();
			db.sequelize.query(sql)
			.success(function(data){
				res.json({data: data});
			})
			.error(function(error){
				res.json(500, {'status': 'error', 'message': error});
			})

		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})

	},
	postListScriptHead: function(req, res){

		var postData = req.body.data;
		var postDatar = req.body.datar;

		var sql = knex('script_head')
		.where({
			ID_SCRIPT: postData,
			CAL_ID: postDatar
		})
		.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data});
		})
		.error(function(error){
			res.json(500, {error: error, sql: sql});
		})

	},
	postEditScriptHead: function(req, res){

		var postData = req.body.data;
		var postDatar = req.body.datar;

		var post_array = [];
		var post_arr = [];

		_.forEach(postData, function(value){
			post_array.push(value);
		})

		_.forEach(postDatar, function(values){
			post_arr.push(values.ID);
		})

		var sql_d = knex('script_head')
		.whereIn('ID', post_arr)
		.del()
		.toString();
		db.sequelize.query(sql_d)
		.success(function(data){
			res.json({data: data});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
		console.log('_____________________ ', sql_d);

		var p_arr = [];
		
		_.forEach(post_array, function(value, index){
			var flag = true;
			if(post_array.length < 0){
				flag = false;
				return;
			}
			if(flag)
				p_arr.push(value);
		})
		console.log('@#$%^&*(: ', p_arr);

		if(p_arr.length > 0){
			var sql = knex('script_head')
			.insert(p_arr)
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

}