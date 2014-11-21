var OutsideReferralModel = require('../v1_models/Outside_referrals');
var OutsideDoctorModel = require('../v1_models/Outside_doctors');

module.exports = {

	getGetAll : function (req, res) {
		var sql = OutsideReferralModel.sql_get_all();
		var k_sql = res.locals.k_sql;

		k_sql.exec(sql, function (data) {
			res.json(data);
        });
	}, 
}