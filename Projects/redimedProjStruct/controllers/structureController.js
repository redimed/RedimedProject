/**
 * Created by meditech on 10/9/2014.
 */
var db = require('../models');
var kiss=require('./kissUtilsController');
module.exports =
{
    list_appointments_calendar_upcoming:function(req,res)
    {
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:'';
        if(!kiss.checkListData(userId))
        {
            kiss.exlog("list_appointments_calendar_upcoming","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
                " SELECT    booking.`BOOKING_ID` AS ID,                                             "+
                "   booking.BOOKING_TYPE AS SOURCE_NAME,                                            "+
                "   booking.`APPOINTMENT_DATE` AS DATE_UPCOMING,rltype.`Rl_TYPE_NAME` AS TYPENAME,  "+
                "   booking.`CLAIM_NO` AS CLAIM_NO,booking.`WRK_OTHERNAMES` AS FIRSTNAME,           "+
                "   CONCAT(booking.`WRK_SURNAME`,' - ',`rltype`.`Rl_TYPE_NAME`) AS NOTIFICATION,    "+
                "   `booking`.`WRK_SURNAME` AS PERSON_INFO,                                         "+
                "   CONCAT('at ',redi.`Site_name`,' by ',doctor.NAME)AS MESSAGE ,                   "+
                "   CONCAT('address: ',redi.`Site_addr`) AS DETAIL                                  "+
                " FROM  `rl_bookings` booking                                                       "+
                "   INNER JOIN `redimedsites` redi ON booking.`SITE_ID`=redi.`id`                   "+
                "   INNER JOIN `doctors` doctor ON booking.`DOCTOR_ID`=doctor.`doctor_id`           "+
                "   INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID`=rltype.`RL_TYPE_ID`        "+
                " WHERE     booking.`APPOINTMENT_DATE`>CURRENT_TIMESTAMP AND booking.`ASS_ID`=?     "+
                " ORDER BY DATE_UPCOMING                                                            ";
        req.getConnection(function (err, connection)
        {
            var query = connection.query(sql, userId, function (err, rows)
            {
                
                if (err)
                {
                    kiss.exlog("list_appointments_calendar_upcoming",err,query.sql);
                    res.json({status: 'fail'});
                }
                else
                {
                    res.json({status: 'success', data: rows});
                }

            });
        });
    },

    downloadLetterAttachFile:function(req,res){
        var sourceName=req.params.sourceName;
        var refId=req.params.refId;
        var sql= '';
        switch(sourceName)
        {
            case 'REDiLEGAL':
            case 'Vaccination':
                sql="SELECT files.*                                              "+
                    " FROM `rl_booking_files` files                               "+
                    " WHERE files.`BOOKING_ID`=? AND files.`isClientDownLoad`=1   "+
                    " LIMIT 1                                                     ";
                break;
        }

        db.sequelize.query(sql,null,{raw:true},[refId])
            .success(function(data){
                if(data.length>0)
                {
                    var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
                    var path=prefix+data[0].FILE_PATH;
                    console.log(">>>>>>>>>>>>>downloadFile:"+path);
                    res.download(path,function(err){
                        res.json({status:'fail',message:'no file exist!'});
                    });
                }
                else
                {
                    res.json({status:'fail',message:'no file exist!'});
                }

            })
            .error(function(err){
                res.json({status:'fail',message:'no file exist!'});
            })
    }
}
