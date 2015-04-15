var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var S = require('string');
var _ = require('lodash');

module.exports = {
	postActive: function(req, res){
		var postData = req.body.data;

		var sql = knex('doctors')
				.where('doctor_id', postData.doctor_id)
				.update({Specialty_id: postData.Specialty_id})
				.toString();

		db.sequelize.query(sql)
		.success(function(active){
			res.json({data: active});
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	postSelectServiceDoctor: function(req, res){
		var postData = req.body.data;

		var sql = knex('doctor_specialities')
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

	postRemoveServiceDoctor: function(req, res){
		var postData = req.body.data;
		 var postData = req.body.data;
        if (postData.Isenable == 1) {
            postData.Isenable = 0;
        } else{
            postData.Isenable = 1;
        };
		var sql = knex('doctor_specialities')
					.where({
						'doctor_specialities.doctor_id': postData.doctor_id,
						'doctor_specialities.Specialties_id': postData.Specialties_id
					})
					.update({'doctor_specialities.Isenable':  postData.Isenable})
					.toString();

		db.sequelize.query(sql)
		.success(function(deleted){
			res.json({data: deleted});
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	postListByServiceDoctor: function(req, res){
		var postData = req.body.data;

		var sql = knex('doctor_specialities')
				.column(
					'cln_specialties.Specialties_id',
					'cln_specialties.Specialties_name',
					'rl_types.Rl_TYPE_NAME',
					'doctor_specialities.Isenable'
				)
				.innerJoin('cln_specialties', 'doctor_specialities.Specialties_id', 'cln_specialties.Specialties_id')
				.innerJoin('rl_types', 'cln_specialties.RL_TYPE_ID', 'rl_types.RL_TYPE_ID')
				//.where('doctor_specialities.Isenable', 1)
				.where('doctor_specialities.doctor_id', postData.doctor_id)
				.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows});
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	postLoadWithoutDoctor: function(req, res){
		var postData = req.body.data;

		var sql_check = knex('doctor_specialities')
						.select('Specialties_id')
						.where('doctor_id', postData.doctor_id)
						.where('Isenable', 1)
						.map(function(row){
							return row.Specialties_id;
						})
		.then(function(ids){
			var sql = knex
				.column(
					'Specialties_id',
					knex.raw('IFNULL(Specialties_name,\'\') AS Specialties_name'),
					'rl_types.Rl_TYPE_NAME',
					'cln_specialties.Creation_date'
				)
				.from('cln_specialties')
				.innerJoin('rl_types', 'cln_specialties.RL_TYPE_ID', 'rl_types.RL_TYPE_ID')
				.where('cln_specialties.Isenable', 1)
				.where('rl_types.ISENABLE', 1)
				.whereNotIn('cln_specialties.Specialties_id', ids)
				.where(knex.raw('IFNULL(Specialties_name,\'\') LIKE \'%'+postData.Specialties_name+'%\''))
				.orderBy('cln_specialties.Creation_date', postData.Creation_date)
				.limit(postData.limit)
				.offset(postData.offset)
				.toString();
					
			var count_sql = knex('cln_specialties')
				.count('cln_specialties.Specialties_id as a')
				.where('cln_specialties.Isenable', 1)
				.whereNotIn('cln_specialties.Specialties_id', ids)
				.where(knex.raw('IFNULL(Specialties_name,\'\') LIKE \'%'+postData.Specialties_name+'%\''))
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
		})
	},

	postAdd: function(req, res){
		var postData = req.body.add_data;

		db.mdtSpecialty.create(postData)
		.success(function(created){
			if(!created) res.json(500, {'status': 'error', 'message': 'Cannot Insert'});
			res.json({'status': 'success', 'data': created});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	},
	postEdit: function(req, res){
		var postData = req.body.edit_data;
		var edit_id = req.body.edit_id;

		db.mdtSpecialty.find(edit_id)
		.success(function(detail){
			if(!detail) res.json(500, {'status': 'error', 'message': 'Id Missing !!!'});
			detail.updateAttributes(postData).success(function(updated){
				res.json({'status': 'success', 'data': updated});
			})
			.error(function(error){
				res.json(500, {'status': 'error', 'message': error});
			})
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	},
	postDelete: function(req, res){
		var delete_id = req.body.delete_id;

		db.mdtSpecialty.find(delete_id)
		.success(function(detail){
			if(!detail) res.json(500, {'status': 'error', 'message': 'Id Missing !!!'});
			detail.destroy().success(function(deleted){
				res.json({'status': 'success', 'data': deleted});
			})
			.error(function(error){
				res.json(500, {'status': 'error', 'message': error});
			})
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	},
	postById: function(req, res){
		var detail_id = req.body.detail_id;

		db.mdtSpecialty.find(detail_id)
		.success(function(detail){
			if(!detail) res.json(500, {'status': 'error', 'message': 'Cannot Get Detail'});
			res.json({'status': 'success', 'data': detail});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	},
	postSearch: function(req, res){
		var pagination = req.body.pagination;
		var post_fields = req.body.filters;
		var select = req.body.select;

		var sql = mdt_functions.commonSearch(post_fields);

		db.mdtSpecialty.findAndCountAll({
			where: [sql],
			offset: pagination.offset,
			limit: pagination.limit,
			attributes: select,
			order: 'Creation_date DESC'
		})
		.success(function(result){
			if(!result) res.json(500, {'status': 'error', 'message': 'Cannot Get Search'});
			res.json({'status': 'success', 'data': result.rows, 'count': result.count});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	}
}