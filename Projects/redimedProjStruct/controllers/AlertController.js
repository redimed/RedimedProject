var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var S = require('string');
var db = require('../models');
var _ = require('lodash');

module.exports = {
	postListNoFollowPatient: function(req, res){
		var postData = req.body.data;

		var sql = knex('cln_alerts')
			.column(
				'cln_alerts.id',
				knex.raw('IFNULL(name,\'\') AS name'),
				knex.raw('IFNULL(description,\'\') AS description'),
				'cln_alerts.Creation_date'
			)
			.whereNotExists(function(){
				this.select('*').from('cln_patient_alerts')
				.whereRaw('cln_alerts.id = cln_patient_alerts.alert_id')
				.where('cln_patient_alerts.patient_id', postData.Patient_id)
				.where('cln_patient_alerts.cal_id', postData.CAL_ID)
			})
			.where('cln_alerts.isenable', 1)
			.where(knex.raw('IFNULL(name,\'\') LIKE \'%'+postData.name+'%\''))
			.where(knex.raw('IFNULL(description,\'\') LIKE \'%'+postData.description+'%\''))
			.limit(postData.limit)
			.offset(postData.offset)
			.orderBy('cln_alerts.Creation_date', postData.Creation_date)
			.toString();

		var count_sql = knex('cln_alerts')
			.count('cln_alerts.id as a')
			.whereNotExists(function(){
				this.select('*').from('cln_patient_alerts')
				.whereRaw('cln_alerts.id = cln_patient_alerts.alert_id')
				.where('cln_patient_alerts.patient_id', postData.Patient_id)
				.where('cln_patient_alerts.cal_id', postData.CAL_ID);
			})
			.where('cln_alerts.isenable', 1)
			.where(knex.raw('IFNULL(name,\'\') LIKE \'%'+postData.name+'%\''))
			.where(knex.raw('IFNULL(description,\'\') LIKE \'%'+postData.description+'%\''))
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

		var sql = knex('cln_alerts')
			.column(
				'cln_alerts.id',
				knex.raw('IFNULL(name,\'\') AS name'),
				knex.raw('IFNULL(description,\'\') AS description'),
				'cln_alerts.Creation_date'
			)
			.innerJoin('cln_patient_alerts', 'cln_alerts.id', 'cln_patient_alerts.alert_id')
			.where('cln_patient_alerts.patient_id', postData.Patient_id)
			.where('cln_patient_alerts.cal_id', postData.CAL_ID)
			.where('cln_alerts.isenable', 1)
			.where(knex.raw('IFNULL(name,\'\') LIKE \'%'+postData.name+'%\''))
			.where(knex.raw('IFNULL(description,\'\') LIKE \'%'+postData.description+'%\''))
			.limit(postData.limit)
			.offset(postData.offset)
			.orderBy('cln_alerts.Creation_date', postData.Creation_date)
			.toString();

		var count_sql = knex('cln_alerts')
			.count('cln_alerts.id as a')
			.innerJoin('cln_patient_alerts', 'cln_alerts.id', 'cln_patient_alerts.alert_id')
			.where('cln_patient_alerts.patient_id', postData.Patient_id)
			.where('cln_patient_alerts.cal_id', postData.CAL_ID)
			.where('cln_alerts.isenable', 1)
			.where(knex.raw('IFNULL(name,\'\') LIKE \'%'+postData.name+'%\''))
			.where(knex.raw('IFNULL(description,\'\') LIKE \'%'+postData.description+'%\''))
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

	postEdit: function(req, res){
		var postData = req.body.data;

		var errors = [];
		var required = [
			{field: 'name', message: 'Alert Name required'},
			{field: 'description', message: 'Description required'}
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

		var unique_sql = knex('cln_alerts')
			.whereNotIn('id', [postData.id])
			.where('name', postData.name)
			.toString();

		var sql = knex('cln_alerts')
			.where('id', postData.id)
			.update(postData)
			.toString();

		db.sequelize.query(unique_sql)
		.success(function(rows){
			if(rows.length > 0){
				errors.push({field: 'name', message: 'Alert Name exists'});
				res.status(500).json({errors: errors});
				return;
			}else{
				db.sequelize.query(sql)
				.success(function(updated){
					res.json({data: updated});	
				})
				.error(function(error){
					res.json(500, {error: error});
				})
			}
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	postOne: function(req, res){
		var postData = req.body.data;

		var sql = knex('cln_alerts')
			.column(
				'*'
			)
			.where('cln_alerts.isenable', 1)
			.where('id', postData.id)
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

		var sub_sql = knex('cln_patient_alerts')
			.where('alert_id', postData.id)
			.del()
			.toString();

		db.sequelize.query(sub_sql)
		.success(function(del){
			res.json({data: del});
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	postAdd: function(req, res){
		var postData = req.body.data;

		var errors = [];
		var required = [
			{field: 'name', message: 'Alert Name required'},
			{field: 'description', message: 'Description required'}
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

		var unique_sql = knex('cln_alerts')
			.where('name', postData.name)
			.toString();

		var sql = knex('cln_alerts')
			.insert(postData)
			.toString();

		db.sequelize.query(unique_sql)
		.success(function(rows){
			if(rows.length > 0){
				errors.push({field: 'name', message: 'Alert Name exists'});
				res.status(500).json({errors: errors});
				return;
			}else{
				db.sequelize.query(sql)
				.success(function(created){
					res.json({data: created});	
				})
				.error(function(error){
					res.json(500, {error: error});
				})
			}
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	postList: function(req, res){
		var postData = req.body.data;

		var sql = knex
			.column(
				'id',
				knex.raw('IFNULL(name,\'\') AS name'),
				knex.raw('IFNULL(description,\'\') AS description'),
				'Creation_date',
				'isenable'
			)
			.from('cln_alerts')
			//.where('isenable', 1)
			.where(knex.raw('IFNULL(name,\'\') LIKE \'%'+postData.name+'%\''))
			.where(knex.raw('IFNULL(description,\'\') LIKE \'%'+postData.description+'%\''))
			.orderBy('Creation_date', postData.Creation_date)
			.limit(postData.limit)
			.offset(postData.offset)
			.toString();
				
		var count_sql = knex('cln_alerts')
			.count('id as a')
			//.where('isenable', 1)
			.where(knex.raw('IFNULL(name,\'\') LIKE \'%'+postData.name+'%\''))
			.where(knex.raw('IFNULL(description,\'\') LIKE \'%'+postData.description+'%\''))
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

	postSelect: function(req, res){
		var postData = req.body.data;

		var sql = knex('cln_patient_alerts')
				.insert(postData)
				.toString();

		db.sequelize.query(sql)
		.success(function(created){
			res.json({data: created});
		}, function(error){
			res.json(500, {error: error});
		})
	},
	postUpdateEnable : function(req,res){
		var postData = req.body.data;
        if (postData.isenable == 1) {
            postData.isenable = 0;
        } else{
            postData.isenable = 1;
        };
        var sql = 
                knex('cln_alerts')
                .update({
                    'isenable': postData.isenable
                })
                .where('id',postData.id)
                .toString()
                db.sequelize.query(sql)
                .success(function(data){
                    res.json({data: data,sql:sql});
                })
                .error(function(error){
                    res.json(500, {error: error,sql:sql});
                }) 
	},
	postUpdateEnablePatient : function(req,res){
		var postData = req.body.data;
        if (postData.isEnable == 1) {
            postData.isEnable = 0;
        } else{
            postData.isEnable = 1;
        };
        var sql = 
                knex('cln_patient_alerts')
                .update({
                    'isEnable': postData.isEnable
                })
                .where('alert_id',postData.alert_id)
                .where('patient_id',postData.patient_id)
                .where('cal_id',postData.cal_id)
                .toString()
                db.sequelize.query(sql)
                .success(function(data){
                    res.json({data: data,sql:sql});
                })
                .error(function(error){
                    res.json(500, {error: error,sql:sql});
                })
	}
}