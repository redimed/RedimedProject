/**
 * Created by meditech on 9/26/2014.
 */
var db = require('../models');
var rlBookingsController=require('./rlBookingsController');
var rlobUtil=require('./rlobUtilsController');

 // var gmaps=require('gmaps');
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
        var sql='UPDATE `rl_booking_files` bfile SET bfile.`isClientDownLoad`=? WHERE bfile.`FILE_ID`=?';
        var sql2='SELECT files.`BOOKING_ID` FROM `rl_booking_files` files WHERE files.`FILE_ID`=?';
        var sql3=
            " UPDATE `rl_booking_files` files                      "+
            " SET files.`isClientDownLoad`=0                       "+
            " WHERE files.`BOOKING_ID`=? AND files.`FILE_ID`<>?    ";

        db.sequelize.query(sql,null,{raw:true},[role,fileId])
            .then(function(data){
                return 'success';
            },function(err){
                return 'fail';
            })
            .then(function(data){
                if(data=='success')
                {
                    if(role==1)
                    {
                        db.sequelize.query(sql2,null,{raw:true},[fileId])
                            .then(function(data){
                                if(data.length>0)
                                {
                                    db.sequelize.query(sql3,null,{raw:true},[data[0].BOOKING_ID,fileId])
                                        .then(function(){

                                        })
                                }

                                //send email notification
                                req.body.bookingId=data[0].BOOKING_ID;
                                rlBookingsController.sendResultNotificationEmail(req,res);
                            });

                    }
                    

                    res.json({status:'success'});
                }
                else
                {
                    res.json({status:'fail'});
                }
            })

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
