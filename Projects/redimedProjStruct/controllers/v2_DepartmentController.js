var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
    postSearch: function (req, res) {
        var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
        var fields = req.body.fields;
        var search_data = req.body.search;
        // console.log(search_data)
        var agrs = [];
        for (var key in search_data) {
            if (search_data[key])
                agrs.push(key + " LIKE '%" + search_data[key] + "%'");
        };

        var whereOpt = agrs.length ? db.Sequelize.and.apply(null, agrs) : null;

        db.Department.findAndCountAll({
            where: whereOpt,
            offset: offset,
            limit: limit,
            attributes: fields,
            order: 'CLINICAL_DEPT_ID DESC'
        }).success(function (result) {
            res.json({
                "status": "success",
                "list": result.rows,
                "count": result.count
            });
        })
            .error(function (error) {
                res.json(500, {
                    "status": "error",
                    "message": error
                });
            });
    },
    postDetail: function (req, res) {
        var id = req.body.CLINICAL_DEPT_ID;
        db.Department.find(id)
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
    postInsert: function (req, res) {
        var postData = req.body;
        delete postData.CLINICAL_DEPT_ID;
        db.Department.create(postData)
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
    postUpdate: function (req, res) {
        var postData = req.body;
        console.log('this is post data', postData);
        var item_id = postData.CLINICAL_DEPT_ID;
        delete postData.CLINICAL_DEPT_ID;

        db.Department.update(postData, {
            CLINICAL_DEPT_ID: item_id
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
    postDelete: function (req, res) {
        var dept_id = req.body.CLINICAL_DEPT_ID;

        db.Department.destroy({
            CLINICAL_DEPT_ID: dept_id,
        }).success(function (result) {
            res.json({
                "status": "success"
            });
        }).error(function (error) {
            res.json(500, {
                "status": "error",
                "message": error
            });
        });
    },


	postDeptHeader: function(req, res) {
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields =  req.body.fields;

		var search_data = req.body.search;
		var dept_id = search_data.CLINICAL_DEPT_ID;
		// var dept_id = 2;

		db.Department.find({
			where: {CLINICAL_DEPT_ID: dept_id},
			attributes: ['CLINICAL_DEPT_ID', 'CLINICAL_DEPT_NAME'],
			include: [
				{ 
					model: db.InvItemHeader , as: 'ItemLists',
					attributes: fields,
				},
			]
		}).success(function(dept){
			if(!dept) {
				res.json(500, {"status": "error"});
				return;
			}
			res.json({list: dept.itemLists, count: dept.itemLists.length});
		}) .error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postDeptService: function(req, res){
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields =  req.body.fields;

		var search_data = req.body.search;
		var dept_id = search_data.CLINICAL_DEPT_ID;
		// var dept_id = 2;

		db.Department.find({
			where: {CLINICAL_DEPT_ID: dept_id},
			attributes: ['CLINICAL_DEPT_ID', 'CLINICAL_DEPT_NAME'],
			include: [
				{ 
					model: db.SysServices , as: 'Services',
					attributes: fields,
				},
			]
		}).success(function(dept){
			if(!dept) {
				res.json(500, {"status": "error"});
				return;
			}
			res.json({list: dept.services, count: dept.services.length});
		}) .error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postInsertDeptHeaders: function(req, res) {
		var dept_id = req.body.dept_id; // 2  
		var headers = req.body.headers;  //  [6225, 6224] 

		if(!dept_id || !headers || headers.length === 0){
			res.json(500, {"status": "error"});
			return;
		}

		var list = [];
		for (var i = headers.length - 1; i >= 0; i--) {
			list.push({CLINICAL_DEPT_ID: dept_id, POPULAR_HEADER_ID: headers[i]});
		};

		// var cln_dept_item_lists = db.sequelize.daoFactoryManager.getDAO('cln_dept_item_lists', { attribute: 'name' })
		db.DeptHeaders.bulkCreate(list)
		.success(function(data) {
		  	res.json({"status": "success"});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})
	},
	postUpdateDeptService: function(req, res) {
		var dept_id =  req.body.CLINICAL_DEPT_ID;   
		var service_id = req.body.SERVICE_ID; 
		delete req.body.CLINICAL_DEPT_ID;   
		delete req.body.SERVICE_ID; 

		var postData = req.body;

		db.DeptServices.update(postData, {
			CLINICAL_DEPT_ID: dept_id,
			SERVICE_ID: service_id,
		}).success(function(result){
			res.json({result: result, "status": "success"})
		}).error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},
	postUpdateDeptHeader: function(req, res) {
		var dept_id =  req.body.CLINICAL_DEPT_ID;   
		var header_id = req.body.POPULAR_HEADER_ID; 
		delete req.body.CLINICAL_DEPT_ID;   
		delete req.body.POPULAR_HEADER_ID; 

		var postData = req.body;

		db.DeptHeaders.update(postData, {
			CLINICAL_DEPT_ID: dept_id,
			POPULAR_HEADER_ID: header_id,
		}).success(function(result){
			res.json({result: result, "status": "success"})
		}).error(function(error){
			res.json(500, {"status": "error", "message": error});
		});

		// db.DeptHeaders.destroy({
		// 	CLINICAL_DEPT_ID: dept_id,
		// 	POPULAR_HEADER_ID: header_id,
		// }).success(function(result){
		// 	res.json({"status": "success"})
		// }).error(function(error){
		// 	res.json(500, {"status": "error", "message": error});
		// });
	},
	postInsertDeptServices: function(req, res) {
		var dept_id = req.body.dept_id; // 2  
		var services = req.body.services;  //  [6225, 6224] 

		if(!dept_id || !services || services.length === 0){
			res.json(500, {"status": "error"});
			return;
		}

		var list = [];
		for (var i = services.length - 1; i >= 0; i--) {
			list.push({CLINICAL_DEPT_ID: dept_id, SERVICE_ID: services[i]});
		};

		// var cln_dept_services = db.sequelize.daoFactoryManager.getDAO('cln_dept_services', { attribute: 'name' });
		db.DeptServices.bulkCreate(list)
		// cln_dept_services.bulkCreate(list)
		.success(function(data) {
		  	res.json({"status": "success"});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})
	},
	getListItems: function(req, res){
		var id = req.query.id; 

		db.Department.find({
			where: {CLINICAL_DEPT_ID: id},
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
					]
				},
			]
		}).success(function(dept){
			if(!dept) {
				res.json(500, {"status": "error"});
				return;
			}

			res.json({'status': 'success', data: dept});
		}) .error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	}
}