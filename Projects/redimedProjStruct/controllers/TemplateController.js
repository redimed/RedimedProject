var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var S = require('string');
var db = require('../models');
var _ = require('lodash');
var fs = require('fs');
var moment = require('moment');

module.exports = {
	postOne: function(req, res){
		var data = req.body.data;

		var sql = knex('template')
					.select()
					.where({id: data.id})
					.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows});
		})
		.error(function(error){
			res.json(500, {error: error});
		})		
	},

	postUpload: function(req, res){
		
		fs.readFile(req.files.file.path, 'utf8', function (err,data) {
		  if (err) {
		    return console.log(err);
		  }
		  console.log(data);
		});
	},

	postEdit: function(req, res){
		var data = req.body.data;

		var now = moment().format('YYYY-MM-DD');

		var sql = knex('template')
					.where({id: data.id})
					.update({
						name: data.name,
						content: data.content,
						Last_update_date: now
					})
					.toString();

		db.sequelize.query(sql)
		.success(function(updated){
			res.json({data: updated});	
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	postAdd: function(req, res){
		var data = req.body.data;

		var now = moment().format('YYYY-MM-DD');

		var sql = knex('template')
					.insert({
						NAME: data.name,
						content: data.content,
						Creation_date: now,
						Last_update_date: now,
						Created_by: data.user_id,
						Last_updated_by: data.user_id
					})
					.toString();

		db.sequelize.query(sql)
		.success(function(created){
			res.json({data: created});	
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	postList: function(req, res){
		var sql = knex('template')
				.select()
				.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows});	
		})
		.error(function(error){
			res.json(500, {error: error});
		})			
	}
}