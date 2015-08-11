// var squel = require("squel");
// squel.useFlavour('mysql');

var k_time = require('../helper/k_time');
var ApptItemModel = require('../v1_models/Cln_appt_items');
var squel =  ApptItemModel._squel;

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
      //  query_builder.set('Last_update_date', 'NOW()', {dontQuote: true});
        query_builder.setFields(row);
        return query_builder.toString();
    },
    sql_get_appt_by_patient: function (patient_id, doctor_id) {
        var appt_builder = squel.select()
                .from('cln_appointment_calendar')
                .where('patient_id = ?', patient_id);
                
        if(doctor_id)
            appt_builder.where('doctor_id = ?', doctor_id);         

            appt_builder.field('CAL_ID')
                .field('SITE_ID')
                .field('APP_TYPE')
                .field("DATE_FORMAT(FROM_TIME,'%d/%m/%Y %h:%i')", 'FROM_TIME')
                .field("DATE_FORMAT(TO_TIME,'%d/%m/%Y %h:%i')", 'TO_TIME')
                .field('NOTES');
                
        var query_builder = squel.select().from('redimedsites');
        query_builder.join(appt_builder, 'appt', 'redimedsites.id = appt.SITE_ID')
        query_builder.field('CAL_ID')
                .field('Site_name')
                .field('APP_TYPE')
                .field('FROM_TIME')
                .field('TO_TIME')
                .field('NOTES');
        return query_builder.toString();
    },
    sql_get_by_id: function (CAL_ID) {
        var query_clinical = squel.select().field("CLINICAL_DEPT_NAME").from("cln_clinical_depts").where('CLINICAL_DEPT_ID = appt.CLINICAL_DEPT_ID');
        var query_site = squel.select().field("Site_name").from("redimedsites").where('id = appt.SITE_ID');
        
        var querybuilder = squel.select().from('cln_appointment_calendar', 'appt');
        querybuilder.field("DATE_FORMAT(FROM_TIME,'%d/%m/%Y %h:%i')", 'FROM_TIME')
            .field("DATE_FORMAT(TO_TIME,'%d/%m/%Y %h:%i')", 'TO_TIME')
            .field(query_clinical, 'CLINICAL_DEPT_NAME')
            .field(query_site, 'SITE_NAME')
            .field('CAL_ID').field('PHONE').field('APP_TYPE').field('STATUS').field('ACC_TYPE').field('NOTES')
            ;


        querybuilder.where('CAL_ID = ?', CAL_ID);
        return querybuilder.toString();
    },

    /*
    * ITEMS FOR APPOINTMENT
    */
   /**
    * created by: unknown
    * tannv.dts mark
    * 26-06-2015
    * Ham nay se khong con duoc su dung do cln_appt_items khong con duoc su dung
    */
    sql_get_items_calendar: function (appt_id, patient_id) {
        var query_builder = squel.select()
        .from('inv_items')
        .where('cal_id = ?', appt_id)
        .where('appt_items.Patient_id = ?', patient_id)
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
    },

     /**
     * tannv.dts@gmail.com mark
     * function nay se khong con duoc su dung do khong con su dung bang cln_appt_items
     * 26-06-2015
     */
    sql_insert_items_calendar: function (cal_id, patient_id, items) {
        console.log('------------------------');
        var query_builder = squel.insert().into('cln_appt_items');
        var rows = [];
        for (var key in items) {
            var item = items[key];
            var row = {
                cal_id: cal_id,
                Patient_id: patient_id,
                CLN_ITEM_ID: item.CLN_ITEM_ID,
                QUANTITY: item.QUANTITY ? item.QUANTITY : 1,
                PRICE: item.PRICE ? item.PRICE : 0,
                TIME_SPENT: item.TIME_SPENT ? item.TIME_SPENT: 0,
                Creation_date: 'NOW()'
            }
            rows.push(row);
        }
        query_builder.setFieldsRows(rows, {dontQuote: true});
        return query_builder.toString();
    },

    /**
     * tannv.dts mark
     * 26-06-2015
     * function nay se khogn con duoc su dung do khong con su dung bang cln_appt_items
     */
    sql_delete_items_calendar: function (cal_id, patient_id,  items_id) {
        var query_builder = squel.delete().from('cln_appt_items');
        query_builder.where('cal_id = ?', cal_id);
        query_builder.where('Patient_id = ?', patient_id);
        query_builder.where('CLN_ITEM_ID IN ?', items_id);

        return query_builder.toString();
    },

    /**
     * tannv.dts mark
     * 26-06-2015
     * function nay se khogn con duoc su dung do khong con su dung bang cln_appt_items
     */
    sql_update_item_calendar: function (cal_id, patient_id, item) {
        var query_builder = squel.update().table('cln_appt_items');

        query_builder.set('QUANTITY', item.QUANTITY);
        query_builder.set('TIME_SPENT', item.TIME_SPENT);

        query_builder.where('cal_id = ?', cal_id);
        query_builder.where('Patient_id = ?', patient_id);
        query_builder.where('CLN_ITEM_ID IN ?', item.CLN_ITEM_ID); 
        return query_builder.toString();
    },
};

module.exports = {

    getGetById: function (req, res) {
        var cal_id = req.query.cal_id;

        if(!cal_id){
            res.end();
            return;
        }

        var k_sql = res.locals.k_sql;
        var sql = model_sql.sql_get_by_id(cal_id);

        k_sql.exec_row(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });

    },
    /**
    *   CRUD ITEM OF APPOINTMENT
    */
   /**
    * created by: unknown
    * tannv.dts mark
    * tannv.dts modify
    * 26-06-2015
    * Ham nay se khong con duoc su dung do cln_appt_items khong con duoc su dung
    */
    postGetItems: function (req, res) {
        var appt_id = req.body.appt_id;
        var patient_id = req.body.patient_id;

        var sql = model_sql.sql_get_items_calendar(appt_id, patient_id);
        var k_sql = res.locals.k_sql;

        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
   
    /**
     * tannv.dts@gmail.com mark
     * function nay se khong con duoc su dung do khong con su dung bang cln_appt_items
     * 26-06-2015
     */
    postInsertItems: function (req, res) {
        var cal_id = req.body.cal_id;
        var items = req.body.items;
        var patient_id = req.body.patient_id;
        if (!cal_id || !items) {
            res.json({status: 'error 1 '});
            return;
        }

        var sql = model_sql.sql_insert_items_calendar(cal_id, patient_id, items);
        var k_sql = res.locals.k_sql;
        k_sql.exec_row(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },

    /**
     * tannv.dts mark
     * 26-06-2015
     * function nay se khogn con duoc su dung do khong con su dung bang cln_appt_items
     */
    postDeleteItems: function(req, res){
        var cal_id = req.body.cal_id;
        var items = req.body.items; // list item_id
        var patient_id = req.body.patient_id;

        if (!cal_id || !items) {
            res.json({status: 'error 1 '});
            return;
        }
        console.log('DELTE LIST ', items)
        var sql = model_sql.sql_delete_items_calendar(cal_id, patient_id, items);
        var k_sql = res.locals.k_sql;
        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
    postUpdateItems: function(req, res){
        var cal_id = req.body.cal_id;
        var items = req.body.items; // list item_id
        
        if (!cal_id || !items) {
            res.json({status: 'error 1 '});
            return;
        }

        
        var sql = ApptItemModel.sql_update_batch(items);

        var k_sql = res.locals.k_sql;

        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },

    /*
    *   GET APPOINTMENT OF PATIENT
    */
    getGetByPatient: function (req, res) {
        var patient_id = req.query.patient_id;
        var doctor_id = req.query.doctor_id;

        var sql = model_sql.sql_get_appt_by_patient(patient_id, doctor_id);
        var k_sql = res.locals.k_sql;

        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
    /*
    *   CRUD APPOINTMENT 
    */
    postUpdate: function (req, res) {
        var data = req.body.data;
        var cal_id = req.body.cal_id;

        if (!data || !cal_id) {
            res.json({status: 'error 1 '});
            return;
        }
/*
        var row = model_sql.data_update_calendar(data);
        if (!row) {
            res.json({status: 'error 2'});
            return;
        }
*/
        var sql = model_sql.sql_update_calendar(cal_id, data);

        var k_sql = res.locals.k_sql;
        k_sql.exec(sql, function (data) {
            res.json({status: 'success'});
        }, function (err) {
            res.json(err);
        });
    },
};
