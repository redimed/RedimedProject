var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
    postInsert: function (req, res) {
        var postData = req.body;
        console.log('this is post data', postData);
        delete postData.FEE_TYPE_ID;
        db.FeeType.create(postData)
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
        var id = req.body.FEE_TYPE_ID;
        db.FeeType.find(id)
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
        var item_id = postData.FEE_TYPE_ID;
        delete postData.FEE_TYPE_ID;

        db.FeeType.update(postData, {
            FEE_TYPE_ID: item_id
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