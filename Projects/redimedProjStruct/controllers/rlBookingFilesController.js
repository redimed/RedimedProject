/**
 * Created by meditech on 9/26/2014.
 */
var db = require('../models');
module.exports =
{
    getNewKey:function(req,res)
    {
        req.getConnection(function(err,connection) {
            var key_result=connection.query("SELECT get_pk_value('RlBookingFiles')",function(err,rows){
                if(err)
                {
                    res.json({status:"fail"});
                }
                else
                {
                    res.json({key:rows[0]["get_pk_value('RlBookingFiles')"]});
                }
            });
        });
    },
    change_role_download:function(req,res){
        var fileId=req.body.fileId;
        var role=req.body.role;
        req.getConnection(function(err,connection)
        {
            var query = connection.query(
                'UPDATE `rl_booking_files` bfile SET bfile.`isClientDownLoad`=? WHERE bfile.`FILE_ID`=?'
                ,[role,fileId],function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'});
                    }
                    else
                    {
                        res.json({status:'success'});
                    }

                });
        });
    },
    
    // BUI VUONG
    listByBooking:function(req,res){
        var booking_id = (req.body.bookingId)?req.body.bookingId:0;
        var sql=
            " SELECT 	files.*,bookings.`ASS_ID`                                                                           "+
            " FROM 	`rl_booking_files` files INNER JOIN `rl_bookings` bookings ON files.`BOOKING_ID`=bookings.`BOOKING_ID`  "+
            " WHERE files.`BOOKING_ID`=? AND files.`isClientDownLoad`='1'                                                   ";
        req.getConnection(function(err, connection){
            var key_result = connection.query(sql,booking_id, function(err, rows){
                if(err){
                    res.json({status:err});
                }else{
                    res.json(rows);
                }
            });
        })
    }

}