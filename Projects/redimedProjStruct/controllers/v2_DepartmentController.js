var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	postSearch: function(req, res) {
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		var search_data = req.body.search;
		// console.log(search_data)
		var agrs = [];
		for (var key in search_data) {
			if(search_data[key])
			agrs.push(key + " LIKE '%"+ search_data[key] +"%'");
		};

		var whereOpt = agrs.length ? db.Sequelize.and.apply(null, agrs) : null;

		db.Department.findAndCountAll({
			where: whereOpt,
			offset: offset,
			limit: limit,
			attributes: fields,
			order: 'Creation_date DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	anyDeptHeader: function(req, res) {
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

		var cln_dept_item_lists = db.sequelize.daoFactoryManager.getDAO('cln_dept_item_lists', { attribute: 'name' })
		cln_dept_item_lists.bulkCreate(list)
		.success(function(data) {
		  	res.json({"status": "success"});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})
		// res.json(db.InvItemLine)
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