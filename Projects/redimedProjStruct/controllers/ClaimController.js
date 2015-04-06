var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var db = require('../models');

module.exports = {
	getList: function(req, res){
		/*var sql = 
		knex
		.column(
			'Claim_id',
			'Patient_id',
			'Claim_date'
			'Injury_date',
			knex.raw('IFNULL(Claim_no,"") AS Claim_no'),
			knex.raw('IFNULL(Injury_name,"") AS Injury_name')
		)
		.select()
		.from('cln_patients')
		.where(knex.raw('IFNULL(Claim_no,"") LIKE "%%"'))
		.where(knex.raw('IFNULL(Injury_name,"") LIKE "%%"'))
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
		})*/
	}
}