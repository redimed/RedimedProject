var knex = require('../knex-connect.js');
var db = require('../models');

module.exports = {

	postList: function(req, res){

		var postData = req.body.data;

		var sql = knex
		.column('cln_scripts.ID',
		'cln_scripts.Patient_id',
		'cln_scripts.CAL_ID',
		'cln_scripts.scriptNum',
		'cln_scripts.Medicare',
		'cln_patients.First_name',
		'cln_patients.Sur_name',
		'cln_scripts.Creation_date')
		.from('cln_scripts')
		.innerJoin('cln_patients', 'cln_scripts.Patient_id', 'cln_patients.Patient_id')
		.where(knex.raw('IFNULL(cln_scripts.scriptNum, "") LIKE "%' + postData.scriptNum + '%"'))
		.where(knex.raw('IFNULL(cln_scripts.Medicare, "") LIKE "%' + postData.Medicare + '%"'))
		.where({'cln_scripts.Patient_id': postData.Patient_id, 'cln_scripts.CAL_ID': postData.CAL_ID})
		.orderBy('cln_scripts.Creation_date', postData.Creation_date)
		.limit(postData.limit)
		.offset(postData.offset)
		.toString();

		var sql_count = knex
		.column('cln_scripts.ID',
		'cln_scripts.Patient_id',
		'cln_scripts.CAL_ID',
		'cln_scripts.scriptNum',
		'cln_scripts.Medicare',
		'cln_patients.First_name',
		'cln_patients.Sur_name',
		'cln_scripts.Creation_date')
		.from('cln_scripts')
		.innerJoin('cln_patients', 'cln_scripts.Patient_id', 'cln_patients.Patient_id')
		.where({'cln_scripts.Patient_id': postData.Patient_id, 'cln_scripts.CAL_ID': postData.CAL_ID})
		.count('cln_scripts.ID as a')
		.toString();
		db.sequelize.query(sql)
		.success(function(data){
			db.sequelize.query(sql_count)
			.success(function(count){
				res.json({data: data, count: count[0].a});
			})
			.error(function(error){
				res.json(500, {'status': 'error', 'message': error});
			})
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	},//end postList

	postAdd: function(req, res){

		var postData = req.body.data;
		console.log(postData);
		var sql = knex('cln_scripts')
		.insert(postData)
		.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({'data': data});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})

	},//end postAdd

	postById: function(req, res){

		var postData = req.body.data;

		var sql = knex('cln_scripts')
		.where({
			ID: postData
		})
		.toString();

		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data[0]});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})

	},//end postByid

	postEdit: function(req, res){

		var postData = req.body.data;

		var sql = knex('cln_scripts')
		.where({
			ID: postData.ID
		})
		.update(postData)
		.toString();

		console.log(sql);

		db.sequelize.query(sql)
		.success(function(data){
			res.json({'data': data});
		})
		.error(function(error){
			res.json({'status': 'error', 'message': error});
		})

	}, //end postEdit

	postRemove: function(req, res){

		var postData = req.body.data;
		console.log(postData);
		var sql = knex('cln_scripts')
		.where({
			ID: postData
		})
		.del()
		.toString();
		console.log(sql);
		db.sequelize.query(sql)
		.success(function(data){
			res.json({'data': data});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	}

}