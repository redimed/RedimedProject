var db = require('../models');

module.exports = {

	postSearch: function(req, res){
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		var search_data = req.body.search;
		console.log('this is search data', req.body);
		var agrs = [];
		for (var key in search_data) {
			if(search_data[key])
    			agrs.push(key + " = '"+ search_data[key] +"'");
		};

		var whereOpt = agrs.length ? db.Sequelize.and.apply(null, agrs) : null;

		db.Allergy.findAndCountAll({
			where: whereOpt,
			offset: offset,
			limit: limit,
			attributes: fields,
			order: 'allergy_id DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postInsert: function (req, res) {
        var postData = req.body;
        db.Allergy.create(postData)
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
        db.Allergy.find(id)
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
        var id = postData.allergy_id;
        delete postData.allergy_id;

        db.Allergy.update(postData, {
            allergy_id: id
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
    

    
    postSearchPatientAllergy: function(req,res){
        console.log('this is req body',req.body);
        var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
        var patient_id = req.body.search.Patient_id;
        var sql = "SELECT `cln_allergies`.`allergy_id`, `cln_allergies`.`allergy_name` FROM `cln_allergies` "
                +"INNER JOIN `cln_patient_allergies` ON `cln_allergies`.`allergy_id` = `cln_patient_allergies`.`allergy_id` "
                +"WHERE `cln_patient_allergies`.`patient_id` = " + patient_id;
        if(req.body.search.allergy_name){
             sql += (" AND `cln_allergies`.`allergy_name` LIKE '%"+req.body.search.allergy_name+"%' ");
        }
           
        sql+=(" ORDER BY `cln_allergies`.`allergy_id` DESC"
             +" LIMIT " + offset + ", "+limit);
        db.sequelize.query(sql)
        .success(function(result){
            var sql2 = "SELECT COUNT(*) as `count` FROM `cln_allergies` "
                +"INNER JOIN `cln_patient_allergies` ON `cln_allergies`.`allergy_id` = `cln_patient_allergies`.`allergy_id` "
                +"WHERE `cln_patient_allergies`.`patient_id` = " + patient_id;
            if(req.body.search.allergy_name)
                sql2 += (" AND `cln_allergies`.`allergy_name` LIKE '%"+req.body.search.allergy_name+"%' ");
            db.sequelize.query(sql2)
            .success(function(result2){
                res.json({"status": "success", "list": result, "count": result2[0].count});
            })
            .error(function(error){
                res.json(500, {"status": "error", "message": error});
            });

            // re
        })
        .error(function(error){
            res.json(500, {"status": "error", "message": error});
        });

    },

    postSearchRemainAllergy: function(req,res){
        console.log('this is req body',req.body);
        var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
        var patient_id = req.body.search.Patient_id;
        var sql = "SELECT * FROM `cln_allergies` WHERE `cln_allergies`.`allergy_id` NOT IN "
                  +"(SELECT `allergy_id` FROM `cln_patient_allergies` WHERE `cln_patient_allergies`.`patient_id` = "+patient_id+")";
        if(req.body.search.allergy_name){
             sql += (" AND `cln_allergies`.`allergy_name` LIKE '%"+req.body.search.allergy_name+"%' ");
        }
           
        sql+=(" ORDER BY `cln_allergies`.`allergy_id` DESC"
             +" LIMIT " + offset + ", "+limit);
        db.sequelize.query(sql)
        .success(function(result){
            var sql2 = "SELECT COUNT(*) AS `count` FROM `cln_allergies` WHERE `cln_allergies`.`allergy_id` NOT IN "
                  +"(SELECT `allergy_id` FROM `cln_patient_allergies` WHERE `cln_patient_allergies`.`patient_id` ="+patient_id+")";
            if(req.body.search.allergy_name)
                sql2 += (" AND `cln_allergies`.`allergy_name` LIKE '%"+req.body.search.allergy_name+"%' ");
            db.sequelize.query(sql2)
            .success(function(result2){
                res.json({"status": "success", "list": result, "count": result2[0].count});
            })
            .error(function(error){
                res.json(500, {"status": "error", "message": error});
            });

            // re
        })
        .error(function(error){
            res.json(500, {"status": "error", "message": error});
        });

    },

    postInsertPatientAllergy: function(req,res){
        var postData = req.body;
        var sql = "INSERT INTO `cln_patient_allergies` (`allergy_id`,`patient_id`) "
                    +"VALUES ("+postData.allergy_id+","+postData.patient_id+")";
        db.sequelize.query(sql)
            .success(function () {
                res.json({
                    'status': 'success',
                });
            })
            .error(function (error) {
                res.json(500, {
                    'status': 'error',
                    'message': error
                });
            }) 
    }
}
