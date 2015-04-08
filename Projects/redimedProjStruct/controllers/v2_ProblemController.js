var db = require('../models');

module.exports = {

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

		db.Problem.findAndCountAll({
			where: whereOpt,
			offset: offset,
			limit: limit,
			attributes: fields,
			order: 'Problem_id DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postInsert: function (req, res) {
        console.log('this is postData', req.body);
        var postData = req.body;
        db.Problem.create(postData)
            .success(function (created) {
                if (!created) res.json(500, {
                    'status': 'error',
                    'message': 'Cannot Insert'
                });
                res.json({
                    'status': 'success',
                    'data': created
                });
            })
            .error(function (error) {
                res.json(500, {
                    'status': 'error',
                    'message': error
                });
            })
    },

    postDetail: function (req, res) {
        var id = req.body.ID;
        db.Problem.find(id)
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
            });

    },

    postUpdate: function (req, res) {
        var postData = req.body;
        console.log('this is post data', postData);
        var id = postData.Problem_id;
        delete postData.Problem_id;

        db.Problem.update(postData, {
            Problem_id: id
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

    postSearchPatientAllergy: function(){
        var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
        var fields = req.body.fields;
        // var patient_id = req.body.search.Patient_id;
        
        var sql = "SELECT `cln_allergies`.`allergy_id`, `cln_allergies`.`allergy_name` FROM `cln_allergies`"
                  +"INNER JOIN `cln_patient_allergies` ON `cln_allergies`.`allergy_id` = `cln_patient_allergies`.`allergy_id`"
                  +"WHERE `cln_patient_allergies`.`patient_id` = "+patient_id;
        
        

        db.Problem.findAndCountAll({
            where: whereOpt,
            offset: offset,
            limit: limit,
            attributes: fields,
            order: 'Problem_id DESC'
        }).success(function(result){
            res.json({"status": "success", "list": result.rows, "count": result.count});
        })
        .error(function(error){
            res.json(500, {"status": "error", "message": error});
        });
    }
}
