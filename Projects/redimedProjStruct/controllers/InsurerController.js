var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var db = require('../models');
var S = require('string');
var moment = require('moment');
var _ = require('lodash');

module.exports = {
	postOneFollowPatient: function(req, res){
		var postData = req.body.data;

		var sql = knex
			.column('cln_insurers.id', 'cln_insurers.insurer_name')
			.from('cln_patients')
			.innerJoin('companies', 'cln_patients.company_id', 'companies.id')
			.innerJoin('cln_insurers', 'companies.Insurer', 'cln_insurers.id')
			.where({
				'cln_patients.Isenable': 1,
				'cln_patients.Patient_id': postData.Patient_id
			})
			.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows[0], sql: sql});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	}

	
}