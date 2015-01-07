var db = require('../models');

module.exports = {
	postGroupSearch: function(req, res) {

        var patient_id = req.body.patient_id;
        var whereOpt = {patient_id : patient_id};

		db.ThAssessmentGroup.findAll({
			where: whereOpt,
			attributes: ['group_id', 'title'],
			include: [
				{ 
					model: db.WaWorkCoverFirst , as: 'WaWorkCoverFirst',
					attributes: ['Ass_id'],
				},
				{ 
					model: db.WaWorkCoverProgress , as: 'WaWorkCoverProgress',
					attributes: ['progress_id'],
				},
				{ 
					model: db.WaWorkCoverFinal , as: 'WaWorkCoverFinal',
					attributes: ['id'],
				},
			],
			order: 'group_id DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postSearch: function(req, res) {
		// var limit = (req.body.limit) ? req.body.limit : 10;
  //       var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		var search_data = req.body.search;

		var type = search_data.type;
		var patient_id = search_data.patient_id;
		var key = null;

		switch(type) {
			case 'first':
				key = 'WaWorkCoverFirst'; 
				break;
			case 'progress':
				key = 'WaWorkCoverProgress'; 
				break;
			case 'final':
				key = 'WaWorkCoverFinal'; 
				break;
		}

		if(!key || !patient_id ) {
			res.json(500, {"status": "error", "message": "Missing parameters "});
		}

		// var agrs = [];
		// for (var key in search_data) {
		// 	if(search_data[key])
		// 	agrs.push(key + " = '"+ search_data[key] +"'");
		// };
		// var whereOpt = agrs.length ? db.Sequelize.and.apply(null, agrs) : null;

		db[key].findAll({
			where: {patient_id: patient_id},
			// offset: offset,
			// limit: limit,
			attributes: fields,
			order: 'Creation_date DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result, "count": result.length});
		}).error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	}, 
}