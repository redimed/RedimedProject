var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	list: function(req, res){
		var sql = "SELECT * FROM cln_insurers";

		db.sequelize.query(sql)
		.success(function(list){
			res.json({status: 'success', data: list});
		})
		.error(function(error){
			res.json(500, {status: 'error', message: error});
		})
	},

	postAdd: function(req, res){
		var postData = req.body.add_data;

		var sql = mdt_functions.commonAdd("cln_insurers", postData);

		db.sequelize.query(sql)
		.success(function(created){

			res.json({'status': 'success', 'data': created});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	},
	postEdit: function(req, res){
		var postData = req.body.edit_data;
		var edit_id = req.body.edit_id;

		db.Insurer.find(edit_id)
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

		db.Insurer.find(delete_id)
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

		db.Insurer.find(detail_id)
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

		db.Insurer.findAndCountAll({
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
	},
}