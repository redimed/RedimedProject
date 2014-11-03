var k_time = require('../helper/k_time');

module.exports = {
    getListDoctorPatients: function (req, res) {
        var doctor_id = req.query.doctor_id;
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

//  var query_cln = k_sql.table('cln_patients').get()
//                .fields("CONCAT(`Title`, '. ', `First_name`)")
//                .where('patient_id = p_id')
//                .toSQL();
//        console.log('CLIENT QUERY : ', query_cln);

// k_sql.table('cln_appointment_calendar').get_by('doctor_id', doctor_id)
//                .fields('CAL_ID, SITE_ID, FROM_TIME, TO_TIME, patient_id AS p_id, (' + query_cln + ') AS patient_name')
//                .like('FROM_TIME', cur_date, 'after')
//                .exec(function (data) {
//                    res.json(data);
//                }, err_handle);


    },
    postUpdateCalendar: function (req, res) {
        var data = req.body.data;
        console.log(data)
        if (!data || !data.cal_id){
            res.json({status: 'error'});
            return;
        }
        var cal_id = data.cal_id;
        delete data.cal_id;

        var get_fields = ['status', 'notes'];
        var row = {};
        for (var key in data) {
            var index = get_fields.indexOf(key.toLowerCase());
            if (index >= 0) {
                get_fields.splice(index, 1);
                row[key] = data[key];
            }
        }
  
        if (get_fields.length > 0) {
            res.json({status: 'error', required_fields: get_fields});
            return;
        }

        var k_sql = res.locals.k_sql;

        var err_handle = function (err) {
            res.json(err);
        }

        k_sql.table('cln_appointment_calendar').key('cal_id')
                .update(cal_id, row)
                .exec(function (data) {
                    res.json(data);
                }, err_handle);

    }
}