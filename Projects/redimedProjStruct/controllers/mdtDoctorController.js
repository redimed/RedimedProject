var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	test: function(req, res){

		var post_fields = [{'type': 'text', value: '', name: 'Specialties_name'}];
		var sql = mdt_functions.commonSearch(post_fields);

		db.mdtDoctor.find({
			where: {doctor_id: 1},
		})
		.success(function(list){
			list.getSpecialties({ where: [sql], limit: 2, offset:0 }).then(function(specialties){
				res.json({specialties: specialties});
			})
		});
	},

	postAdd: function(req, res){
		var postData = req.body.add_data;

		db.mdtDoctor.create(postData)
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

		db.mdtDoctor.find(edit_id)
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

		db.mdtDoctor.find(delete_id)
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

		db.mdtDoctor.find(detail_id)
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

		db.mdtDoctor.findAndCountAll({
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
	postListSpeciality: function(req, res){
		var pagination = req.body.pagination;
		var post_fields = req.body.filters;
		var doctor_id = req.body.doctor_id?req.body.doctor_id:0;

		var sql = mdt_functions.commonSearch(post_fields);

		//var sql_where = "SELECT spe.*, doc_spe";

		//SELECT `cln_specialties`.*, `doctor_specialities`.`Creation_date` as `doctor_specialities.Creation_date`, `doctor_specialities`.`Last_update_date` as `doctor_specialities.Last_update_date`, `doctor_specialities`.`Specialties_id` as `doctor_specialities.Specialties_id`, `doctor_specialities`.`doctor_id` as `doctor_specialities.doctor_id` FROM `cln_specialties`, `doctor_specialities` WHERE `doctor_specialities`.`doctor_id` = 1 AND `doctor_specialities`.`Specialties_id` = `cln_specialties`.`Specialties_id` AND IFNULL(Specialties_name, '') LIKE '%' AND IFNULL(RL_TYPE_ID, '') LIKE '%' AND IFNULL(cln_specialties.Isenable, '') LIKE '%1%' LIMIT 5

		db.mdtDoctor.find({
			where: {doctor_id: doctor_id}
		})
		.success(function(list){
			list.getSpecialties().then(function(count){				
				list.getSpecialties({ where: [sql], limit: pagination.limit, offset: pagination.offset}).then(function(specialties){
					res.json({status: 'success', data: specialties, count: count.length});
				})
			})
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});	
		})
	}
}