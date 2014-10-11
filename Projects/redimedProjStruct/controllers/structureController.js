/**
 * Created by meditech on 10/9/2014.
 */
var db = require('../models');
module.exports =
{
    list_appointments_calendar_upcoming:function(req,res)
    {
        var userId=req.body.userId;
        var sql=" SELECT 	booking.`BOOKING_ID` AS ID,                                         "+
                "   'REDiLEGAL' AS SOURCE_TYPE,                                                 "+
                " 	booking.`APPOINTMENT_DATE` AS DATE_UPCOMING,                                "+
                " 	`booking`.`WRK_SURNAME` AS MESSAGE                                          "+
                " FROM 	`rl_bookings` booking                                                   "+
                " WHERE 	booking.`APPOINTMENT_DATE`>CURRENT_TIMESTAMP AND booking.`ASS_ID`=?     "+
                " ORDER BY DATE_UPCOMING ";
        req.getConnection(function (err, connection)
        {
            var query = connection.query(
                sql, userId, function (err, rows)
                {
                    if (err)
                    {
                        console.log("Error Selecting : %s ", err);
                        res.json({status: 'fail'});
                    }
                    else
                    {
                        res.json({status: 'success', data: rows});
                    }

                });
        });
    }
}