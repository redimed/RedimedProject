var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var S = require('string');
var db = require('../models');
var _ = require('lodash');
var kiss=require('./kissUtilsController');//tan add
var errorCode=require('./errorCode');//tan add

var controllerCode="RED_CLAIM";//tan add

module.exports = {
	postEdit: function(req, res){
		var postData = req.body.data;

		var errors = [];
		var required = [
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
			//.where('cln_claims.Isenable', 1)
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

	/**
	 * get patient Insurer
	 * tannv.dts@gmail.com
	 */
	getPatientInsurer:function(req,res)
	{	
		var fHeader="ClaimController->getPatientInsurer";
		var functionCode="FN001";
		var patientId=req.query.patientId;
		if(!kiss.checkListData(patientId))
		{
			kiss.exlog(fHeader,"Loi data truyen den");
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
			return;
		}
		var sql="SELECT * FROM `cln_patients` patient WHERE patient.`Patient_id`=?";
		kiss.executeQuery(req,sql,[patientId],function(rows){
			if(rows.length>0)
			{
				var patient=rows[0];
				if(patient.company_id!=null)
				{
					//neu patient thuoc company
					var sql="SELECT * FROM `companies` c WHERE c.`id`=?";
					kiss.executeQuery(req,sql,[patient.company_id],function(rows){
						if(rows.length>0)
						{
							var company=rows[0];
							if(company.Insurer!=null)
							{
								var sql="SELECT * FROM `cln_insurers` insurer WHERE insurer.`id`=?";
								kiss.executeQuery(req,sql,[company.Insurer],function(rows){
									if(rows.length>0)
									{
										res.json({status:'success',insurer:rows[0]});
									}
									else
									{
										res.json({status:'success',insurer:null});
									}
								},function(err){
									kiss.exlog(fHeader,"Loi truy van lay thong tin insurer");
									res.json({staus:'fail',error:errorCode.get(controllerCode,functionCode,'TN005')});
								})
							}
							else
							{
								res.json({status:'success',insurer:null});
							}
						}
						else
						{
							res.json({status:'success',insurer:null});
						}
					},function(err){
						kiss.exlog(fHeader,"Loi truy van lay thong tin company cua patient");
						res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN004')});
					});
				}
				else
				{
					//neu patient khong thuoc company
					res.json({status:'success',insurer:null});
				}
			}
			else
			{
				kiss.exlog(fHeader,"Khong ton tai patient id");
				res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
			}
		},function(err){
			kiss.exlog(fHeader,"Loi truy van lay thong tin patient");
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
		})
	},


	postAdd: function(req, res){
		var postData = req.body.data;
		var checkCalId = postData.CAL_ID;
		if (postData.CAL_ID) {
			var CAL_ID = postData.CAL_ID;
			delete postData.CAL_ID;
		};
		

		var errors = [];
		var required = [
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
				if (checkCalId) {
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
				}else{
					var sqlselect = knex('cln_claims')
						.column(
							'cln_claims.*'
						)
						.where('Claim_id', rows[0].id)
						.toString();
					db.sequelize.query(sqlselect)
					.success(function(rows){
						res.json({data: rows[0]});
					})
					.error(function(error){
						res.json(500, {error: error});
					})
				};
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
				.distinct(
					'cln_claims.Claim_id',
					'Claim_date',
					'Injury_date',
					knex.raw('IFNULL(Claim_no,\'\') AS Claim_no'),
					knex.raw('IFNULL(Injury_name,\'\') AS Injury_name')
				)
				.column('cln_claims.Isenable')
				.from('cln_claims')
				.innerJoin('cln_patient_claim', 'cln_claims.Claim_id', 'cln_patient_claim.Claim_id')
				.where('cln_patient_claim.Patient_id', postData.Patient_id)
				//.where('cln_claims.Isenable', 1)
				.where(knex.raw('IFNULL(Claim_no,\'\') LIKE \'%'+postData.Claim_no+'%\''))
				.where(knex.raw('IFNULL(Injury_name,\'\') LIKE \'%'+postData.Injury_name+'%\''))
				.limit(postData.limit)
				.offset(postData.offset)
				.orderBy('cln_claims.Claim_date', postData.Claim_date)
				.orderBy('cln_claims.Injury_date', postData.Injury_date)
				.toString();

		var count_sql = knex('cln_claims')
				.innerJoin('cln_patient_claim', 'cln_claims.Claim_id', 'cln_patient_claim.Claim_id')
				.where('cln_patient_claim.Patient_id', postData.Patient_id)
				.count('cln_claims.Claim_id as a')
				//.where('cln_claims.Isenable', 1)
				.where(knex.raw('IFNULL(Claim_no,\'\') LIKE \'%'+postData.Claim_no+'%\''))
				.where(knex.raw('IFNULL(Injury_name,\'\') LIKE \'%'+postData.Injury_name+'%\''))
				.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			db.sequelize.query(count_sql)
			.success(function(count){
				res.json({data: rows, count: count[0].a, sql: sql});
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
				.distinct(
					'cln_claims.Claim_id',
					'cln_claims.Patient_id',
					'Claim_date',
					'Injury_date',
					knex.raw('IFNULL(Claim_no,\'\') AS Claim_no'),
					knex.raw('IFNULL(Injury_name,\'\') AS Injury_name')
				)
				.column('cln_claims.Isenable')
				.from('cln_claims')
				// .innerJoin('cln_patient_claim', 'cln_claims.Claim_id', 'cln_patient_claim.Claim_id')
				//.where('cln_claims.Isenable', 1)
				.where(knex.raw('IFNULL(Claim_no,\'\') LIKE \'%'+postData.Claim_no+'%\''))
				.where(knex.raw('IFNULL(Injury_name,\'\') LIKE \'%'+postData.Injury_name+'%\''))
				.where('cln_claims.Patient_id', postData.Patient_id)
				.limit(postData.limit)
				.offset(postData.offset)
				.orderBy('cln_claims.Claim_date', postData.Claim_date)
				.orderBy('cln_claims.Injury_date', postData.Injury_date)
				.toString();

		var count_sql = knex('cln_claims')
				// .innerJoin('cln_patient_claim', 'cln_claims.Claim_id', 'cln_patient_claim.Claim_id')
				.count('cln_claims.Claim_id as a')
				//.where('cln_claims.Isenable', 1)
				.where(knex.raw('IFNULL(Claim_no,\'\') LIKE \'%'+postData.Claim_no+'%\''))
				.where(knex.raw('IFNULL(Injury_name,\'\') LIKE \'%'+postData.Injury_name+'%\''))
				.where('cln_claims.Patient_id', postData.Patient_id)
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

	postDisableClaim : function(req,res){
		var postData = req.body.data;
        if (postData.isEnable == 1) {
            postData.isEnable = 0;
        } else{
            postData.isEnable = 1;
        };
        var sql = 
                knex('cln_patient_claim')
                .update({
                    'isEnable': postData.isEnable
                })
                .where('Claim_id',postData.Claim_id)
                .where('patient_id',postData.patient_id)
                .where('CAL_ID',postData.CAL_ID)
                .toString()
                db.sequelize.query(sql)
                .success(function(data){
                    res.json({data: data,sql:sql});
                })
                .error(function(error){
                    res.json(500, {error: error,sql:sql});
                })  
	},

	postOpenClose: function(req, res){

		var postData = req.body.data;

		if(postData.Isenable == 1){
			postData.Isenable = 0;
		}else{
			postData.Isenable = 1;
		}

		var sql = knex('cln_claims')
		.update({
			'Isenable': postData.Isenable
		})
		.where({
			'Claim_id': postData.Claim_id
		})
		.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data});
		})
		.error(function(error){
			res.json(500, {error: error,sql:sql});
		})

	},

	postListFollowPatientInsurer : function(req,res){

		var postData = req.body.data;
		console.log(postData);
		var sql = knex
				.distinct(
					'cln_claims.Claim_id',
					'cln_claims.Patient_id',
					'Claim_date',
					'Injury_date',
					knex.raw('IFNULL(Claim_no,\'\') AS Claim_no'),
					knex.raw('IFNULL(Injury_name,\'\') AS Injury_name')
				)
				.column('cln_claims.Isenable')
				.from('cln_claims')
				.where(knex.raw('IFNULL(Claim_no,\'\') LIKE \'%'+postData.Claim_no+'%\''))
				.where(knex.raw('IFNULL(Injury_name,\'\') LIKE \'%'+postData.Injury_name+'%\''))
				.where('cln_claims.Patient_id', postData.Patient_id)
				.where('cln_claims.insurer_id', postData.insurer_id)
				.limit(postData.limit)
				.offset(postData.offset)
				.orderBy('cln_claims.Claim_date', postData.Claim_date)
				.orderBy('cln_claims.insurer_id', postData.Injury_date)
				.toString();

		var count_sql = knex('cln_claims')
				.count('cln_claims.Claim_id as a')
				.where(knex.raw('IFNULL(Claim_no,\'\') LIKE \'%'+postData.Claim_no+'%\''))
				.where(knex.raw('IFNULL(Injury_name,\'\') LIKE \'%'+postData.Injury_name+'%\''))
				.where('cln_claims.Patient_id', postData.Patient_id)
				.where('cln_claims.insurer_id', postData.insurer_id)
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