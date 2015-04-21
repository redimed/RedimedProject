var knex = require("../knex-connect.js");
var db = require("../models");

module.exports = {
	getList: function(req, res){
		var sql = knex
		.select('RATING_ID',"DESCRIPTION")
		.from('sys_ranking_headers')
		.orderBy('RATING_ID','asc')
		.toString();

		db.sequelize.query(sql)
		.success(function(result){
			console.log(result);
			res.json({status:'success', list:result});
		})
		.error(function(err){
			res.json(500, {"status": "error", "message": err});
		})
	}
}