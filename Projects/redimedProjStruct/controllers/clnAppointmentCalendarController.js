/**
 * Created by tannv.dts@gmail.com on 9/26/2014.
 */

var db = require('../models');
module.exports =
{
    getAppointmentCalendar: function(req,res)
    {
        var DOCTOR_ID=req.query.DOCTOR_ID;
        var SITE_ID=req.query.SITE_ID;
        var FROM_TIME=req.query.FROM_TIME;
        var Specialties_id=req.query.Specialties_id;
        var RL_TYPE_ID=req.query.RL_TYPE_ID;
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^>"+JSON.stringify(req.query));
        var sql =
            " SELECT  DISTINCT h.*,CONCAT(HOUR(h.`FROM_TIME`),':',MINUTE(h.`FROM_TIME`)) AS appointment_time,                                    "+
            "	 `redimedsite`.`Site_name`,`redimedsite`.`Site_addr`, doctor.`NAME`,spec.`Specialties_id`,                                       "+
            "	 spec.`Specialties_name`                                                                                                         "+
            " FROM 	 `cln_appointment_calendar` h                                                                                                "+
            "	 INNER JOIN `doctor_specialities` d ON h.`DOCTOR_ID`=d.`doctor_id`                                                               "+
            "	 INNER JOIN `cln_specialties` spec ON d.`Specialties_id`=spec.`Specialties_id`                                                   "+
            "	 INNER JOIN `redimedsites` redimedsite ON h.`SITE_ID`=`redimedsite`.id                                                           "+
            "	 INNER JOIN `doctors` doctor ON doctor.`doctor_id`=h.`DOCTOR_ID`                                                                 "+
            " WHERE	 h.`NOTES` IS NULL                                                                                                           "+
            "	 AND                                                                                                                             "+
            "	 spec.`RL_TYPE_ID`=? AND d.`Specialties_id` LIKE ? AND h.`DOCTOR_ID` LIKE ? AND h.`SITE_ID` LIKE ? AND DATE(h.`FROM_TIME`)=?   ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[RL_TYPE_ID,Specialties_id,DOCTOR_ID,SITE_ID,FROM_TIME],function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
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

    checkSameDoctor:function(req,res)
    {
        var calId1=req.query.calId1;
        var calId2=req.query.calId2;
        var sql=" SELECT DISTINCT calendar.`DOCTOR_ID`                            "+
                " FROM 	`cln_appointment_calendar` calendar                       "+
                " WHERE	`calendar`.`CAL_ID`=? || `calendar`.`CAL_ID`=?            ";
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