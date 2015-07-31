var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var db = require('../models');
var S = require('string');
var moment = require('moment');
var _ = require('lodash');
var kiss=require('./kissUtilsController');

module.exports = {
	postOneFollowPatient: function(req, res){
		var postData = req.body.data;

		var sql = knex
			.column('cln_insurers.id', 'cln_insurers.insurer_name')
			.from('cln_patients')
			.innerJoin('companies', 'cln_patients.company_id', 'companies.id')
			.innerJoin('cln_insurers', 'companies.Insurer', 'cln_insurers.id')
			.where({
				'cln_patients.Patient_id': postData.Patient_id
			})
			.toString();
		kiss.exlog(sql);
		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows[0], sql: sql});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	postOneFollowCompany: function(req, res){
		var postData = req.body.data;

		var sql = knex
				.column('cln_insurers.insurer_name', 'cln_insurers.id')
				.from('companies')
				.leftOuterJoin('cln_insurers', 'companies.Insurer', 'cln_insurers.id')
				.where({
					'companies.id': postData.company_id
				})
				.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows[0]});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	postGetByPatient: function(req,res){
		var patientId = req.body.patient_id;

		db.sequelize.query("SELECT * FROM cln_insurers i "+
						   "WHERE i.id = (SELECT c.`Insurer` FROM companies c "+
						   "WHERE c.id = (SELECT p.`company_id` FROM cln_patients p WHERE p.`Patient_id` = ?))",null,{raw:true},[patientId])
			.success(function(rs){
				if(rs)
					res.json({status:'success',data:rs});
				else
					res.json({status:'error'});
			})
	},
	postGetFeeGroup: function(req,res){
		var postData = req.body.data;
		var sql = knex
				  .select('*')
				  .from('cln_fee_group')
				  .where('FEE_GROUP_TYPE',postData.FEE_GROUP_TYPE)
				  .where('ISENABLE',1)
				  .toString();
		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows, sql: sql});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	}
}