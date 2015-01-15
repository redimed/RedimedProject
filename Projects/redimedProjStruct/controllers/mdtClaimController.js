var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	postAddPatient: function(req, res){
		var postData = req.body.add_data;

		var sql = "INSERT INTO cln_patient_claim(Claim_id, Patient_id, CAL_ID, Creation_date, Last_update_date) VALUES("+postData.Claim_id+", "+postData.Patient_id+", "+postData.CAL_ID+", NOW(), NOW())";
		db.sequelize.query(sql)
		.success(function(created){
			res.json({message: 'Insert Successfully'});
		})
		.error(function(error){
			res.json(500, error);
		})
	},
	postAdd: function(req, res){

		var postData = req.body.add_data;
		var CAL_ID = req.body.CAL_ID;
		var Patient_id = req.body.Patient_id;

		var sql_max_id = "SELECT MAX(Claim_id) AS claim_id FROM cln_claims LIMIT 1";
        
		db.Claim.create(postData)
		.success(function(created){
			db.sequelize.query(sql_max_id)
			.success(function(detail){
				var sql_insert_patient = "INSERT INTO cln_patient_claim(Claim_id, Patient_id, CAL_ID, Creation_date, Last_update_date) VALUES("+detail[0].claim_id+", "+Patient_id+", "+CAL_ID+", NOW(), NOW())";
				db.sequelize.query(sql_insert_patient)
				.success(function(created){
					res.json({message: created, 'status':'success', 'data':detail});
				})
				.error(function(error){
					res.json(500, {'status': 'error', 'message': error});		
				})
			})
			.error(function(error){
				res.json(500, {'status': 'error', 'message': error});	
			})
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	},
	postEdit: function(req, res){
		var postData = req.body.edit_data;
		var edit_id = req.body.edit_id;

		db.Claim.find(edit_id)
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

		db.Claim.find(delete_id)
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

		db.Claim.find(detail_id)
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
        console.log('Perpare to call find and count all');
		db.Claim.findAndCountAll({
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