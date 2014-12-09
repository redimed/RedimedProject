var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	anySearch: function(req, res) {
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

		db.InvItem.findAndCountAll({
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

	postDetail: function(req, res){
		var id = req.body.ITEM_ID;

		db.InvItem.find(id)
		.success(function(data){
			res.json({"status": "success", "data": data});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});

	},

	postInsert : function(req, res) {
		var postData = req.body;

		db.InvItem.create(postData)
		.success(function(data, created){
			res.json({"status": "success", "data": data});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postUpdate: function(req, res) {
		var postData = req.body;

		var item_id = postData.ITEM_ID;
		delete postData.ITEM_ID;

		db.InvItem.update(postData, {where: {ITEM_ID: item_id}})
		.success(function(data){
			res.json({"status": "success", "data": data});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})
	},

	anyHeaderItem: function(req, res) {
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields =  req.body.fields;

		var search_data = req.body.search;
		var header_id = search_data.POPULAR_HEADER_ID;
		// POPULAR_HEADER_ID

		// var header_id = req.query.id;

		db.InvItemHeader.find({
			where: {POPULAR_HEADER_ID: header_id},
			attributes: ['POPULAR_HEADER_ID'],
			include: [
				{ 
					model: db.InvItem , as: 'Items',
					// attributes: fields,
				},
			]
		})
		.success(function(header){
			if(!header) {
				res.json(500, {"status": "error"});
				return;
			}
			res.json({list: header.items, count: header.items.length});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})	
	},

	postInsertHeaderItems: function(req, res) {
		var header_id = req.body.header_id; // 2  
		var items = req.body.items;  //  [6225, 6224] 

		if(!header_id || !items || items.length === 0){
			res.json(500, {"status": "error"});
			return;
		}

		var list = [];
		for (var i = items.length - 1; i >= 0; i--) {
			list.push({POPULAR_HEADER_ID: header_id, ITEM_ID: items[i]});
		};

		// console.log('HEADER ', header_id);
		// console.log('items', items)


		// console.log(db.InvItemLine);

		db.InvItemLine.bulkCreate(list)
		.success(function(data) {
		  	res.json({"status": "success"});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})
	},

	postUpdateHeaderItem: function(req, res){

		
	},



	anyHeaderSearch: function(req, res){
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		// InvItemHeader

		db.InvItemHeader.findAndCountAll({
			offset: offset,
			limit: limit,
			attributes: fields,
			order: 'POPULAR_NAME DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})	
	},
	
	postInsertHeader: function(req, res) {
		var postData = req.body;

		db.InvItemHeader.findOrCreate(postData)
		.success(function(data, created){
			if(!created){
				res.json({"status": "warning", "data": data, message: 'Duplicate Popular code'});
				return;
			}
			res.json({"status": "success", "data": data});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
 
	},

	
}