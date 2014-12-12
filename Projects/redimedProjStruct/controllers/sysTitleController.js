var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	postAdd: function(req, res){
		var postData = req.body.add_data;

		db.sysTitle.create(postData)
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

		db.sysTitle.find(edit_id)
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

		db.sysTitle.find(delete_id)
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

		db.sysTitle.find(detail_id)
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

		db.sysTitle.findAndCountAll({
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
	getList: function(req, res){
		db.sysTitle.findAll()
		.success(function(list){
			res.json({'status': 'success', 'data': list});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});	
		})
	}
}