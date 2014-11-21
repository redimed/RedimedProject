var ClaimsModel = require('../v1_models/Cln_claim');

module.exports = {

	getGetAll : function (req, res) {
		var sql = ClaimsModel.sql_get_all();
		var k_sql = res.locals.k_sql;

		k_sql.exec(sql, function (data) {
			res.json(data);
        });
	}, 
}