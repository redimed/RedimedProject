/**
 * Created by meditech on 9/26/2014.
 */
var db = require('../models');
var rlBookingsController=require('./rlBookingsController');
var rlobUtil=require('./rlobUtilsController');
var kiss=require('./kissUtilsController');

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

    /**
     * change role download
     * tannv.dts@gmail.com
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    change_role_download:function(req,res){
        var fileId=req.body.fileId;
        var role=req.body.role;
        var sql='UPDATE `rl_booking_files` bfile SET bfile.`isClientDownLoad`=? WHERE bfile.`FILE_ID`=?';
        var sql2='SELECT files.`BOOKING_ID` FROM `rl_booking_files` files WHERE files.`FILE_ID`=?';
        var sql3=
            " UPDATE `rl_booking_files` files                      "+
            " SET files.`isClientDownLoad`=0                       "+
            " WHERE files.`BOOKING_ID`=? AND files.`FILE_ID`<>?    ";

        kiss.executeQuery(req,sql,[role,fileId],function(result){
            if(result.affectedRows>0)
            {
                kiss.executeQuery(req,sql2,[fileId],function(data){
                    if(data.length>0)
                    {
                        req.body.bookingId=data[0].BOOKING_ID;
                        rlBookingsController.sendResultNotificationEmail(req,res);

                    }
                },function(err){

                });
                res.json({status:'success'});
            }
            else
            {
                kiss.exlog("change_role_download","Khong có row nao bi anh huong");
                res.json({status:'fail'});
            }
        },function(err){
            kiss.exlog("change_role_download","Loi cau truy van");
            res.json({status:'fail'});
        });
        // db.sequelize.query(sql,null,{raw:true},[role,fileId])
        //     .then(function(data){
        //         return 'success';
        //     },function(err){
        //         return 'fail';
        //     })
        //     .then(function(data){
        //         if(data=='success')
        //         {
        //             if(role==1)
        //             {
        //                 db.sequelize.query(sql2,null,{raw:true},[fileId])
        //                     .then(function(data){
        //                         if(data.length>0)
        //                         {
        //                             db.sequelize.query(sql3,null,{raw:true},[data[0].BOOKING_ID,fileId])
        //                                 .then(function(){

        //                                 })
        //                         }

        //                         //send email notification
        //                         req.body.bookingId=data[0].BOOKING_ID;
        //                         rlBookingsController.sendResultNotificationEmail(req,res);
        //                     });

        //             }
                    

        //             res.json({status:'success'});
        //         }
        //         else
        //         {
        //             res.json({status:'fail'});
        //         }
        //     })

    },


    /**
     * Chon cac file lam file result ma khac hang co the tai ve
     * tannv.dts@gmail.com
     */
    setListResultFiles:function(req,res)
    {
        var listResult=kiss.checkData(req.body.listResult)?req.body.listResult:[];
        if(listResult.length<=0)
        {
            kiss.exlog("setListResultFiles","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }

        var listResultId=[];
        for(var i=0;i<listResult.length;i++)
        {
            listResultId.push(listResult[i].FILE_ID);
        }

        var bookingId=listResult[0].BOOKING_ID;
        kiss.beginTransaction(req,function(){
            var sql="UPDATE `rl_booking_files` SET `isClientDownLoad`=0 WHERE `BOOKING_ID`=?";
            kiss.executeQuery(req,sql,[bookingId],function(result){
                if(result.affectedRows>0)
                {
                    var sql="UPDATE `rl_booking_files` SET `isClientDownLoad`=1 WHERE `FILE_ID` IN (?)";
                    kiss.executeQuery(req,sql,[listResultId],function(result){
                        if(result.affectedRows>0)
                        {
                            kiss.commit(req,function(){
                                req.body.bookingId=bookingId;
                                rlBookingsController.sendResultNotificationEmail(req,res);
                                res.json({status:'success'});
                            },function(err){
                                kiss.exlog("setListResultFiles","Loi commit",err);
                                res.json({status:'fail'});
                            })
                        }
                        else
                        {
                            kiss.exlog("setListResultFiles","Khong co dong nao duoc cap nhat");
                            kiss.rollback(req,function(){
                                res.json({status:'fail'});
                            })
                        }
                    },function(err){
                        kiss.exlog("setListResultFiles","Loi truy van",err);
                        kiss.rollback(req,function(){
                            res.json({status:'fail'});
                        });
                    })
                }
                else
                {
                    kiss.exlog("setListResultFiles","Khong co dong nao duoc cap nhat");
                    kiss.rollback(req,function(){
                        res.json({status:'fail'});
                    })
                }
            },function(err){
                kiss.exlog("setListResultFiles","Loi truy van",err);
                kiss.rollback(req,function(){
                    res.json({status:'fail'});
                })
            });
        },function(err){
            kiss.exlog("setListResultFiles","Khong the mo transaction");
            res.json({status:'fail'});
        })
    },

    /**
     * Bo chon tat ca cac file result
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    unselectAllFileResult:function(req,res)
    {
        var bookingId=kiss.checkData(req.body.bookingId)?req.body.bookingId:'';
        if(!kiss.checkListData(bookingId))
        {
            kiss.exlog("unselectAllFileResult","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql="UPDATE `rl_booking_files` SET `isClientDownLoad`=0 WHERE `BOOKING_ID`=?";
        kiss.beginTransaction(req,function(){
            kiss.executeQuery(req,sql,[bookingId],function(result){
                kiss.commit(req,function(){
                    res.json({status:'success'});
                },function(err){
                    kiss.exlog("unselectAllFileResult","Khong the commit",err);
                })
            },function(err){
                kiss.exlog("unselectAllFileResult","Loi cau truy van",err);
                kiss.rollback(req,function(){
                    res.json({status:'fail'});
                });
            })
        },function(err){
            kiss.exlog("unselectAllFileResult","Khong the mo transaction",err);
            res.json({status:'fail'});
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
