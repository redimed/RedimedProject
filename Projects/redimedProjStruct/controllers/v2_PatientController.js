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
    		res.redirect('http://' + hostname + '/#/patient/appointment/'+ patient_id +'/' + cal_id);
		})
		.error(function(error){
			res.json({cookies: req.cookies, session: req.session})
		});
	}}