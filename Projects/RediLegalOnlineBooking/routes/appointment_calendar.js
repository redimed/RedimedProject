/**
 * Created by meditech on 9/1/2014.
 */
function getAppointmentCalendar(req, res)
{
    var DOCTOR_ID=req.query.DOCTOR_ID;
    var SITE_ID=req.query.SITE_ID;
    var FROM_TIME=req.query.FROM_TIME;
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+DOCTOR_ID+"*"+SITE_ID+"*"+FROM_TIME);
    req.getConnection(function(err,connection)
    {
        var query = connection.query(
            "SELECT h.*,CONCAT(HOUR(h.`FROM_TIME`),':',MINUTE(h.`FROM_TIME`)) AS appointment_time FROM `cln_appointment_calendar` h WHERE h.`DOCTOR_ID`=? AND h.`SITE_ID`=? AND DATE(h.`FROM_TIME`)=?"
            ,[DOCTOR_ID,SITE_ID,FROM_TIME],function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                }
                res.json(rows);
            });
    });
};

function list(req, res)
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
}
exports.list=list;
exports.getAppointmentCalendar=getAppointmentCalendar;