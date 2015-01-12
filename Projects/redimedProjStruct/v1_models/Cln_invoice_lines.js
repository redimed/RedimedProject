var k_model = require("./k_model");
var install_model = new k_model('cln_invoice_lines', 'line_id');

var squel = install_model._squel;

install_model.sql_insert_from_appt_items = function (header_id, cal_id, patient_id) {
	var sql = 'INSERT INTO `cln_invoice_lines`'
	sql += ' (HEADER_ID, appt_item_id, ITEM_ID, PRICE, QUANTITY, AMOUNT, TIME_SPENT, IS_ENABLE)';
	sql += ' SELECT ' + header_id + ' , appt_item_id, CLN_ITEM_ID, PRICE, QUANTITY, FORMAT(PRICE * QUANTITY, 2) as `AMOUNT`, TIME_SPENT, is_enable ';
	sql += ' FROM `cln_appt_items` appt_items';
	sql += ' WHERE cal_id = ' + cal_id + ' AND Patient_id = ' + patient_id;
	sql += ' ON DUPLICATE KEY UPDATE';
	sql += ' ITEM_ID = appt_items.CLN_ITEM_ID, PRICE = appt_items.PRICE, QUANTITY = appt_items.QUANTITY, AMOUNT = VALUES(AMOUNT), TIME_SPENT = appt_items.TIME_SPENT, is_enable = appt_items.IS_ENABLE';
	return sql;
}

module.exports = install_model;