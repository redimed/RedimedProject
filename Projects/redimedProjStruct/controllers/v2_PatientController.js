var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

var Medicare_Rest = require('../helper/Medicare_Rest');
var fs = require('fs');
var mkdirp = require('mkdirp');
var kiss=require('./kissUtilsController');

module.exports ={
	postSearch: function(req,res){
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		var search_data = req.body.search;
		var whereOpt = {};
		for(var key in search_data){
			if(search_data[key]){
				whereOpt[key] = {like: search_data[key]+'%'};
			}
		}
		db.Patient.findAndCountAll({
			where: whereOpt,
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

	postCheckinSearch: function(req,res){
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		var search_data = {};
  		
  		// if(kiss.checkData(req.body.search.First_name))
  		// 	search_data.First_name={'like':kiss.concat('%',req.body.search.First_name,'%')};

  		// if(kiss.checkData(req.body.search.Sur_name))
  		// 	search_data.Sur_name={'like':kiss.concat('%',req.body.search.Sur_name,'%')};
  		
  		// if(kiss.checkData(req.body.search.DOB))
  		// 	search_data.DOB=req.body.search.DOB;

  		if(kiss.checkData(req.body.search.First_name))
  			search_data.First_name=req.body.search.First_name;

  		if(kiss.checkData(req.body.search.Sur_name))
  			search_data.Sur_name=req.body.search.Sur_name;
  		
  		if(kiss.checkData(req.body.search.DOB))
  			search_data.DOB=req.body.search.DOB;



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

	getRedirectPatient : function(req, res) {
		var token = req.query.t;
		var patient_id = req.query.p;
		var cal_id = req.query.c;

		if(!patient_id || !cal_id) {
			res.json({status: 'error'});
			return;
		}
	
		db.User.find({
			where: {
				socket: token
			}
		},{raw:true}).success(function(result){
			if(!result) {
				res.json({cookies: req.cookies, session: req.session})
				return;
			}

			delete result.img;
			var info = JSON.stringify(result);

			var hostname = req.headers.host; //  'localhost:3000'
			info.no_socket = true;

			res.cookie('userInfo', info);
    		res.redirect('http://' + hostname + '/#/patient/appointment/'+ patient_id +'/' + cal_id + '?fromMobile=true');

		})
		.error(function(error){
			res.json({cookies: req.cookies, session: req.session})
		});
	},

	postVerifiedMedicare : function(req, res) {
		var pOption = req.body;
		// var pOption = {
		// 			firstName: 'PAUL',
		// 			lastName: 'KUHN',
		// 			dob: '26121998',
		// 			medicareNo: '3950328551',
		// 			refNo: '1'
		// 		};

		Medicare_Rest.verify_medicare(pOption).then(function(response){
			var data = response.data;
			if(data.status === undefined) {
				res.json({"status": "fail"});
				return;
			}

			if(data.status.code === '0') {
				res.json({"status": "success"});
			} else {
				res.json({"status": "fail"});
			}		
		}, function(err){
			res.json(500, {"status": "error", "message": error});
		})
	},

	uploadUploadAvt: function(req,res){
		var UPLOAD_PATH = db.Patient.getUploadPath();
		var file_name = req.body.file_name;
		var tmp_path = req.files.file.path;
		var target_path = UPLOAD_PATH + file_name;
		console.log("this is body", req.body); 
		console.log("running here 1");
		if(req.body.editMode === 'true'){
			console.log("running here 2");
			file_name = req.body.file_name+ "-" + req.files.file.name;
			target_path = UPLOAD_PATH + file_name;
			db.Patient.find(req.body.patient_id)
			.success(function(patient){
				if(!!patient.avatar && patient.avatar!==""){
					var remove_path = "uploadFile/PatientPicture/"+patient.avatar.split("/")[3];
					fs.exists(remove_path,function(exists){
						if(exists){
							console.log('this is remove path', remove_path);
							fs.unlink(remove_path, function(err){
								if (err) throw err;
							})
						}
					})
				}
				mkdirp(UPLOAD_PATH, function (err) {
					fs.rename(tmp_path, target_path, function(err) {
						if (err) throw err;
			            fs.unlink(tmp_path, function() { // delete 
			            	if (err){ 
			                 console.log(err)
			                 throw err;
			                }
			                res.json({status:"success",img_path:"img/patient/avt/"+file_name, isEditMode:true});
			            });
					});
				});
			})
			.error(function(err){
				res.json(500,{"status": "error", "message": err});
			})
		}
		else{
			mkdirp(UPLOAD_PATH, function (err) {
					fs.rename(tmp_path, target_path, function(err) {
						if (err) throw err;
			            fs.unlink(tmp_path, function() { // delete 
			            	if (err){ 
			                 console.log(err)
			                 throw err;
			                }
			                res.json({status:"success",img_path:"img/patient/avt/"+file_name, isEditMode:false});
			            });
					});
				});
		}
		
		
		
	},
}