var db = require('../models');

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
	postSearch: function(req, res) {
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;

		var search_data = req.body.search;
		var whereOpt = {Patient_id: search_data.patient_id};

		db.mdtInvoiceHeader.findAndCountAll({
			where: whereOpt,
			offset: offset,
			limit: limit,
			attributes: fields,
			include: inc_common_model,
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
			},
			{
				model: db.Patient, as: 'Patient'
			},
			{ 
				model: db.mdtInvoiceLine , as: 'Lines',
				include:   [
					{ 
						model: db.InvItem , as: 'InvItem'
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
	postSave : function(req, res) {
		var header_id = req.body.header_id;	

		db.mdtInvoiceHeader.find({
			where: {header_id: header_id},
			include: [
				{ 
					model: db.mdtInvoiceLine , as: 'Lines',
				}
			]
		}).then(function(header){
			if(!header || !header.lines) {
				res.json(500, {"status": "error", "message": 'Missing header / lines'});
				return;
			}

			var lines = header.lines.filter(function(item){
	 			return item.IS_ENABLE == 1;
	 		});
			var amount = 0;
			for(var i = 0, len = lines.length; i < len; ++i) {
	 			var line = lines[i];
	 			amount +=  line.AMOUNT;
	 		}

	 		return db.mdtInvoiceHeader.update({AMOUNT: amount}, {
	            header_id: header_id
	        });
		}).then(function(updated){
			res.json({"status": "success", "data": updated});
		}).error(function(error){
			console.log(error)
			res.json(500, {"status": "error", "message": error});
		});

	}
}