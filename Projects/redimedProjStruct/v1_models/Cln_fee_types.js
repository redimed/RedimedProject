var k_model = require("./k_model");
var functions = require('../functions.js');

var install_model = new k_model('cln_fee_types', 'FEE_TYPE_ID');

install_model.sql_item_fees = function function_name (item_id, fields) {
	var squel = install_model._squel;
	var fee_select = squel.select().from('cln_item_fees').where('CLN_ITEM_ID = ?', item_id);

	var querybuilder = install_model.query_get_base(fields);
	querybuilder.left_join(fee_select, 'item_fees', "item_fees.FEE_TYPE_ID = cln_fee_types.FEE_TYPE_ID")

	return querybuilder.toString();
}

module.exports = install_model;