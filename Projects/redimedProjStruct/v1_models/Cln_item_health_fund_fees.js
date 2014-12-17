var k_model = require("./k_model");
var functions = require('../functions.js')
var install_model = new k_model('cln_item_health_fund_fees', 'ITEM_HEALTH_FUND_FEE_ID');
var squel = install_model._squel;

install_model.process_content_file = function(content) {
	var lines = content.split('\r');
	var arr = [];
	for (var i = 0; i < lines.length; ++i) {
		var line = lines[i].trim();
		if(line == '') continue;

		line = line.replace(/[$",%]/g, "");
		
		
		var spices = line.split('\t');
		spices = spices.filter(function(element){
			return !!element;
		});
		if(spices.length < 2) {
			console.log('Miss price column line ' + i);
			continue;
		}

		var item_code = spices.splice(0, 1);
		var percent = (spices.length > 1) ? spices[1] : null;

		arr.push({
			ITEM_CODE: parseInt(item_code[0]),
			FEE: parseFloat(spices[0]),
			PERCENT_FEE: percent,
		})

	};
	return arr;
}

install_model.sql_insert_fund_fees = function(fund_list, fee_list) {
	var arr = [];
	var now_str = functions.toCurrentTimeDatabase();
	// travel list fee
	for (var i = 0; i < fee_list.length; ++i) {
		var fee_obj = fee_list[i];

		// travel list fund
		for (var j = 0; j < fund_list.length; ++j) {
			var fund = fund_list[j];
			var query_item_id = squel.select().from('inv_items').field('ITEM_ID')
								.where('ITEM_CODE = ?', fee_obj.ITEM_CODE);

			arr.push({
				CLN_ITEM_ID: query_item_id, 
				Private_fund_id: fund.PF_id, 
				FEE: fee_obj.FEE,
				PERCENT_FEE: fee_obj.PERCENT_FEE,
				CREATION_DATE: now_str
			});
		};
	}

	var querybuilder = install_model.query_insert_batch(arr);
	querybuilder.onDupUpdate('FEE',  'VALUES(FEE)', {dontQuote: true});
	querybuilder.onDupUpdate('PERCENT_FEE',  'VALUES(PERCENT_FEE)', {dontQuote: true});
	querybuilder.onDupUpdate('Last_update_date',  'VALUES(CREATION_DATE)', {dontQuote: true});
	return querybuilder.toString();
}


/*
*	SQL INSERT LIST FEES OF A ITEM 
*/
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