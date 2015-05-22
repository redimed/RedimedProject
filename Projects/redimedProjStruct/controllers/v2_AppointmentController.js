var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

var InvoiceLineModel = require('../v1_models/Cln_invoice_lines.js');

module.exports = {

	getDetail: function(req, res){

		var id = req.query.id;

		db.Appointment.find({
			where: {CAL_ID: id},
			include: [
				{
					model: db.Doctor, as: 'Doctor',
					attributes: ['NAME']
				},
				{
					model: db.SysServices, as: 'Service'
				},
				{
					model: db.mdtRedimedsites, as: 'Site',
					attributes:['Site_name']
				}
			]
		}).success(function(appt){
			if(!appt) {
				res.json(500, {"status": "error"});
				return;
			}
			res.json({'status': 'success', data: appt});
		}) .error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postItemFeeAppt: function(req, res) {
		var list_id = req.body.list_id;
		var service_id = req.body.service_id; 
		// var list_id =  [29199, 29175, 34929, 34931, 34903, 34905];
		// var service_id = req.query.id; 

		db.SysServices.find({
			where: {SERVICE_ID: service_id},
			attributes: ['SERVICE_ID', 'FEE_TYPE_ID']
		})
		.success(function(service){
			if(!service || !service.FEE_TYPE_ID) {
				res.json(500, {status: 'error', message: 'Not found service or Type !!!'})
				return;
			}
			db.mdtClnItemFee.findAll({
				where: {
					FEE_TYPE_ID: service.FEE_TYPE_ID,
					CLN_ITEM_ID: list_id
				}
				
			}).success(function(fee_type){
				res.json({status: 'success', list: fee_type});
			})
		})
		.error(function( err ){
			console.log(err);
			res.json(500, {status: 'error', error: err})
		})
	},

	postUpdate: function(req, res) {
		var id = req.body.cal_id;
		var postData = req.body.data;

		 db.Appointment.update(postData, {
            CAL_ID: id
        })
        .success(function (data) {
            res.json({
                "status": "success",
                "data": data
            });
        })
        .error(function (error) {
            res.json(500, {
                "status": "error",
                "message": error
            });
        })
	},

	postApptById: function(req,res){
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		var whereCon = req.body.search;

		db.ApptPatient.findAndCountAll({
			attributes: ['CAL_ID', 'Patient_id', 'appt_status'],
			include:{
				model:db.Appointment, as: 'Appointment',
				attributes:['FROM_TIME']
			},
			where:whereCon,
			offset: offset,
			limit: limit,
			order:'CAL_ID DESC'
		}).success(function(result){
			res.json({'status':'success', 'list':result.rows, 'count':result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	// postTodayAppt: function(req,res){
	// 	var limit = (req.body.limit) ? req.body.limit : 10;
 //        var offset = (req.body.offset) ? req.body.offset : 0;
	// 	var fields = req.body.fields;

	// 	var today = mdt_functions.getTodayRange();
	// 	db.ApptPatient.findAll({
	// 		attributes:['CAL_ID','Patient_id','appt_status'],
	// 		include:[
	// 			{
	// 				model:db.Appointment, as:'Appointment',
	// 				attributes:['FROM_TIME'],
	// 				where:{
	// 					FROM_TIME:{
	// 						between: [today.todayStart,today.todayEnd]
	// 					}
	// 				}
	// 			},
	// 			{
	// 				model:db.Patient, as:'Patient',
	// 				attributes:['First_name','Sur_name','DOB'],
	// 			}
	// 		],
	// 	})
	// 	.success(function(result){
	// 		res.json({'status':'success', list:result});
	// 	})
	// 	.error(function(error){
	// 		res.json(500, {"status": "error", "message": error});
	// 	});
	// },

	// postCheckinSearch: function(req,res){
	// 	var limit = (req.body.limit) ? req.body.limit : 10;
 //        var offset = (req.body.offset) ? req.body.offset : 0;
	// 	var fields = req.body.fields;
	// 	res.end();
	// },

	postCheckIn: function(req, res) {
		var cal_id = req.body.CAL_ID;
		var patient_id = req.body.Patient_id;
		var postData = req.body.data;

		 db.ApptPatient.update(postData, {
            CAL_ID: cal_id,
            Patient_id: patient_id
        })
        .success(function (data) {
            res.json({
                "status": "success",
                "data": data
            });
        })
        .error(function (error) {
            res.json(500, {
                "status": "error",
                "message": error
            });
        })
	},
}