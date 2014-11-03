var k_time = require('../helper/k_time');
var squel = require("squel");
squel.useFlavour('mysql');

var model_sql = {
    sql_detail: function(user_id){
        var querybuilder = squel.select()
                    .from('doctors')
                    .where("user_id = ?", user_id)

        return querybuilder.toString();
    }
}

module.exports = {
    getListPatients: function (req, res) {
        var doctor_id = req.params.doctor_id;
        if (!doctor_id){
            res.json({status: 'error required doctor_id'});
            return;
        }
        var cur_date = k_time.getStrCurrentDate();
        var k_sql = res.locals.k_sql;

        var err_handle = function (err) {
            res.json(err);
        }

        k_sql.table('cln_appointment_calendar').get_by('doctor_id', doctor_id)
                .left_join('cln_patients', 'cln_patients.patient_id = cln_appointment_calendar.patient_id')
                .fields('CAL_ID, SITE_ID, FROM_TIME, TO_TIME, cln_patients.patient_id AS p_id, (CONCAT(cln_patients.`Title`,\'. \', cln_patients.First_name)) AS patient_name')
                .like('FROM_TIME', cur_date, 'after')
                .exec(function (data) {
                    res.json(data);
                }, err_handle);
    },
    
    postByUserId: function(req, res){
        var user_id = req.body.user_id;

        var k_sql = res.locals.k_sql;
        k_sql.exec(model_sql.sql_detail(user_id), function (data) {
            res.json(data[0]);
        }, function (err) {
            res.json(err);
        });
    }
    
}