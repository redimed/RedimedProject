var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	postInsert: function (req, res) {
        var postData = req.body;
        delete postData.ID;
        db.Referral.create(postData)
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
        db.Referral.find(id)
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
        var item_id = postData.ID;
        delete postData.ID;

        db.Referral.update(postData, {
            ID: item_id
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

		db.Referral.findAndCountAll({
			where: whereOpt,
			offset: offset,
			limit: limit,
			attributes: fields,
			order: 'ID DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},
}