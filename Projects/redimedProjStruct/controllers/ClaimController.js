var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var S = require('string');
var db = require('../models');
var _ = require('lodash');

module.exports = {
	postEdit: function(req, res){
		var postData = req.body.data;

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
			.where('Claim_id', postData.Claim_id)
			.update(postData)
			.toString();

		db.sequelize.query(sql)
		.success(function(updated){
			res.json({data: updated});	
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	postOne: function(req, res){
		var postData = req.body.data;

		var sql = knex('cln_claims')
			.column(
				'cln_claims.*'
			)
			.where('cln_claims.Isenable', 1)
			.where('Claim_id', postData.Claim_id)
			.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows[0]});
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	postRemove: function(req, res){
		var postData = req.body.data;

		var sql = knex('cln_claims')
			.where('Claim_id', postData.Claim_id)
			.del()
			.toString();

		var sub_sql = knex('cln_patient_claim')
			.where('Claim_id', postData.Claim_id)
			.del()
			.toString();

		db.sequelize.query(sql)
		.success(function(del){
			db.sequelize.query(sub_sql)
			.success(function(sub_del){
				res.json({data: del});
			})
			.error(function(error){
				res.json(500, {error: error});	
			})
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	postAddPatient: function(req, res){
		var postData = req.body.data;

		var sql = knex('cln_patient_claim')
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

	postListNoFollowPatient: function(req, res){
		var postData = req.body.data;

		var sql = knex
				.column(
					'cln_claims.Claim_id',
					'Claim_date',
					'Injury_date',
					knex.raw('IFNULL(Claim_no,"") AS Claim_no'),
					knex.raw('IFNULL(Injury_name,"") AS Injury_name')
				)
				.from('cln_claims')
				.whereNotExists(function(){
					this.select('*').from('cln_patient_claim')
					.whereRaw('cln_claims.Claim_id = cln_patient_claim.Claim_id')
					.where('cln_patient_claim.Patient_id', postData.Patient_id)
				})
				.where('cln_claims.Isenable', 1)
				.where(knex.raw('IFNULL(Claim_no,"") LIKE "%'+postData.Claim_no+'%"'))
				.where(knex.raw('IFNULL(Injury_name,"") LIKE "%'+postData.Injury_name+'%"'))
				.limit(postData.limit)
				.offset(postData.offset)
				.orderBy('cln_claims.Claim_date', postData.Claim_date)
				.orderBy('cln_claims.Injury_date', postData.Injury_date)
				.toString();

		var count_sql = knex('cln_claims')
				.whereNotExists(function(){
					this.select('*').from('cln_patient_claim')
					.whereRaw('cln_claims.Claim_id = cln_patient_claim.Claim_id')
					.where('cln_patient_claim.Patient_id', postData.Patient_id)
				})
				.count('cln_claims.Claim_id as a')
				.where('cln_claims.Isenable', 1)
				.where(knex.raw('IFNULL(Claim_no,"") LIKE "%'+postData.Claim_no+'%"'))
				.where(knex.raw('IFNULL(Injury_name,"") LIKE "%'+postData.Injury_name+'%"'))
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

	postListFollowPatient: function(req, res){
		var postData = req.body.data;

		var sql = knex
				.column(
					'cln_claims.Claim_id',
					'cln_patient_claim.Patient_id',
					'Claim_date',
					'Injury_date',
					knex.raw('IFNULL(Claim_no,"") AS Claim_no'),
					knex.raw('IFNULL(Injury_name,"") AS Injury_name')
				)
				.from('cln_claims')
				.innerJoin('cln_patient_claim', 'cln_claims.Claim_id', 'cln_patient_claim.Claim_id')
				.where('cln_claims.Isenable', 1)
				.where(knex.raw('IFNULL(Claim_no,"") LIKE "%'+postData.Claim_no+'%"'))
				.where(knex.raw('IFNULL(Injury_name,"") LIKE "%'+postData.Injury_name+'%"'))
				.where('cln_patient_claim.Patient_id', postData.Patient_id)
				.limit(postData.limit)
				.offset(postData.offset)
				.orderBy('cln_claims.Claim_date', postData.Claim_date)
				.orderBy('cln_claims.Injury_date', postData.Injury_date)
				.toString();

		var count_sql = knex('cln_claims')
				.innerJoin('cln_patient_claim', 'cln_claims.Claim_id', 'cln_patient_claim.Claim_id')
				.count('cln_claims.Claim_id as a')
				.where('cln_claims.Isenable', 1)
				.where(knex.raw('IFNULL(Claim_no,"") LIKE "%'+postData.Claim_no+'%"'))
				.where(knex.raw('IFNULL(Injury_name,"") LIKE "%'+postData.Injury_name+'%"'))
				.where('cln_patient_claim.Patient_id', postData.Patient_id)
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
	}
}