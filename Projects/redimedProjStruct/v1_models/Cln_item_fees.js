var k_model = require("./k_model");
var functions = require('../functions.js')
var install_model = new k_model('cln_item_fees', 'ITEM_FEE_ID');
var squel = install_model._squel;

install_model.sql_insert_xml_group_fees = function (type_list, data_list) {
    var arr = [];
    var now_str = functions.toCurrentTimeDatabase();
    for (var i = 0; i < data_list.length; ++i) {
        var item = data_list[i];
        var query_item_id = squel.select().from('inv_items').field('ITEM_ID')
            .where('ITEM_CODE = ?', item.ItemNum[0]).limit(1);

        switch (type_list.length) {
            case 3:
                if (item.Benefit85) { // IP Rebate
                    arr.push({
                        CLN_ITEM_ID: query_item_id,
                        FEE_TYPE_ID: type_list[2].FEE_TYPE_ID,
                        SCHEDULE_FEE: item.Benefit85[0],
                        CREATION_DATE: now_str
                    });
                }
            case 2:
                if (item.Benefit75) { // Rebate
                    arr.push({
                        CLN_ITEM_ID: query_item_id,
                        FEE_TYPE_ID: type_list[1].FEE_TYPE_ID,
                        SCHEDULE_FEE: item.Benefit75[0],
                        CREATION_DATE: now_str
                    });
                }
            case 1:
                if (item.ScheduleFee) { // Schedule
                    arr.push({
                        CLN_ITEM_ID: query_item_id,
                        FEE_TYPE_ID: type_list[0].FEE_TYPE_ID,
                        SCHEDULE_FEE: item.ScheduleFee[0],
                        CREATION_DATE: now_str
                    });
                }
        }

    }
    if(arr.length == 0)
        return '';
    var querybuilder = install_model.query_insert_batch(arr);
    querybuilder.onDupUpdate('SCHEDULE_FEE', 'VALUES(SCHEDULE_FEE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('Last_update_date', 'VALUES(CREATION_DATE)', {
        dontQuote: true
    });
    return querybuilder.toString();
};

/*
 *	PARSE CONTENT FILE TO FEE ARRAY
 */
install_model.process_content_file = function (content) {
    var lines = content.split('\r');
    var arr = [];
    //&& i < 50
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i].trim();
        if (line == '') continue;
        line = line.replace(/[$",%]/g, "");

        var spices = line.split('\t');
        spices = spices.filter(function (element) {
            return !!element;
        });
        if (spices.length < 2) {
            console.log('Miss price column ' + i);
            continue;
        }

        var item_code = spices.splice(0, 1);
        arr.push({
            ITEM_CODE: parseInt(item_code[0]),
            arr_fees: spices,
        })
    };
    return arr;
}
/*
 *	SQL INSERT FROM LIST FEE OF A GROUP (LIST TYPE)
 */
install_model.sql_insert_group_fees = function (type_list, fee_list) {
    var arr = [];
    var now_str = functions.toCurrentTimeDatabase();
    for (var i = 0; i < fee_list.length; ++i) {
        var fee_obj = fee_list[i];
        // console.log(fee_obj.arr_fees);

        if (!fee_obj.arr_fees) continue;

        for (var j = 0; j < fee_obj.arr_fees.length; ++j) {
            var fee = fee_obj.arr_fees[j];
            var type_id = type_list[j].FEE_TYPE_ID;

            var query_item_id = squel.select().from('inv_items').field('ITEM_ID')
                .where('ITEM_CODE = ?', fee_obj.ITEM_CODE).limit(1);

            arr.push({
                CLN_ITEM_ID: query_item_id,
                FEE_TYPE_ID: type_id,
                SCHEDULE_FEE: fee,
                CREATION_DATE: now_str
            });
        };
    }

    var querybuilder = install_model.query_insert_batch(arr);
    querybuilder.onDupUpdate('SCHEDULE_FEE', 'VALUES(SCHEDULE_FEE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('Last_update_date', 'VALUES(CREATION_DATE)', {
        dontQuote: true
    });
    return querybuilder.toString();
}
/*
 *	SQL INSERT LIST FEES OF A ITEM
 */
install_model.sql_insert_item_fees = function (item_id, fees) {
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
    querybuilder.onDupUpdate('SCHEDULE_FEE', 'VALUES(SCHEDULE_FEE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('Last_update_date', 'VALUES(CREATION_DATE)', {
        dontQuote: true
    });
    return querybuilder.toString();
}

module.exports = install_model;