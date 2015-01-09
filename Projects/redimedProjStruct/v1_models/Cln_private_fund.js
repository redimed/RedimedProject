var k_model = require("./k_model");
var install_model = new k_model('cln_private_fund', 'PF_id');
var squel = install_model._squel;

install_model.sql_item_health_fund_fees = function function_name (item_id, fields) {
	
	var fee_select = squel.select().from('cln_item_health_fund_fees').where('CLN_ITEM_ID = ?', item_id);

	var querybuilder = install_model.query_get_base(fields);
	querybuilder.left_join(fee_select, 'item_fees', "item_fees.Private_fund_id = cln_private_fund.PF_id")

	return querybuilder.toString();
}

module.exports = install_model;