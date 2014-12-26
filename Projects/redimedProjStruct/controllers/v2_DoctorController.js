var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	postCalendarByDate: function(req, res) {


		var date = req.body.date;
		var doctor_id = req.body.doctor_id; 
		if(!date) {
			// current date;
			date = mdt_functions.nowDateDatabase();
		}

		db.Appointment.findAll({
			where: {
				DOCTOR_ID: doctor_id,
				Patient_id: {ne: null},
				FROM_TIME: { rlike: date },

			}
		}).success(function(data){

			res.json({list: data, status: 'success'})
		}).error(function(err) {
			console.log(err);
			res.json(500, {"status": "error", "error": error});
		})

	},

	getListItems: function(req, res){
		var id = req.query.id; 

		db.Doctor.find({
			where: {doctor_id: id},
			attributes: ['doctor_id', 'CLINICAL_DEPT_ID'],
		}).then(function(doctor){
			return db.Department.find({
				where: {CLINICAL_DEPT_ID: doctor.CLINICAL_DEPT_ID},
				attributes: ['CLINICAL_DEPT_ID', 'CLINICAL_DEPT_NAME'],
				include: [
					{ 
						model: db.InvItemHeader , as: 'ItemLists',
						attributes: ['POPULAR_HEADER_ID', 'POPULAR_CODE', 'POPULAR_NAME'],
					    include: [
					    	{
								model: db.InvItem,  as: 'Items',
								attributes: ['ITEM_ID', 'ITEM_NAME', 'ITEM_CODE']
							}
						],
						order: ['POPULAR_HEADER_ID']
					},
				]
			});
		}). then(function(dept){
			if(!dept) {
				res.json(500, {"status": "error"});
				return;
			}

			res.json({'status': 'success', data: dept.itemLists});
		}, function(error){
			res.json(500, {"status": "error", "message": error});
		})
	},
    
    postSearch: function(req, res){
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		var search_data = req.body.search;
		console.log('this is search data', search_data);
		var agrs = [];
		for (var key in search_data) {
			if(search_data[key])
			agrs.push(key + " = '"+ search_data[key] +"'");
		};

		var whereOpt = agrs.length ? db.Sequelize.and.apply(null, agrs) : null;

		db.mdtDoctor.findAndCountAll({
			where: whereOpt,
			offset: offset,
			limit: limit,
			attributes: fields,
            
			order: 'NAME ASC',
            include: [
					{ 
						model: db.mdtSpecialty , as: 'Specialties',
//						attributes: ['POPULAR_HEADER_ID', 'POPULAR_CODE', 'POPULAR_NAME'],
				
					},
				]

		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},
}