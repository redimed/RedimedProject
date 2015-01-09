var k_model = require("./k_model");
var install_model = new k_model('cln_appt_items', 'appt_item_id');
var squel = install_model._squel;


install_model.sql_insert_cln_appt_items = function(items_arr){
    var insert_query = squel.insert().into('cln_appt_items');
    insert_query.setFieldsRows(items_arr);
    insert_query.onDupUpdate('PRICE','VALUES(PRICE)', {dontQuote: true});
    insert_query.onDupUpdate('TIME_SPENT','VALUES(TIME_SPENT)', {dontQuote: true});
    insert_query.onDupUpdate('QUANTITY','VALUES(QUANTITY)', {dontQuote: true});
    insert_query.onDupUpdate('is_enable','VALUES(is_enable)', {dontQuote: true});
    insert_query.onDupUpdate('Last_update_date','NOW()', {dontQuote: true});
    
    return insert_query.toString();
}

install_model.sql_get_appt_items = function (appt_id) {
        var query_builder = squel.select()
        .from('inv_items')
        .where('cal_id = ?', appt_id)
        ;
        query_builder.join('cln_appt_items', 'appt_items', 'appt_items.CLN_ITEM_ID = inv_items.ITEM_ID');

        query_builder.field('appt_item_id')
                    .field('ITEM_ID')
                    .field('ITEM_NAME')
                    .field('appt_items.PRICE')
                    .field('ITEM_CODE')
                    .field('TIME_SPENT')
                    .field('QUANTITY');
        return query_builder.toString();
}

module.exports = install_model;