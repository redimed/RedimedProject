var squel = require("squel");
squel.useFlavour('mysql');
var kiss=require('./kissUtilsController');//tan add
var errorCode=require('./errorCode');//tan add

var controllerCode='RED_v1PATIENT';//tan add

var model_sql = {
    sql_get_by_id: function (patient_id) {
        var querybuilder = squel.select().from('cln_patients');
        querybuilder.where('Patient_id = ?', patient_id);
        return querybuilder.toString();
    }

};

module.exports = {
    /**
     * created by:unknown
     * modify by:tannv.dts
     * modify date:02-07-2015
     */
     postSearch: function(req, res){
        var fHeader="v1_PatientController->postSearch";//tan add
        var functionCode='FN001';//tan add
        var limit = (req.body.limit)?req.body.limit:10;
        var offset = (req.body.offset)?req.body.offset:0;
        var data = (req.body.data)?req.body.data:{};
        var doctor_id = (req.body.doctor_id)?req.body.doctor_id:null;
        //tannv.dts
        var firstName=kiss.checkData(data.First_name)?data.First_name:'';
        var middleName=kiss.checkData(data.Middle_name)?data.Middle_name:'';
        var surName=kiss.checkData(data.Sur_name)?data.Sur_name:'';
        var postCode=kiss.checkData(data.Post_code)?data.Post_code:'';

        //tannv.dts
        //---------------------------------------------------------------
        if(doctor_id!=null)
        {
            var sql=
            " SELECT a.*                                                                                          "+
            " FROM                                                                                                "+
            " (SELECT patient.*                                                                                   "+
            " FROM `cln_patients` patient                                                                         "+
            " INNER JOIN `cln_appt_patients` apptPatient ON patient.`Patient_id`=`apptPatient`.`Patient_id`       "+
            " INNER JOIN `cln_appointment_calendar` calendar ON apptPatient.`CAL_ID`=calendar.`CAL_ID`            "+
            " WHERE patient.`First_name` LIKE CONCAT('%',?,'%')                                                   "+
            " AND patient.`Middle_name` LIKE CONCAT('%',?,'%')                                                    "+
            " AND patient.`Sur_name` LIKE CONCAT('%',?,'%')                                                       "+
            " AND patient.`Post_code` LIKE CONCAT('%',?,'%')                                                      "+
            " AND `apptPatient`.`actual_doctor_id` =?                                                        "+
            " AND `apptPatient`.`actual_doctor_id` IS NOT NULL                                                    "+
            " UNION                                                                                               "+
            " SELECT patient.*                                                                                    "+
            " FROM `cln_patients` patient                                                                         "+
            " INNER JOIN `cln_appt_patients` apptPatient ON patient.`Patient_id`=`apptPatient`.`Patient_id`       "+
            " INNER JOIN `cln_appointment_calendar` calendar ON apptPatient.`CAL_ID`=calendar.`CAL_ID`            "+
            " WHERE patient.`First_name` LIKE CONCAT('%',?,'%')                                                   "+
            " AND patient.`Middle_name` LIKE CONCAT('%',?,'%')                                                    "+
            " AND patient.`Sur_name` LIKE CONCAT('%',?,'%')                                                       "+
            " AND patient.`Post_code` LIKE CONCAT('%',?,'%')                                                      "+
            " AND calendar.`DOCTOR_ID` =?                                                                    "+
            " AND `apptPatient`.`actual_doctor_id` IS NULL) a                                                     "+
            " ORDER BY a.First_name,a.Middle_name,a.Sur_name                                                      "+
            " LIMIT ?                                                                                             "+
            " OFFSET ?                                                                                            ";
        var sqlCount=
            " SELECT COUNT(a.Patient_id) as COUNT_PATIENTS                                                                                  "+
            " FROM                                                                                                "+
            " (SELECT patient.*                                                                                   "+
            " FROM `cln_patients` patient                                                                         "+
            " INNER JOIN `cln_appt_patients` apptPatient ON patient.`Patient_id`=`apptPatient`.`Patient_id`       "+
            " INNER JOIN `cln_appointment_calendar` calendar ON apptPatient.`CAL_ID`=calendar.`CAL_ID`            "+
            " WHERE patient.`First_name` LIKE CONCAT('%',?,'%')                                                   "+
            " AND patient.`Middle_name` LIKE CONCAT('%',?,'%')                                                    "+
            " AND patient.`Sur_name` LIKE CONCAT('%',?,'%')                                                       "+
            " AND patient.`Post_code` LIKE CONCAT('%',?,'%')                                                      "+
            " AND `apptPatient`.`actual_doctor_id` =?                                                        "+
            " AND `apptPatient`.`actual_doctor_id` IS NOT NULL                                                    "+
            " UNION                                                                                               "+
            " SELECT patient.*                                                                                    "+
            " FROM `cln_patients` patient                                                                         "+
            " INNER JOIN `cln_appt_patients` apptPatient ON patient.`Patient_id`=`apptPatient`.`Patient_id`       "+
            " INNER JOIN `cln_appointment_calendar` calendar ON apptPatient.`CAL_ID`=calendar.`CAL_ID`            "+
            " WHERE patient.`First_name` LIKE CONCAT('%',?,'%')                                                   "+
            " AND patient.`Middle_name` LIKE CONCAT('%',?,'%')                                                    "+
            " AND patient.`Sur_name` LIKE CONCAT('%',?,'%')                                                       "+
            " AND patient.`Post_code` LIKE CONCAT('%',?,'%')                                                      "+
            " AND calendar.`DOCTOR_ID` =?                                                                    "+
            " AND `apptPatient`.`actual_doctor_id` IS NULL) a                                                     ";
            kiss.executeQuery(req,sql,[firstName,middleName,surName,postCode,doctor_id,
                                        firstName,middleName,surName,postCode,doctor_id,
                                        limit,offset],function(rows){
                kiss.executeQuery(req,sqlCount,[firstName,middleName,surName,postCode,doctor_id,
                                                firstName,middleName,surName,postCode,doctor_id],function(rowsCount){
                    var count = rowsCount[0].COUNT_PATIENTS;
                    res.json({count:count, results:rows});    
                },function(err){
                    kiss.exlog(fHeader,'Loi truy van dem patient');
                })
            },function(err){
                kiss.exlog(fHeader,'Loi truy van lay patient',err);
                res.json(err);
            },true)
        }
        else
        {
            var sql=
                " SELECT patient.*                                                           "+
                " FROM `cln_patients` patient                                                "+
                " WHERE patient.`First_name` LIKE CONCAT('%',?,'%')                          "+
                " AND patient.`Middle_name` LIKE CONCAT('%',?,'%')                           "+
                " AND patient.`Sur_name` LIKE CONCAT('%',?,'%')                              "+
                " AND patient.`Post_code` LIKE CONCAT('%',?,'%')                             "+
                " ORDER BY patient.`First_name`,patient.`Middle_name`,patient.`Sur_name`     "+
                " LIMIT ?                                                                    "+
                " OFFSET ?;                                                                  ";
            var sqlCount=
                " SELECT COUNT(patient.Patient_id) AS COUNT_PATIENTS            "+
                " FROM `cln_patients` patient                          "+
                " WHERE patient.`First_name` LIKE CONCAT('%',?,'%')    "+
                " AND patient.`Middle_name` LIKE CONCAT('%',?,'%')     "+
                " AND patient.`Sur_name` LIKE CONCAT('%',?,'%')        "+
                " AND patient.`Post_code` LIKE CONCAT('%',?,'%')       ";
            kiss.executeQuery(req,sql,[firstName,middleName,surName,postCode,limit,offset],function(rows){
                kiss.executeQuery(req,sqlCount,[firstName,middleName,surName,postCode],function(rowsCount){
                    var count = rowsCount[0].COUNT_PATIENTS;
                    res.json({count:count, results:rows});    
                },function(err){
                    kiss.exlog(fHeader,'Loi truy van dem patient');
                })
            },function(err){
                kiss.exlog(fHeader,'Loi truy van lay patient',err);
                res.json(err);
            })

        }
        
    },
    getGetById: function (req, res) {
        var patient_id = req.query.patient_id;
        console.log('this is patient id', patient_id);
        if(!patient_id){
            res.end();
            return;
        }


        var k_sql = res.locals.k_sql;
        var sql = model_sql.sql_get_by_id(patient_id);

        k_sql.exec_row(sql, function (data) {
            console.log('this is patient result data', data);
            res.json(data);
        }, function (err) {
            console.log("this is patient error", error);
            res.json(err);
        });

    },


}
