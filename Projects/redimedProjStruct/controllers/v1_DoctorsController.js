var squel = require("squel");
squel.useFlavour('mysql');
var k_time = require('../helper/k_time');
var kiss=require('./kissUtilsController');
var errorCode=require('./errorCode');

var controllerCode='RED_V1DOCTOR';

var model_sql = {
    sql_list_patient: function (doctor_id, current) {
        var querybuilder = squel.select().from('cln_appointment_calendar')
                .join('cln_patients', null, 'cln_patients.patient_id = cln_appointment_calendar.patient_id');

        querybuilder.field('CAL_ID')
                .field('SITE_ID')
                .field("DATE_FORMAT(FROM_TIME,'%d/%m/%Y %h:%i')", 'FROM_TIME')
                .field("DATE_FORMAT(TO_TIME,'%d/%m/%Y %h:%i')", 'TO_TIME')
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

        console.log("_------------------------------------------")
        console.log("_------------------------------------------")
        console.log("_------------------------------------------")
        console.log("_------------------------------------------")
        console.log("_------------------------------------------")
        console.log("_------------------------------------------")
        console.log(querybuilder.toString());
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

    /**
     * created by: unknown
     * modify by: tannv.dts@gmail.com 25/06/2015
     */
    postByUserId: function(req, res){
        var fHeader='v1_DoctorsController -> postByUserId';
        var functionCode='FN001'
        var user_id = req.body.user_id;
        var sql="SELECT * FROM `doctors` doctor WHERE doctor.`User_id`=?";
        kiss.executeQuery(req,sql,[user_id],function(rows){
            if(rows.length>0)
            {
                res.json(rows[0]);
            }
            else
            {
                kiss.exlog(fHeader,'Khong co thong tin doctor nao tuong ung voi user id');
                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
            }
        },function(err){
            kiss.exlog(fHeader,'Loi truy van lay thong tin doctor thong qua user id',err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
        });

        //tan frame:
        /*var k_sql = res.locals.k_sql;
        k_sql.exec(model_sql.sql_by_user_id(user_id), function (data) {
            res.json(data[0]);
        }, function (err) {
            res.json(err);
        });*/
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
