var k_model = require("./k_model");
var functions = require('../functions.js')
var install_model = new k_model('cln_item_health_fund_fees', 'ITEM_HEALTH_FUND_FEE_ID');

install_model.sql_insert_item_fees = function(item_id, fees) {
	var list = [];
	var now_str = functions.toCurrentTimeDatabase();

	for (var i = fees.length - 1; i >= 0; i--) {
		list.push({
			CLN_ITEM_ID: item_id, 
			Private_fund_id: fees[i].PF_id, 
			FEE: fees[i].FEE,
			PERCENT_FEE: fees[i].PERCENT_FEE,
			CREATION_DATE: now_str
		});
	};

	var querybuilder = install_model.query_insert_batch(list);
	querybuilder.onDupUpdate('FEE',  'VALUES(FEE)', {dontQuote: true});
	querybuilder.onDupUpdate('PERCENT_FEE',  'VALUES(PERCENT_FEE)', {dontQuote: true});
	querybuilder.onDupUpdate('Last_update_date',  'VALUES(CREATION_DATE)', {dontQuote: true});
	return querybuilder.toString();
}

module.exports = install_model;