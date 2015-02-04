var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports ={
	postSearch: function(req,res){
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		var search_data = req.body.search;
		db.Patient.findAndCountAll({
			where: search_data,
			offset: offset,
			limit: limit,
			attributes: ['Patient_id','First_name','Sur_name','DOB','Address1','Post_code'],
			order: 'Patient_id DESC'
		}).success(function(result){
			res.json({'status':'success', 'list':result.rows, 'count':result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	
}