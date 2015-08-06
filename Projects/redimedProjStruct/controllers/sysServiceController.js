var db = require('../models');
var mdt_functions = require('../mdt-functions.js');
var kiss=require('./kissUtilsController');

module.exports = {
	postByClinicalDepartment: function(req, res){
		var dept_id = req.body.dept_id;

		var sql = 
			" SELECT ss.* FROM cln_dept_services cds                                                  "+
			" INNER JOIN sys_services ss ON ss.SERVICE_ID=cds.SERVICE_ID AND cds.CLINICAL_DEPT_ID=?   "+
			" WHERE ss.`IS_BOOKABLE` = 1 															  "+
			" AND ss.`Isenable` = 1 																  "+
			" ORDER BY ss.`SERVICE_NAME`                                                              ";

		kiss.executeQuery(req,sql,[dept_id],function(list){
			res.json({'status': 'success', 'data': list});
		},function(err){
			res.json({'status': 'error', 'message': error});
		});

	},
	postAdd: function(req, res){
		var postData = req.body.add_data;

		db.sysService.create(postData)
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

		db.sysService.find(edit_id)
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

		db.sysService.find(delete_id)
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

		db.sysService.find(detail_id)
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

		db.sysService.findAndCountAll({
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