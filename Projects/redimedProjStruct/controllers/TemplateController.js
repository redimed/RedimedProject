var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var S = require('string');
var db = require('../models');
var _ = require('lodash');
var fs = require('fs-extra');
var moment = require('moment');
var https = require('https');
var http = require('http');
var mkdirp = require('mkdirp');

module.exports = {
	postDelete: function(req, res){
		var data = req.body.data;

		var sql = knex('template')
					.where({id: data.id})
					.del().toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows});
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

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
	},

	getTemplate: function(req,res){
		var id = req.params.id;
		var patientId = req.params.patientId;
		var calId = req.params.calId;

		db.sequelize.query("SELECT * FROM template WHERE id = ?",null,{raw:true},[id])
			.success(function(data){
				if(data.length > 0)
				{
					var item = data[0];

					var optionsget = {
					    host : 'testapp.redimed.com.au',
					    port : 3003,
					    path : '/RedimedJavaREST/api/document/template/'+id,
					    method : 'GET' 
					};

					var targetFolder = '.\\uploadFile\\Template\\PatientID-'+patientId;

					mkdirp(targetFolder, function(err) {
		         		if(err)
		         		  return console.log(err);

		         		var file = fs.createWriteStream(targetFolder+'\\'+item.name+".pdf");
						var request = http.get(optionsget, function(response) {
						  response.pipe(file);
						  response.on('end',function(){
						  	res.download(targetFolder+'\\'+item.name+".pdf");
						  })
						});

						request.on('error', function(e) {
						    res.json(500, {error: e});
						});

						request.end();
		         	});
				}
			})
			.error(function(error){
				res.json(500, {error: error});
			})		
	}
}