var squel = require("squel");
squel.useFlavour('mysql');

var k_time = require('../helper/k_time');

var model_sql = {
    data_update_calendar: function (data) {
        var get_fields = ['status', 'notes'];
        var row = {};
        for (var key in data) {
            var index = get_fields.indexOf(key.toLowerCase());
            if (index >= 0) {
                get_fields.splice(index, 1);
                row[key] = data[key];
            }
        }
        if (get_fields.length > 0)
            return false;
        return row;
    },
    sql_update_calendar: function (cal_id, row) {
        var query_builder = squel.update().table('cln_appointment_calendar');
        query_builder.where('cal_id = ?', cal_id);
        query_builder.setFields(row);
        return query_builder.toString();
    },
    sql_insert_items_calendar: function (cal_id, items) {
        var query_builder = squel.insert().into('cln_appt_items');
        var rows = [];
        for (var key in items) {
            var item = items[key];
            var row = {
                cal_id: cal_id,
                CLN_ITEM_ID: item.CLN_ITEM_ID,
                QUANTITY: item.QUANTITY ? item.QUANTITY : 1,
                PRICE: item.PRICE ? item.PRICE : 0,
                Creation_date: 'NOW()'
            }
            rows.push(row);
        }
        query_builder.setFieldsRows(rows, {dontQuote: true});
        return query_builder.toString();
    },
    sql_get_appt_by_patient: function (patient_id) {
        var appt_builder = squel.select()
                .from('cln_appointment_calendar').where('patient_id = ?', patient_id)
                .field('CAL_ID')
                .field('SITE_ID')
                .field('APP_TYPE')
                .field("DATE_FORMAT(FROM_TIME,'%d/%m/%Y %h:%i')", 'FROM_TIME')
                .field("DATE_FORMAT(TO_TIME,'%d/%m/%Y %h:%i')", 'TO_TIME')
                .field('NOTES');
//
        var query_builder = squel.select().from('redimedsites');
        query_builder.join(appt_builder, 'appt', 'redimedsites.id = appt.SITE_ID')
        query_builder.field('CAL_ID')
                .field('Site_name')
                .field('APP_TYPE')
                .field('FROM_TIME')
                .field('TO_TIME')
                .field('NOTES');
        return query_builder.toString();
    }
};

module.exports = {
    postUpdateCalendar: function (req, res) {
        var data = req.body.data;
        var cal_id = req.body.cal_id;

        if (!data || !cal_id) {
            res.json({status: 'error 1 '});
            return;
        }

        var row = model_sql.data_update_calendar(data);
        if (!row) {
            res.json({status: 'error 2'});
            return;
        }

        var sql = model_sql.sql_update_calendar(cal_id, row);

        var k_sql = res.locals.k_sql;
        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
    postInsertItems: function (req, res) {
        var cal_id = req.body.cal_id;
        var items = req.body.items;
        if (!cal_id || !items) {
            res.json({status: 'error 1 '});
            return;
        }

        var sql = model_sql.sql_insert_items_calendar(cal_id, items);
        var k_sql = res.locals.k_sql;
        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
    getGetByPatient: function (req, res) {
        var patient_id = req.query.patient_id;

        var sql = model_sql.sql_get_appt_by_patient(patient_id);
        var k_sql = res.locals.k_sql;
//        res.json(sql);
        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
};
