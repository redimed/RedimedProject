var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	getAll: function(req, res){
		var sql = "SELECT id, user_name FROM users";

		db.sequelize.query(sql)
		.success(function(list){
			res.json({'status': 'success', 'data': list});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	}
}