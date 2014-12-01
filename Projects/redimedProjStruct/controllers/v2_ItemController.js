var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	anySearch: function(req, res) {
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;


		var search_data = req.body.search;
		console.log(search_data)
		var agrs = [];
		for (var key in search_data) {
			if(search_data[key])
			agrs.push(key + " LIKE '%"+ search_data[key] +"%'");
		};

		var whereOpt = agrs.length ? db.Sequelize.and.apply(null, agrs) : null;

		// Sequelize.and(
  //   { name: 'a project' },
  //   Sequelize.or(
  //     { id: [1,2,3] },
  //     { id: { lt: 10 } }
  //   )
  // )


		db.InvItem.findAndCountAll({
			where: whereOpt,
			offset: offset,
			limit: limit,
			// attributes: select,
			order: 'Creation_date DESC'
		}).success(function(result){
		
			res.json({"status": "success", "list": result.rows, "count": result.count});
			
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})

	}
}