var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	postSearch: function(req, res){
		//POST DUA VAO
		var pagination = req.body.pagination;
		var post_fields = req.body.filters;
		var select = req.body.select;
		//END POST DUA VAO

		var sql = "";
		sql = mdt_functions.commonSearch(post_fields);

		db.mdtWaitingList
		.findAndCountAll({
			where: [sql],
			offset: pagination.offset,
			limit: pagination.limit,
			attributes: select,
			order: 'Creation_date DESC'
		})
		.success(function(result){
			if(!result){
				res.json({"status": "error", "message": "Database Error"});
			}else{
				res.json({"status": "success", "data": result.rows, "count": result.count});
			}
		})
		.error(function(error){
			res.json({"status": "error", "message": "Internal Server Error"});
		})
	}, // end post search

	postAdd: function(req, res){
		//POST DUA VAO
		var postData = req.body;
		delete postData.id;
		//END POST DUA VAO

		db.mdtWaitingList
		.create(postData)
		.success(function(created){
			if(!created){
				res.json(500, {status: 'error', message: 'Cannot Insert Successfully'});
			}else{
				res.json({status: 'success', created: created});
			}
		})
		.error(function(error){
			res.json(500, {status:'error', message: 'Cannot Insert Successfully in server', error: error});
		})
	}
}