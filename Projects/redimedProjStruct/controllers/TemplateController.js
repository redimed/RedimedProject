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
				.orderBy('Creation_date', 'desc')
				.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows});	
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	postWrite: function(req, res){
		var postData = req.body.data;
		var insert_data = {
			name: postData.name,
			content: postData.content
		}

		var sql = knex('cln_template_temp')
				.insert(insert_data)
				.toString();

		db.sequelize.query(sql)
		.success(function(created){
			var sub_sql = knex('cln_template_temp')
						.max('id as id')
						.select('name')
						.toString();

			db.sequelize.query(sub_sql)
			.success(function(rows){
				res.json({data: rows[0]});
			})
			.error(function(error){
				res.json(500, {error: error});
			})	
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	getTemplate: function(req,res){
		var id = req.params.id;
		var patientId = req.params.patientId;
		var calId = req.params.calId;

		var optionsget = {
		    host : 'testapp.redimed.com.au',
		    port : 3003,
		    path : '/RedimedJavaREST/api/document/template/'+id,
		    method : 'GET' 
		};

		var now = moment().format('YYYY-MM-DD');

		/* INSERT INTO DOCUMENT */
		var document_insert = {
			patient_id: patientId,
			cal_id: calId,
			document_path: 'uploadFile/Template/PatientID-'+patientId,
			document_name: null,
			Creation_date: now,
			Last_update_date: now
		}

		/* END INSERT INTO DOCUMENT */

		var targetFolder = '.\\uploadFile\\Template\\PatientID-'+patientId;

		var sql = knex('cln_template_temp')
				.where({id: id})
				.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			document_insert.document_name = rows[0].name+".pdf";
			var document_sql = knex('cln_appt_document')
							.insert(document_insert)
							.toString();

			db.sequelize.query(document_sql)
			.success(function(created){
				mkdirp(targetFolder, function(err) {
		     		if(err)
		     		  return console.log(err);

		     		var file = fs.createWriteStream(targetFolder+'\\'+rows[0].name+".pdf");
					var request = http.get(optionsget, function(response) {
					  response.pipe(file);
					  response.on('end',function(){
					  	res.download(targetFolder+'\\'+rows[0].name+".pdf");
					  })
					});

					request.on('error', function(e) {
					    res.json(500, {error: e});
					});

					request.end();
		     	});
			})
			.error(function(error){
				res.json(500, {error: error});
			})
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	}
}