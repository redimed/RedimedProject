var squel = require("squel");
squel.useFlavour('mysql');

var model_sql = {
    sql_list_patient: function (doctor_id, current) {
    }

};

module.exports = {
    postSearch: function (req, res) {
        var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
        var data = (req.body.data) ? req.body.data : {};
        var doctor_id = (req.body.doctor_id) ? req.body.doctor_id : 0;

        var params = "WHERE ";
        for (var key in data) {
            if (key !== "DATE") {
                if (data[key] === null)
                    data[key] = "";
                params += "IFNULL(p." + key + ", 1) LIKE '%" + data[key] + "%' AND ";
            } else {
                var str_date = "";
                for (var key2 in data[key]) {
                    if (data[key][key2].from_map !== null && data[key][key2].to_map !== null) {
                        str_date += "p." + key2;
                        str_date += " BETWEEN '" + data[key][key2].from_map + "' AND '" + data[key][key2].to_map + "' AND ";
                    }
                }
                params += str_date;
            }
        }

        // CUT AND STRING
        params = params.substring(0, params.length - 5);
        // END CUT AND STRING

        var k_sql = res.locals.k_sql;

        var sql = "SELECT p.Patient_id, p.Title, p.First_name, p.Sur_name, p.Middle_name, p.Post_code, cac.app_type, cac.CAL_ID" +
                " FROM cln_patients p " +
                " INNER JOIN cln_appointment_calendar cac ON cac.Patient_id=p.Patient_id AND DOCTOR_ID=" + doctor_id
                + " " + params +
                " GROUP BY p.Patient_id " +
                " ORDER BY p.Creation_date DESC " +
                " LIMIT " + limit +
                " OFFSET " + offset;

        k_sql.exec(sql, function (data) {
            k_sql.exec("SELECT COUNT(p.Patient_id) AS count " +
                    " FROM cln_patients p " +
                    " INNER JOIN cln_appointment_calendar cac ON cac.Patient_id=p.Patient_id AND DOCTOR_ID=" + doctor_id
                    + " " + params +  " GROUP BY p.Patient_id ", function (rowsCount) {
                        var count = rowsCount[0].count;
                        res.json({count: count, results: data});
                    })
        }, function (err) {
            res.json(err);
        });
    },
    getDetail: function (req, res) {
        var patient_id = req.body.patient_id;



    }
}