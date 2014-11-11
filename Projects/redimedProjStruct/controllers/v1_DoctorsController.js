var squel = require("squel");
squel.useFlavour('mysql');
var k_time = require('../helper/k_time');

var model_sql = {
    sql_list_patient: function (doctor_id, current) {
        var querybuilder = squel.select().from('cln_appointment_calendar')
                .join('cln_patients', null, 'cln_patients.patient_id = cln_appointment_calendar.patient_id');

        querybuilder.field('CAL_ID')
                .field('SITE_ID')
                .field('FROM_TIME')
                .field('TO_TIME')
                .field('APP_TYPE')
                .field('cln_patients.patient_id', 'p_id')
                .field('cln_patients.Title')
                .field('cln_patients.First_name')
                .field('cln_patients.Sur_name')
                //.field('CONCAT(cln_patients.`Title`,\'. \', cln_patients.First_name)', 'patient_name');
        querybuilder.where('doctor_id = ?', doctor_id);

        if (current == 1) {
            var cur_date = k_time.getStrCurrentDate();
            querybuilder.where('FROM_TIME LIKE ?', cur_date + '%');
        }
        return querybuilder.toString();
    },
    sql_by_user_id: function (user_id) {
        var querybuilder = squel.select()
                    .from('doctors')
                    .where("user_id = ?", user_id)

        return querybuilder.toString();
    },
    sql_by_id: function (doctor_id) {
        var querybuilder = squel.select()
                .from('doctors')
                .where("doctor_id = ?", doctor_id)
        return querybuilder.toString();
    }
};
module.exports = {
    getListPatients: function (req, res) {
        var doctor_id = req.query.doctor_id;
        var current_day = req.query.current;

        var k_sql = res.locals.k_sql;
        var sql = model_sql.sql_list_patient(doctor_id, current_day);

        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
    postByUserId: function(req, res){
        var user_id = req.body.user_id;

        var k_sql = res.locals.k_sql;
        k_sql.exec(model_sql.sql_by_user_id(user_id), function (data) {
            res.json(data[0]);
        }, function (err) {
            res.json(err);
        });
    },
    getById: function (req, res) {
        var doctor_id = req.query.doctor_id;
        var k_sql = res.locals.k_sql;
        k_sql.exec(model_sql.sql_by_id(doctor_id), function (data) {
            res.json(data[0]);
        }, function (err) {
            res.json(err);
        });
    },
}
