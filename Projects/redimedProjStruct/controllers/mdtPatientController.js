var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	postById: function(req, res){
		// POST
		var Patient_id = req.body.Patient_id;
		// END POST

		db.mdtPatient.find(Patient_id)
		.success(function(patient){
			if(!patient){
				res.json(500, {"status": "error", "message": "Database Error"});
			}else{
				res.json({"status": "success", "data": patient});
			}
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},
	postSearch: function(req, res){
		//POST DUA VAO
		var pagination = req.body.pagination;
		var post_fields = req.body.filters;
		var select = req.body.select;
		//END POST DUA VAO

		var sql = "";
		sql = mdt_functions.commonSearch(post_fields);

		db.mdtPatient
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
	},// end post search
	getDropdown: function(req, res){
		db.mdtPatient
		.findAndCountAll({
			where: {Isenable: 1},
			attributes: ['Patient_id', 'First_name', 'Sur_name']
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