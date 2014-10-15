/**
 * Created by meditech on 10/9/2014.
 */
var db = require('../models');
module.exports =
{
    list_appointments_calendar_upcoming:function(req,res)
    {
        var userId=req.body.userId;
        var sql=
            " SELECT 	booking.`BOOKING_ID` AS ID,                                                     "+
            " 	'REDiLEGAL' AS SOURCE_TYPE,                                                             "+
            " 	booking.`APPOINTMENT_DATE` AS DATE_UPCOMING,                                            "+
            " 	`booking`.`WRK_SURNAME` AS MESSAGE,                                                     "+
            " 	CONCAT('at ',redi.`Site_name`,' - ',redi.`Site_addr`,'; by ',doctor.NAME)AS DETAIL      "+
            " FROM 	`rl_bookings` booking                                                               "+
            " 	INNER JOIN `redimedsites` redi ON booking.`SITE_ID`=redi.`id`                           "+
            " 	INNER JOIN `doctors` doctor ON booking.`DOCTOR_ID`=doctor.`doctor_id`                   "+
            " WHERE 	booking.`APPOINTMENT_DATE`>CURRENT_TIMESTAMP AND booking.`ASS_ID`=?             "+
            " ORDER BY DATE_UPCOMING                                                                    ";
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