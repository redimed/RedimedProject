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

		db.Doctor
		.findAndCountAll({
			where: [sql],
			offset: pagination.offset,
			limit: pagination.limit,
			attributes: select,
			order: 'Creation_date DESC'
		})
		.success(function(result){
			if(!result){
				res.json(500, {"status": "error", "message": "Database Error"});
			}else{
				res.json({"status": "success", "data": result.rows, "count": result.count});
			}
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})
	},// end post search

	getDropdown: function(req, res){
		db.Doctor
		.findAndCountAll({
			where: {Isenable: 1},
			attributes: ['doctor_id', 'NAME']
		})
		.success(function(result){
			if(!result){
				res.json(500, {"status": "error", "message": "Database Error"});
			}else{
				res.json({"status": "success", "data": result.rows, "count": result.count});
			}
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})
	}
}