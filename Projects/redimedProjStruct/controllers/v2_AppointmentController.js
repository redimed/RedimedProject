var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

var InvoiceLineModel = require('../v1_models/Cln_invoice_lines.js');

module.exports = {

	postInit: function(req, res) {
		var patient_id = req.body.patient_id;
		var cal_id = req.body.cal_id;
		var appt = null, patient = null, patient_claim = null;

		// GET APPT DEPTAIL
		db.Appointment.find({
			where: {CAL_ID: cal_id},
		}).then(function(data){
			appt = data;
			if( !appt) {
				res.json(500, {"status": "error", "message": 'Cannot found Appointment'});
				return;
			}
			// GET PATIENT DETAIL 
			return db.Patient.find(patient_id);
		}).then(function(data){
			patient = data;
			if( !patient) {
				res.json(500, {"status": "error", "message": 'Cannot found Patient'});
				return;
			}

			// GET PATIENT CLAIM DETAIL
			return db.mdtPatientClaim.find({
				where: {Patient_id: patient_id, CAL_ID: cal_id},
				include: [
					{ model: db.Claim , as: 'Claim' },
				]
			});
		})
		.then(function(data) {
			patient_claim = data;
			
			// GET INVOICE HEADER 
			return db.mdtInvoiceHeader.find({
				where: {
					cal_id: cal_id,
					Patient_id: patient_id
				}
			});
		})
		.then(function(header){
			var insurer_id = null, company_id = null;

			company_id = patient.company_id;
			if(patient_claim && patient_claim.claim) {
				insurer_id = patient_claim.insurer_site;
			}

			var invoice_header = {
				cal_id: cal_id,
				Patient_id: patient_id,
				Company_id: company_id,
				Insurer_id: insurer_id,
				DOCTOR_ID: appt.DOCTOR_ID,
				SERVICE_ID: appt.SERVICE_ID,
				SITE_ID: appt.SITE_ID,
				DEPT_ID: appt.CLINICAL_DEPT_ID,
				STATUS: 'enter'
			}

			// INSERT OR UPDATE
			if(!header) {
				return db.mdtInvoiceHeader.create(invoice_header);
			} else {
				return db.mdtInvoiceHeader.update(invoice_header, {
		            header_id: header.header_id
		        });
			}
		})
		.then(function(data){
			res.json({status: 'success', data: data});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postEnd: function(req, res) {
		// var header_id = 1;
		// var cal_id = 25626;
		// var patient_id = 469;

		var patient_id = req.body.patient_id;
		var cal_id = req.body.cal_id;
		

		db.mdtInvoiceHeader.find({
			where: {
				cal_id: cal_id,
				Patient_id: patient_id
			}
		}).then(function(data) {
			if(!data || !data.header_id) {
				res.json(500, {"status": "error", "message": 'Cannot found `Invoice header`'});
				return;
			}
			var header_id = data.header_id;
			var sql = InvoiceLineModel.sql_insert_from_appt_items(header_id, cal_id, patient_id);
			return db.sequelize.query(sql);
		})
		.then(function(data){
			res.json({status: 'success', data: data});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	getDetail: function(req, res){

		var id = req.query.id;

		db.Appointment.find({
			where: {CAL_ID: id},
			include: [
				{
					model: db.Doctor, as: 'Doctor',
					attributes: ['NAME']
				},
				{model: db.Department, as: 'Department'},
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


	}
}