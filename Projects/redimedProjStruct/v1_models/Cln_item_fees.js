var k_model = require("./k_model");
var functions = require('../functions.js')
var install_model = new k_model('cln_item_fees', 'ITEM_FEE_ID');

install_model.sql_insert_item_fees = function(item_id, fees) {
	var list = [];
	var now_str = functions.toCurrentTimeDatabase();

	for (var i = fees.length - 1; i >= 0; i--) {
		list.push({
			CLN_ITEM_ID: item_id, 
			FEE_TYPE_ID: fees[i].FEE_TYPE_ID, 
			SCHEDULE_FEE: fees[i].SCHEDULE_FEE,
			CREATION_DATE: now_str
		});
	};

	var querybuilder = install_model.query_insert_batch(list);
	querybuilder.onDupUpdate('SCHEDULE_FEE',  'VALUES(SCHEDULE_FEE)', {dontQuote: true});
	querybuilder.onDupUpdate('Last_update_date',  'VALUES(CREATION_DATE)', {dontQuote: true});
	return querybuilder.toString();
}

module.exports = install_model;