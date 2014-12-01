var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
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