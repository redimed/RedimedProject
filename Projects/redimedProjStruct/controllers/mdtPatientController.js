var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	postAdd: function(req, res){
		var postData = req.body;

		db.Patient.create(postData)
		.success(function(created){
			if(!created){
				res.json(500, {"status": "error", "message": "Database Error"});
			}else{
				db.Patient.find({
					order: "Patient_id DESC" 
				})
				.success(function(patient){
					res.json({"status": "success", "data": patient});
				})
			}
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},
	postEdit: function(req, res){
		//POST DUA VAO
		var patient_id = req.body.Patient_id;
		delete req.body.Patient_id;
		var postData = req.body;

		if(patient_id == null)
		{
			console.log("============================",patient_id);
			res.json(500, {"status": "error"});
			return;
			
		}

		db.Patient.find({ where: {Patient_id: patient_id} })
		.success(function(patient){
			if(!patient)
			{
				res.json(500, {"status": "error"});
				return;
			}
			patient.updateAttributes(postData)
			.success(function(updated){
				if(!updated){
					res.json(500, {"status": "error", "message": "Database Error"});
				}else{
					res.json({"status": "success", "data": updated});
				}
			})
			.error(function(err)
			{
				res.json({"status": "error", "error": err});
				console.log(err)
			});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
			console.log(error);
		})
		//END POST
	},
	postById: function(req, res){
		// POST
		var Patient_id = req.body.Patient_id;
		// END POST

		db.Patient.find(Patient_id)
		.success(function(patient){
			if(!patient){
				res.json(500, {"status": "error", "message": "Database Error"});
			}else{
				patient.getCompany().then(function(company){
					res.json({"status": "success", "company": company, "data": patient});
				}, function(error){
					res.json(500, {"status": "error", "message": error});
				})
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

		db.Patient
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
		db.Patient
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