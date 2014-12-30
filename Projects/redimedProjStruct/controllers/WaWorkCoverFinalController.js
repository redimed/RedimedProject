var db = require('../models');
var mdt_functions = require('../mdt-functions.js');



module.exports = {
    postAdd: function (req, res) {
        var postData = req.body.add_data;

        db.WaWorkCoverFinal.create(postData)
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

    postEdit: function (req, res) {
        var postData = req.body.edit_data;
        var edit_id = req.body.edit_id;

        db.WaWorkCoverFinal.find(edit_id)
            .success(function (detail) {
                if (!detail) res.json(500, {
                    'status': 'error',
                    'message': 'Id Missing !!!'
                });
                detail.updateAttributes(postData).success(function (updated) {
                    res.json({
                        'status': 'success',
                        'data': updated
                    });
                })
                    .error(function (error) {
                        res.json(500, {
                            'status': 'error',
                            'message': error
                        });
                    })
            })
            .error(function (error) {
                res.json(500, {
                    'status': 'error',
                    'message': error
                });
            })
    },

    postSearch: function (req, res) {
        var pagination = req.body.pagination;
        var post_fields = req.body.filters;
        var select = req.body.select;
        var sql = mdt_functions.commonSearch(post_fields);
        console.log('this is the sql', sql);
        db.WaWorkCoverFinal.findAndCountAll({
            where: [sql]
            //            offset: pagination.offset,
            //            limit: pagination.limit,
            //            attributes: select,
            //            order: 'Creation_date DESC'
        })
            .success(function (result) {
                if (!result) res.json(500, {
                    'status': 'error',
                    'message': 'Cannot Get Search'
                });
                res.json({
                    'status': 'success',
                    'data': result.rows,
                    'count': result.count
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
        db.WaWorkCoverFinal.find(id)
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
}