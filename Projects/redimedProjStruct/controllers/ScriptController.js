var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var db = require('../models');

module.exports = {

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
		'cln_scripts.Creation_date')
		.from('cln_scripts')
		.innerJoin('cln_patients', 'cln_scripts.Patient_id', 'cln_patients.Patient_id')
		.where(knex.raw('IFNULL(cln_scripts.scriptNum, "") LIKE "%' + postData.scriptNum + '%"'))
		.where(knex.raw('IFNULL(cln_scripts.Medicare, "") LIKE "%' + postData.Medicare + '%"'))
		.where({'cln_scripts.Patient_id': postData.Patient_id, 'cln_scripts.CAL_ID': postData.CAL_ID})
		.orderBy('cln_scripts.Creation_date', postData.Creation_date)
		.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({'data': data});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	},//end postList

	postAdd: function(req, res){

		var postData = req.body.data;
		console.log(postData);
		var sql = knex('cln_scripts')
		.insert(postData)
		.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({'data': data});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})

	},//end postAdd

	postById: function(req, res){

		var postData = req.body.data;

		var sql = knex
		.column('cln_scripts.ID',
		'cln_scripts.CAL_ID',
		'cln_scripts.scriptNum',
		'cln_scripts.Medicare',
		'cln_scripts.isRefNo',
		'cln_scripts.EntitlementNo',
		'cln_scripts.isSafety',
		'cln_scripts.isConcessional',
		'cln_scripts.isPBS',
		'cln_scripts.isRPBS',
		'cln_scripts.isBrand',
		'cln_scripts.pharmacist',
		'cln_scripts.doctorSign',
		'cln_scripts.doctordate',
		'cln_scripts.patientSign',
		'cln_scripts.patientDate',
		'cln_scripts.agentAddress',
		'cln_patients.First_name',
		'cln_patients.Sur_name')
		.from('cln_scripts')
		.innerJoin('cln_patients', 'cln_scripts.Patient_id', 'cln_patients.Patient_id')
		.where({
			ID: postData
		})
		.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})

	},//end postByid

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