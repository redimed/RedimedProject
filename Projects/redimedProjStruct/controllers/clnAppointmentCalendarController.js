/**
 * Created by tannv.dts@gmail.com on 9/26/2014.
 */

var db = require('../models');
var common_functions = require("../functions");

module.exports =
{
    bookingDelete: function(req, res){
        var cal_id = (req.body.cal_id)?req.body.cal_id:0;

        var sql = "UPDATE cln_appointment_calendar cac"
                +" SET cac.Patient_id=NULL"
                +", cac.STATUS='No Appointment'"
                +", cac.NOTES=''"
                +", cac.PHONE=NULL"
                +", cac.APP_TYPE=NULL"
                +", cac.ARR_TIME=NULL"
                +", cac.ATTEND_TIME=NULL"
                +", cac.AVAILABLE=NULL"
                +", cac.SERVICE_ID=NULL"
                +", cac.ACC_TYPE=NULL"
                +", cac.bill_to=NULL"
                +" WHERE cac.CAL_ID="+cal_id;

        req.getConnection(function(err, connection){
            var query = connection.query(
                sql,
                function(err, rows){
                    if(err){
                        console.log("Error Selecting : %s ",err );
                    }
                    else{
                        res.json(rows);
                    }
                }
            );
        });
    },
    bookingUpdate: function(req, res){
        var cal_id = req.body.CAL_ID;
        var arr_time = common_functions.convertFromHoursToDateTime(req.body.ARR_TIME);
        var acc_type = req.body.ACC_TYPE;
        var app_type = req.body.APP_TYPE;
        var attend_time = common_functions.convertFromHoursToDateTime(req.body.ATTEND_TIME);
        var notes = req.body.NOTES;
        var phone = req.body.PHONE;
        var service_id = req.body.SERVICE_ID;
        var status = req.body.STATUS;
        var bill_to = req.body.bill_to;

        var sql = "UPDATE cln_appointment_calendar cac"
                +" SET ARR_TIME='"+arr_time+"'"
                +", ATTEND_TIME='"+attend_time+"'"
                +", ACC_TYPE='"+acc_type+"'"
                +", APP_TYPE='"+app_type+"'"
                +", NOTES='"+notes+"'"
                +", PHONE='"+phone+"'"
                +", SERVICE_ID='"+service_id+"'"
                +", STATUS='"+status+"'"
                +", BILL_TO='"+bill_to+"'"
                +" WHERE CAL_ID='"+cal_id+"'";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql, function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows});
                }
            });
        });
    },
    getById: function(req, res){
        var booking_id = (req.body.booking_id)?req.body.booking_id:0;

        req.getConnection(function(err, connection){
            var query = connection.query(
                "SELECT cac.*, d.NAME AS DOCTOR_NAME, r.Site_name AS SITE_NAME, ccd.CLINICAL_DEPT_NAME FROM cln_appointment_calendar cac"+
                " INNER JOIN doctors d ON d.doctor_id=cac.DOCTOR_ID AND cac.CAL_ID="+booking_id+
                " INNER JOIN redimedsites r ON r.id=cac.SITE_ID"+
                " INNER JOIN cln_clinical_depts ccd ON ccd.CLINICAL_DEPT_ID=cac.CLINICAL_DEPT_ID",
                function(err, rows){
                    if(err){
                        console.log("Error Selecting : %s ",err );
                    }
                    else{
                        res.json(rows[0]);
                    }
                }
            );
        });
    },
    checkSameDoctor:function(req,res)
    {
        var calId1=req.query.calId1;
        var calId2=req.query.calId2;
        var sql=" SELECT DISTINCT calendar.`DOCTOR_ID`                            "+
            " FROM  `cln_appointment_calendar` calendar                       "+
            " WHERE `calendar`.`CAL_ID`=? || `calendar`.`CAL_ID`=?            ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[calId1,calId2],function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows.length});
                }
            });
        });
    },
    booking: function(req, res){
        var cal_id = (req.body.CAL_ID)?req.body.CAL_ID:0;
        var service_id = (req.body.SERVICE_ID)?req.body.SERVICE_ID:0;
        var patient_id = (req.body.Patient_id)?req.body.Patient_id:0;
        var acc_type = (req.body.ACC_TYPE)?req.body.ACC_TYPE:"PUBLIC";
        var app_type = (req.body.APP_TYPE)?req.body.APP_TYPE:"NotYet";
        var status = (req.body.STATUS)?req.body.STATUS:"";
        var bill_to = (req.body.bill_to)?req.body.bill_to:1;
        var arr_time = (req.body.ARR_TIME)?common_functions.convertFromHoursToDateTime(req.body.ARR_TIME):common_functions.convertFromHoursToDateTime("00:00");
        var att_time = (req.body.ATTEND_TIME)?common_functions.convertFromHoursToDateTime(req.body.ATTEND_TIME):common_functions.convertFromHoursToDateTime("00:00");
        var notes = (req.body.NOTES)?req.body.NOTES:"";
        var PATIENTS = (req.body.PATIENTS)?req.body.PATIENTS:"";

        var patient_obj = JSON.parse(PATIENTS);

        var patient_length = patient_obj.length;
        var last_patient_id = patient_obj[patient_length-1].Patient_id;

        var sql_2 = "INSERT INTO cln_appt_patients(Patient_id, CAL_ID, Creation_date) VALUES("+last_patient_id+", "+cal_id+", NOW())";        

        req.getConnection(function(err, connection){
            var query = connection.query(
                "UPDATE cln_appointment_calendar"+
                " SET SERVICE_ID="+service_id+
                ", ACC_TYPE='"+acc_type+"'"+
                ", APP_TYPE='"+app_type+"'"+
                ", STATUS='"+status+"'"+
                ", bill_to="+bill_to+
                ", ARR_TIME='"+arr_time+"'"+
                ", ATTEND_TIME='"+att_time+"'"+
                ", NOTES='"+notes+"'"+
                ", Patient_id='"+patient_id+"'"+
                ", PATIENTS='"+PATIENTS+"'"+
                " WHERE CAL_ID="+cal_id,
                function(err, rows){
                    if(err){
                        console.log("Error Selecting : %s ",err );
                    }
                    else{
                        db.sequelize.query(sql_2)
                        .success(function(list){
                            res.json({status: 'success', data: rows});
                        })
                        .error(function(error){
                            res.json(500, {status: 'error', data: error});
                        })
                    }
                });
        });
    },
    overviewAppointmentCalendar: function(req, res){
        var site = (req.body.site)?req.body.site:0;
        var datepicker = (req.body.datepicker_map)?req.body.datepicker_map:"";
        var dept = (req.body.dept)?req.body.dept:0;

        var sql_dept;
        if(dept === 0 || dept === null){
            sql_dept = "";
        }else{
            sql_dept = " WHERE cac.CLINICAL_DEPT_ID="+dept;
        }

        var sql = "SELECT cac.FROM_TIME, cac.TO_TIME,"+
                " GROUP_CONCAT(cac.SERVICE_ID ORDER BY cac.DOCTOR_ID) AS SERVICES,"+
                " GROUP_CONCAT(cac.DOCTOR_ID ORDER BY cac.DOCTOR_ID) AS doctor,"+
                " GROUP_CONCAT(d.NAME ORDER BY cac.DOCTOR_ID) AS doctor_name,"+
                " GROUP_CONCAT(IFNULL(ss.SERVICE_COLOR, '#FFFFFF') ORDER BY cac.DOCTOR_ID) AS SERVICE_COLORS,"+
                " GROUP_CONCAT(cac.STATUS ORDER BY cac.DOCTOR_ID) AS status,"+
                " GROUP_CONCAT(cac.CAL_ID ORDER BY cac.DOCTOR_ID) AS CAL_ID,"+
                " GROUP_CONCAT(IFNULL(cac.PATIENTS, 'No Patient') ORDER BY cac.DOCTOR_ID separator '|') AS PATIENTS"+
                " FROM cln_appointment_calendar cac"+
                " LEFT OUTER JOIN sys_services ss ON ss.SERVICE_ID=cac.SERVICE_ID"+
                " INNER JOIN doctors d ON d.doctor_id=cac.DOCTOR_ID"+
                sql_dept+
                " AND cac.SITE_ID="+site+
                " AND DATE(cac.FROM_TIME) LIKE '%"+datepicker+"%'"+
                " GROUP BY cac.FROM_TIME"

        req.getConnection(function(err, connection){
            var query = connection.query(
                sql
                , function(err, rows){
                    if(err){
                        console.log("Error Selecting : %s ",err );
                    }
                    else{
                        console.log(sql);
                        res.json(rows);
                    }
                });
        })

    },
    getAppointmentCalendar_bv: function(req,res){
        var DOCTOR_ID=req.body.doctor;
        var SITE_ID=req.body.site;
        var DATEPICKER=req.body.datepicker_map;

        req.getConnection(function(err, connection){
            var query = connection.query(
                "SELECT h.*, IFNULL(CONCAT(p.First_name, p.Sur_name), 'No Patient') AS PATIENT_NAME FROM `cln_appointment_calendar` h"+
                " LEFT OUTER JOIN cln_patients p ON p.Patient_id=h.Patient_id"+
                " WHERE h.`DOCTOR_ID`="+DOCTOR_ID+
                " AND h.`SITE_ID`="+SITE_ID+
                " AND DATE(h.`FROM_TIME`)='"+DATEPICKER+"'"
                , function(err, rows){
                    if(err){
                        console.log("Error Selecting : %s ",err );
                    }
                    else{
                        res.json(rows);
                    }
                });
        })
    },
    //phanquochien
    //add
    getListDateAppointmentCalendar: function(req,res){
        var DOCTOR_ID=req.query.DOCTOR_ID;
        var SITE_ID=req.query.SITE_ID;
        var STARTDATE=req.query.STARTDATE;
        var ENDDATE=req.query.ENDDATE;
        var Specialties_id=req.query.Specialties_id?req.query.Specialties_id:'%';
        var RL_TYPE_ID=req.query.RL_TYPE_ID?req.query.RL_TYPE_ID:'%';
        var sourceType=req.query.sourceType?req.query.sourceType:'%';
        console.log("*************************************>"+JSON.stringify(req.query));
        var sql = 
            "  SELECT  DISTINCT DATE(h.`FROM_TIME`) AS APPOINTMENT_DATE                                                       "+
            "  FROM      `cln_appointment_calendar` h                                                                         "+
            "    INNER JOIN `doctor_specialities` d ON h.`DOCTOR_ID`=d.`doctor_id`                                            "+
            "    INNER JOIN `cln_specialties` spec ON d.`Specialties_id`=spec.`Specialties_id`                                "+
            "    INNER JOIN `rl_types` rltype ON rltype.`RL_TYPE_ID`=spec.`RL_TYPE_ID`                                        "+
            "    INNER JOIN `redimedsites` redimedsite ON h.`SITE_ID`=`redimedsite`.id                                        "+
            "    INNER JOIN `doctors` doctor ON doctor.`doctor_id`=h.`DOCTOR_ID`                                              "+
            "  WHERE     h.`NOTES` IS NULL                                                                                    "+
            "    AND                                                                                                          "+
            "    rltype.`SOURCE_TYPE` LIKE ? AND spec.`RL_TYPE_ID` LIKE ?  AND d.`Specialties_id` LIKE ?                      "+
            "    AND h.`DOCTOR_ID` LIKE ? AND h.`SITE_ID` LIKE ? AND h.`FROM_TIME` BETWEEN ? AND DATE_ADD(?,INTERVAL 1 DAY)   "+
            "ORDER BY APPOINTMENT_DATE ASC                                                                                    ";
            req.getConnection(function(err,connection)
            {
                var query = connection.query(sql,[sourceType,RL_TYPE_ID,Specialties_id,DOCTOR_ID,SITE_ID,STARTDATE,ENDDATE],function(err,rows)
                    {
                        if(err){
                            console.log("Error Selecting : %s ",err );
                            res.json({status:'fail'});
                        }
                        else{
                            res.json({status: 'success', data: rows});
                        }
                    });
            });
    },
    
    getAppointmentCalendar: function(req,res)
    {
        var DOCTOR_ID=req.query.DOCTOR_ID;
        var SITE_ID=req.query.SITE_ID;
        var FROM_TIME=req.query.FROM_TIME;
        var Specialties_id=req.query.Specialties_id?req.query.Specialties_id:'%';
        var RL_TYPE_ID=req.query.RL_TYPE_ID?req.query.RL_TYPE_ID:'%';
        var sourceType=req.query.sourceType?req.query.sourceType:'%';
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^>"+JSON.stringify(req.query));
        var sql =
            " SELECT  DISTINCT h.*,CONCAT(HOUR(h.`FROM_TIME`),':',MINUTE(h.`FROM_TIME`)) AS appointment_time,  "+
            "	 `redimedsite`.`Site_name`,`redimedsite`.`Site_addr`, doctor.`NAME`,spec.`Specialties_id`,     "+
            "	 spec.`Specialties_name`,`rltype`.`RL_TYPE_ID`,rltype.`Rl_TYPE_NAME`                           "+
            "  FROM 	 `cln_appointment_calendar` h                                                          "+
            "	 INNER JOIN `doctor_specialities` d ON h.`DOCTOR_ID`=d.`doctor_id`                             "+
            "	 INNER JOIN `cln_specialties` spec ON d.`Specialties_id`=spec.`Specialties_id`                 "+
            "	 INNER JOIN `rl_types` rltype ON rltype.`RL_TYPE_ID`=spec.`RL_TYPE_ID`                         "+
            "	 INNER JOIN `redimedsites` redimedsite ON h.`SITE_ID`=`redimedsite`.id                         "+
            "	 INNER JOIN `doctors` doctor ON doctor.`doctor_id`=h.`DOCTOR_ID`                               "+
            "  WHERE	 h.`NOTES` IS NULL                                                                     "+
            "	 AND                                                                                           "+
            "	 rltype.`SOURCE_TYPE` like ? and spec.`RL_TYPE_ID` LIKE ?  AND d.`Specialties_id` LIKE ?                "+
            "	 AND h.`DOCTOR_ID` LIKE ? AND h.`SITE_ID` LIKE ? AND DATE(h.`FROM_TIME`)=?                     ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[sourceType,RL_TYPE_ID,Specialties_id,DOCTOR_ID,SITE_ID,FROM_TIME],function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                    }
                    res.json(rows);
                });
        });
    },
    
    updateCalendarNote:function(req,res)
    {
        var calid=req.body.CAL_ID;
        var note=req.body.NOTES;
        req.getConnection(function(err,connection)
        {
            var query = connection.query(
                'UPDATE `cln_appointment_calendar` calendar SET calendar.`NOTES`=? WHERE calendar.`CAL_ID`=?'
                ,[note,calid],function(err,rows)
                {
                    if(err)
                    {
                        res.json({status:'success'});
                    }
                    else
                    {
                        res.json({status:'fail'});
                    }
                    res.json(rows);
                });
        });
    },
    
    list:function(req,res)
    {
        req.getConnection(function(err,connection)
        {
            var query = connection.query(
                'SELECT * FROM cln_appointment_calendar'
                ,function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                    }
                    res.json(rows);
                });
        });
    },
    
    getAppointmentCalendarById:function(req,res)
    {
        var calId=req.query.calId;
        var sql='SELECT cal.* FROM `cln_appointment_calendar` cal WHERE cal.`CAL_ID`=?';
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,calId,function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                        res.json({status:'success',data:rows[0]});
                    else
                        res.json({status:'fail'});
                }
            });
        });
    }
};
