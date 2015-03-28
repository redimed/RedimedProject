var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var db = require('../models');

module.exports = {
	getList: function(req, res){
		var sql = 
		knex
		.column(
			'Patient_id', 
			knex.raw('IFNULL(Title,"") AS Title'),
			knex.raw('IFNULL(First_name,"") AS First_name'),
			knex.raw('IFNULL(Sur_name,"") AS Sur_name'), 
			knex.raw('IFNULL(Middle_name,"") AS Middle_name'), 
			knex.raw('IFNULL(State,"") AS State'), 
			'DOB', 
			'Sex', 
			'Creation_date'
		)
		.select()
		.from('cln_patients')
		.where(knex.raw('IFNULL(First_name,"") LIKE "%%"'))
		.where(knex.raw('IFNULL(Sur_name,"") LIKE "%%"'))
		.where(knex.raw('IFNULL(Title,"") LIKE "%%"'))
		.where(knex.raw('IFNULL(State,"") LIKE "%%"'))
		.where(knex.raw('IFNULL(Sex,"") LIKE "%%"'))
		.limit(10)
		.offset(0)
		.toString();

		db.sequelize.query(sql)
		.success(function(response){
			res.json(response);
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	}
}