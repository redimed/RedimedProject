var db = require('../models');

var ERP_REST = require('../helper/ERP_Rest');

var inc_common_model =  [
	{ 
		model: db.Company , as: 'Company',
		attributes: ['Company_name'],
	},
	{ 
		model: db.Insurer , as: 'Insurer',
		attributes: ['insurer_name'],
	},
	{ 
		model: db.mdtRedimedsites , as: 'Site',
		attributes: ['Site_name'],
	},
	{ 
		model: db.Doctor , as: 'Doctor',
		attributes: ['NAME'],
	},
	{ 
		model: db.SysServices , as: 'Service',
		attributes: ['SERVICE_NAME'],
	},
];

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
			var insurer_id = null, company_id = null, claim_id = null;

			company_id = patient.company_id;
			if(patient_claim && patient_claim.claim) {
				insurer_id = patient_claim.claim.insurer_site;
				claim_id = patient_claim.Claim_id;
			}

			var invoice_header = {
				cal_id: cal_id,
				claim_id: claim_id,
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

	postSearch: function(req, res) {
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;

		var search_data = req.body.search;
		var whereOpt = {};


		
		if(search_data && search_data.patient_id) {
			whereOpt.Patient_id = search_data.patient_id;
			var inc_model = inc_common_model;
		} else {
			var inc_model = inc_common_model.concat([
				{
					model: db.Patient , as: 'Patient',
					attributes: ['Title', 'First_name', 'Sur_name']
				}
			]);

			if(search_data.STATUS) { // equal
				whereOpt.STATUS = search_data.STATUS;
			}

		}

		db.mdtInvoiceHeader.findAndCountAll({
			where: whereOpt,
			offset: offset,
			limit: limit,
			attributes: fields,
			include: inc_model,
			order: 'HEADER_ID DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},
	postDetail: function(req, res) {
		var header_id = req.body.header_id;
		var inc_model = inc_common_model.concat([
			{ 
				model: db.Department , as: 'Department',
				attributes: ['CLINICAL_DEPT_NAME']
			},
			{
				model: db.Patient, as: 'Patient',
				attributes: ['Title', 'Sur_name', 'First_name', 'Middle_name']
			},
			{
				model: db.Claim, as: 'Claim', attributes: ['Injury_name']
			},
			{ 
				model: db.mdtInvoiceLine , as: 'Lines',
				include:   [
					{ 
						model: db.InvItem , as: 'InvItem',
						attributes: ['ITEM_CODE']
					},
				]
			}
		]);
		db.mdtInvoiceHeader.find({
			where: {header_id: header_id},
			include: inc_model
		}).success(function(result){
			res.json({"status": "success", "data": result});
		})
		.error(function(error){
			console.log(error)
			res.json(500, {"status": "error", "message": error});
		});
	},
	postUpdate: function(req, res) {
	 	var postData = req.body.data;	
        var header_id =  req.body.header_id;

        db.mdtInvoiceHeader.find({
        	where: {header_id: header_id},
        }).then(function(header){
        	if(!header) {
        		res.json(500, {"status": "error", "message": 'Missing Header' });
        		return;
        	}

            return header.updateAttributes(postData);
        }).then(function (data) {
	        res.json({"status": "success", "data": data});
	    }).error(function (error) {
            res.json(500, {"status": "error", "message": error });
        })	
	},

	postAdd: function(req, res){
		var postData = req.body.data;	
		var lines = postData.lines;

		var amount = 0;
		for(var i = 0, len = lines.length; i < len; ++i) {
 			var line = lines[i];
 			line.AMOUNT = line.QUANTITY * line.PRICE;
 			amount += line.AMOUNT ;
 		} 
 		postData.AMOUNT = amount;

		db.mdtInvoiceHeader.create(postData)
		.success(function (header) {
			var header_id = header.header_id;
			for(var i = 0, len = lines.length; i < len; ++i) {
	 			lines[i].HEADER_ID = header_id;
	 		} 
			return db.mdtInvoiceLine.bulkCreate(lines)
		})
		.success(function(create){
			res.json({status: 'success'});
		})
		.error(function (error) {
            res.json(500, {'status': 'error','message': error });
        })
	},

	postSave : function(req, res) {
		var header_id = req.body.header_id;	
		var inv_status = req.body.status;
		var header = null;
		db.mdtInvoiceHeader.find({
			where: {header_id: header_id},
			include: [
				{ 
					model: db.mdtInvoiceLine , as: 'Lines',
					include: [
						{
							model: db.InvItem, as: 'InvItem',
						},
					]
				},
				{
					model: db.Company, as: 'Company',
				},
				{
					model: db.Insurer, as: 'Insurer',
				},
				{	
					model: db.mdtRedimedsites, as: 'Site',
				}, 
				{	
					model: db.Patient, as: 'Patient',
				},
			]
		}).then(function(iheader){
			header = iheader;
			if(!header || !header.lines) {
				res.json(500, {"status": "error", "message": 'Missing header / lines'});
				return;
			}
			var amount = header.getAmount();
	 		return db.mdtInvoiceHeader.update({AMOUNT: amount, STATUS: inv_status}, {
	            header_id: header_id
	        });
		}).then(function(updated){
			// SEND TO ERP

			ERP_REST.push_customer(header).then(function(response){
				response.data = JSON.parse(response.data);
				if(response.data.APEX_STATUS == 'success') {
					ERP_REST.push_items(header).then(function(response){
						res.json({"status": "success", "data": response});
					}, function(err){
						console.log('ERROR: ', err)
						res.json({"status": "error", "message": err});
					})
				} else {
					res.json({"status": "error", "message": 'Can not push customer to ERP !!!'});
				}
			}, function(err){
				res.json({err: err})
			})
			// END SEND TO ERP
			
		}).error(function(error){
			console.log(error)
			res.json(500, {"status": "error", "message": error});
		});
	},

	getTest: function (req, res) {

		ERP_REST.get_all_invoice_line().then(function(response){
			console.log(response)
			res.json(response)
		}, function(err){
			res.json({err: err})
		});
	}
}